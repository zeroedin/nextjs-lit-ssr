'use client';

import { Skeleton } from '@/components/rhds/feedback';

export default function Loading() {
  return (
    <div className="page-grid">
      <div className="page-header">
        <Skeleton style={{ height: '36px', width: '100px' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', border: '1px solid var(--rh-color-border-subtle, #333)', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1.5fr 2fr 1fr 1fr 1fr', gap: '16px', padding: '12px 16px', borderBottom: '2px solid var(--rh-color-border-subtle, #444)' }}>
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} style={{ height: '14px', width: '80%' }} />
          ))}
        </div>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '0.5fr 1.5fr 2fr 1fr 1fr 1fr', gap: '16px', padding: '14px 16px', borderBottom: '1px solid var(--rh-color-border-subtle, #333)' }}>
            <Skeleton style={{ height: '32px', width: '32px', borderRadius: '50%' }} />
            <Skeleton style={{ height: '16px', width: '90%' }} />
            <Skeleton style={{ height: '16px', width: '85%' }} />
            <Skeleton style={{ height: '16px', width: '70%' }} />
            <Skeleton style={{ height: '22px', width: '60px', borderRadius: '12px' }} />
            <Skeleton style={{ height: '16px', width: '80px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
