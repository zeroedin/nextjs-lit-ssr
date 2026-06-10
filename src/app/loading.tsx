'use client';

import { Skeleton } from '@/components/rhds/feedback';

export default function Loading() {
  return (
    <div className="page-grid">
      <div className="page-header">
        <Skeleton style={{ height: '36px', width: '180px' }} />
      </div>

      <div className="dashboard-stats">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px', border: '1px solid var(--rh-color-border-subtle, #333)', borderRadius: '8px' }}>
            <Skeleton style={{ height: '16px', width: '120px' }} />
            <Skeleton style={{ height: '14px', width: '80px' }} />
            <Skeleton style={{ height: '32px', width: '60px' }} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', border: '1px solid var(--rh-color-border-subtle, #333)', borderRadius: '8px' }}>
        <Skeleton style={{ height: '20px', width: '160px' }} />
        <Skeleton style={{ height: '1px', width: '100%' }} />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Skeleton style={{ height: '24px', width: '60px', borderRadius: '12px' }} />
            <Skeleton style={{ height: '16px', width: '60%' }} />
            <Skeleton style={{ height: '16px', width: '120px', marginLeft: 'auto' }} />
          </div>
        ))}
      </div>

      <div className="dashboard-summary">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', border: '1px solid var(--rh-color-border-subtle, #333)', borderRadius: '8px' }}>
            <Skeleton style={{ height: '18px', width: '120px' }} />
            <Skeleton style={{ height: '14px', width: '100%' }} />
            <Skeleton style={{ height: '14px', width: '80%' }} />
            <Skeleton style={{ height: '14px', width: '90%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
