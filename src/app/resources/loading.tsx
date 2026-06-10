'use client';

import { Skeleton } from '@/components/rhds/feedback';

export default function Loading() {
  return (
    <div className="page-grid">
      <div className="page-header">
        <Skeleton style={{ height: '36px', width: '170px' }} />
      </div>

      <div style={{ display: 'flex', gap: '24px', borderBottom: '2px solid var(--rh-color-border-subtle, #333)', paddingBottom: '8px' }}>
        <Skeleton style={{ height: '18px', width: '110px' }} />
        <Skeleton style={{ height: '18px', width: '60px' }} />
        <Skeleton style={{ height: '18px', width: '70px' }} />
      </div>

      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', border: '1px solid var(--rh-color-border-subtle, #333)', borderRadius: '8px' }}>
          <Skeleton style={{ height: '20px', width: '200px' }} />
          <Skeleton style={{ height: '14px', width: '100%' }} />
          <Skeleton style={{ height: '14px', width: '90%' }} />
          <Skeleton style={{ height: '14px', width: '70%' }} />
          <Skeleton style={{ height: '18px', width: '140px', marginTop: '8px' }} />
        </div>
      ))}
    </div>
  );
}
