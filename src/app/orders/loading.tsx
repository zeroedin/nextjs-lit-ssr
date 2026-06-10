'use client';

import { Skeleton } from '@/components/rhds/feedback';

export default function Loading() {
  return (
    <div className="page-grid">
      <div className="page-header">
        <Skeleton style={{ height: '36px', width: '130px' }} />
        <Skeleton style={{ height: '36px', width: '130px', borderRadius: '4px' }} />
      </div>

      <div className="stats-row">
        {['Total', 'Pending', 'Shipped', 'Revenue'].map(label => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px', border: '1px solid var(--rh-color-border-subtle, #333)', borderRadius: '8px' }}>
            <Skeleton style={{ height: '14px', width: '60px' }} />
            <Skeleton style={{ height: '28px', width: '50px' }} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', border: '1px solid var(--rh-color-border-subtle, #333)', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.5fr 1fr 0.8fr 0.8fr 0.5fr', gap: '16px', padding: '12px 16px', borderBottom: '2px solid var(--rh-color-border-subtle, #444)' }}>
          {['Order ID', 'Customer', 'Product', 'Date', 'Status', 'Total', ''].map((_, i) => (
            <Skeleton key={i} style={{ height: '14px', width: i === 6 ? '20px' : '80%' }} />
          ))}
        </div>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.5fr 1fr 0.8fr 0.8fr 0.5fr', gap: '16px', padding: '14px 16px', borderBottom: '1px solid var(--rh-color-border-subtle, #333)' }}>
            <Skeleton style={{ height: '16px', width: '70px' }} />
            <Skeleton style={{ height: '16px', width: '90%' }} />
            <Skeleton style={{ height: '16px', width: '85%' }} />
            <Skeleton style={{ height: '16px', width: '80px' }} />
            <Skeleton style={{ height: '22px', width: '70px', borderRadius: '12px' }} />
            <Skeleton style={{ height: '16px', width: '60px' }} />
            <Skeleton style={{ height: '20px', width: '20px' }} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} style={{ height: '32px', width: '32px', borderRadius: '4px' }} />
        ))}
      </div>
    </div>
  );
}
