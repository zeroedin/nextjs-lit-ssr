'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Order } from '@/lib/types';
import { Tag, Stat, Table, Timestamp } from '@/components/rhds/data-display';
import { Card } from '@/components/rhds/data-display';
import { Button, Dialog, MenuDropdown, Menu, MenuItem } from '@/components/rhds/actions';
import { Alert, ProgressStepper, ProgressStep } from '@/components/rhds/feedback';
import { Pagination } from '@/components/rhds/layout';

const statusColor: Record<Order['status'], 'yellow' | 'blue' | 'orange' | 'green'> = {
  pending: 'yellow',
  processing: 'blue',
  shipped: 'orange',
  delivered: 'green',
};

const PAGE_SIZE = 15;

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [showAlert, setShowAlert] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const handler = (e: Event) => {
      const md = (e.target as HTMLElement).closest?.('rh-menu-dropdown');
      if (!md?.getAttribute('data-order-id')) return;
      const orderId = md.getAttribute('data-order-id')!;
      queueMicrotask(() => {
        const selected = md.querySelector('rh-menu-item[tabindex="0"]');
        if (selected?.getAttribute('data-value') === 'view') {
          const dialog = document.getElementById(`dialog-${orderId}`) as HTMLElement & { showModal?: () => void };
          dialog?.showModal?.();
        }
      });
    };
    document.addEventListener('select', handler, true);
    return () => document.removeEventListener('select', handler, true);
  }, []);
  const currentPage = Math.max(1, Math.min(
    Math.ceil(orders.length / PAGE_SIZE),
    Number(searchParams.get('page')) || 1,
  ));

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = useMemo(
    () => orders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [orders, currentPage],
  );

  const byStatus = (status: Order['status']) => orders.filter(o => o.status === status).length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="page-grid">
      <div className="page-header">
        <h1>Orders</h1>
        <Button variant="secondary" onClick={() => setShowAlert(true)}>
          Export Report
        </Button>
      </div>

      {showAlert && (
        <Alert variant="inline" state="success" dismissable onClose={() => setShowAlert(false)}>
          <h4 slot="header">Export initiated</h4>
          <p>Your order report is being generated and will be emailed to you shortly.</p>
        </Alert>
      )}

      <div className="stats-row">
        <Card>
          <Stat>
            <span slot="title">Total</span>
            <span slot="statistic">{orders.length}</span>
          </Stat>
        </Card>
        <Card>
          <Stat>
            <span slot="title">Pending</span>
            <span slot="statistic">{byStatus('pending')}</span>
          </Stat>
        </Card>
        <Card>
          <Stat>
            <span slot="title">Shipped</span>
            <span slot="statistic">{byStatus('shipped')}</span>
          </Stat>
        </Card>
        <Card>
          <Stat>
            <span slot="title">Revenue</span>
            <span slot="statistic">${totalRevenue.toLocaleString()}</span>
          </Stat>
        </Card>
      </div>

      <Table>
        <table>
          <thead>
            <tr>
              <th scope="col" data-label="Order ID">Order ID</th>
              <th scope="col" data-label="Customer">Customer</th>
              <th scope="col" data-label="Product">Product</th>
              <th scope="col" data-label="Date">Date</th>
              <th scope="col" data-label="Status">Status</th>
              <th scope="col" data-label="Total">Total</th>
              <th scope="col" data-label="Actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map(order => (
              <tr key={order.id}>
                <td data-label="Order ID"><strong>{order.id}</strong></td>
                <td data-label="Customer">{order.customerName}</td>
                <td data-label="Product">{order.productName}</td>
                <td data-label="Date"><Timestamp date={order.date} dateFormat="medium" /></td>
                <td data-label="Status">
                  <Tag color={statusColor[order.status]}>{order.status}</Tag>
                </td>
                <td data-label="Total">{order.total === 0 ? 'Free' : `$${order.total.toLocaleString()}`}</td>
                <td data-label="Actions">
                  <MenuDropdown accessible-label={`Actions for ${order.id}`} layout="compact" data-order-id={order.id}>
                    <span slot="toggle-label">Actions</span>
                    <Menu>
                      <MenuItem data-value="view">View Details</MenuItem>
                      <MenuItem data-value="export">Export</MenuItem>
                      <MenuItem data-value="cancel" disabled={order.status === 'delivered'}>Cancel</MenuItem>
                    </Menu>
                  </MenuDropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Table>

      <Pagination key={currentPage}>
        <ol>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <li
              key={page}
              data-page={
                page === currentPage - 1 ? 'previous' :
                page === currentPage ? 'current' :
                page === currentPage + 1 ? 'next' :
                undefined
              }
            >
              <a
                href={`?page=${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </a>
            </li>
          ))}
        </ol>
      </Pagination>

      {paginatedOrders.map(order => (
        <Dialog
          key={order.id}
          id={`dialog-${order.id}`}
          variant="medium"
          style={{ display: 'contents' }}
        >
          <h2 slot="header">Order {order.id}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <strong>Customer</strong>
                <p>{order.customerName}</p>
              </div>
              <div>
                <strong>Product</strong>
                <p>{order.productName}</p>
              </div>
              <div>
                <strong>Date</strong>
                <p><Timestamp date={order.date} dateFormat="long" /></p>
              </div>
              <div>
                <strong>Total</strong>
                <p>{order.total === 0 ? 'Free' : `$${order.total.toLocaleString()}`}</p>
              </div>
            </div>

            <h3>Fulfillment Progress</h3>
            <ProgressStepper>
              {order.fulfillmentSteps.map((step, i) => (
                <ProgressStep
                  key={i}
                  state={
                    step.status === 'done' ? 'complete' :
                    step.status === 'active' ? 'active' :
                    'inactive'
                  }
                >
                  {step.label}
                  {step.date && (
                    <span slot="description">
                      <Timestamp date={step.date} dateFormat="medium" />
                    </span>
                  )}
                </ProgressStep>
              ))}
            </ProgressStepper>
          </div>
        </Dialog>
      ))}
    </div>
  );
}
