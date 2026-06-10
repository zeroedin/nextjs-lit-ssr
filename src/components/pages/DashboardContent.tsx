'use client';

import { useState, useEffect } from 'react';
import type { DashboardStats, ActivityItem } from '@/lib/types';
import { Card, Badge, Tag, Timestamp, Table, Icon } from '@/components/rhds/data-display';
import { Cta } from '@/components/rhds/actions';
import { Tile } from '@/components/rhds/layout';
import { Spinner } from '@/components/rhds/feedback';

const activityColor: Record<ActivityItem['type'], 'blue' | 'green' | 'purple' | 'teal'> = {
  order: 'blue',
  product: 'green',
  user: 'purple',
  system: 'teal',
};

export function DashboardContent({
  stats,
  activity,
}: {
  stats: DashboardStats;
  activity: ActivityItem[];
}) {
  const [lateActivity, setLateActivity] = useState<ActivityItem[] | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLateActivity(activity), 2000);
    return () => clearTimeout(timer);
  }, [activity]);

  const byType = (type: ActivityItem['type']) => activity.filter(a => a.type === type).length;

  return (
    <div className="page-grid">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      {/* eslint-disable @next/next/no-html-link-for-pages */}
      <div className="dashboard-stats">
        <Tile compact>
          <Icon set="standard" icon="box" slot="icon" />
          <a slot="headline" href="/products">{stats.totalProducts} Products</a>
          <p>in catalog</p>
        </Tile>
        <Tile compact>
          <Icon set="standard" icon="cart" slot="icon" />
          <a slot="headline" href="/orders">{stats.ordersThisMonth} Orders</a>
          <p>this month</p>
        </Tile>
        <Tile compact>
          <Icon set="standard" icon="credit-card" slot="icon" />
          <a slot="headline" href="/orders">${stats.revenue.toLocaleString()}</a>
          <p>revenue this month</p>
        </Tile>
        <Tile compact>
          <Icon set="standard" icon="user" slot="icon" />
          <a slot="headline" href="/users">{stats.activeUsers} Users</a>
          <p>active accounts</p>
        </Tile>
      </div>
      {/* eslint-enable @next/next/no-html-link-for-pages */}

      <Card>
        <h3 slot="header">Recent Activity</h3>
        {lateActivity ? (
          <Table>
            <table>
              <thead>
                <tr>
                  <th scope="col" data-label="Type">Type</th>
                  <th scope="col" data-label="Description">Description</th>
                  <th scope="col" data-label="Time">Time</th>
                </tr>
              </thead>
              <tbody>
                {lateActivity.map((item, i) => (
                  <tr key={i}>
                    <td data-label="Type">
                      <Tag color={activityColor[item.type]}>{item.type}</Tag>
                    </td>
                    <td data-label="Description">{item.description}</td>
                    <td data-label="Time">
                      <Timestamp date={item.timestamp} dateFormat="medium" timeFormat="short" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Table>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <Spinner size="lg" />
          </div>
        )}
        <Cta slot="footer" href="/orders">View all orders</Cta>
      </Card>

      <div className="dashboard-summary">
        <Card>
          <h3 slot="header">Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Cta variant="primary" href="/products">Browse Products</Cta>
            <Cta variant="secondary" href="/orders">View Orders</Cta>
            <Cta variant="secondary" href="/settings">Manage Settings</Cta>
          </div>
        </Card>

        <Card>
          <h3 slot="header">Activity by Type</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(['order', 'product', 'user', 'system'] as const).map(type => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ textTransform: 'capitalize' }}>{type}</span>
                <Badge number={byType(type)} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 slot="header">System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['API Gateway', 'Container Registry', 'Automation Hub', 'SSO Provider'].map(service => (
              <div key={service} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{service}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--rh-color-status-success)' }}>
                  <Icon set="ui" icon="check-circle-fill" style={{ color: 'var(--rh-color-status-success)' }} />
                  Operational
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
