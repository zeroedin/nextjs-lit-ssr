'use client';

import { Skeleton } from '@/components/rhds/feedback';

export default function Loading() {
  return (
    <div className="page-grid">
      <div className="page-header">
        <Skeleton style={{ height: '36px', width: '160px' }} />
        <Skeleton style={{ height: '24px', width: '24px', borderRadius: '50%' }} />
      </div>

      <div className="filter-bar">
        <Skeleton style={{ height: '16px', width: '60px' }} />
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} style={{ height: '32px', width: `${70 + (i % 3) * 20}px`, borderRadius: '16px' }} />
        ))}
      </div>

      <div className="product-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', border: '1px solid var(--rh-color-border-subtle, #333)', borderRadius: '8px' }}>
            <Skeleton style={{ height: '22px', width: '80%' }} />
            <Skeleton style={{ height: '14px', width: '100%' }} />
            <Skeleton style={{ height: '14px', width: '90%' }} />
            <Skeleton style={{ height: '14px', width: '60%' }} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <Skeleton style={{ height: '24px', width: '80px', borderRadius: '12px' }} />
              <Skeleton style={{ height: '24px', width: '40px', borderRadius: '12px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <Skeleton style={{ height: '20px', width: '60px' }} />
              <Skeleton style={{ height: '20px', width: '40px' }} />
            </div>
            <Skeleton style={{ height: '36px', width: '120px', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
