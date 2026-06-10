'use client';

import { Skeleton } from '@/components/rhds/feedback';

export default function Loading() {
  return (
    <div className="page-grid">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Skeleton style={{ height: '16px', width: '80px' }} />
        <Skeleton style={{ height: '16px', width: '16px' }} />
        <Skeleton style={{ height: '16px', width: '70px' }} />
        <Skeleton style={{ height: '16px', width: '16px' }} />
        <Skeleton style={{ height: '16px', width: '140px' }} />
      </div>

      <div className="page-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton style={{ height: '36px', width: '320px' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <Skeleton style={{ height: '24px', width: '100px', borderRadius: '12px' }} />
            <Skeleton style={{ height: '24px', width: '110px', borderRadius: '12px' }} />
            <Skeleton style={{ height: '24px', width: '90px', borderRadius: '12px' }} />
            <Skeleton style={{ height: '16px', width: '70px' }} />
          </div>
        </div>
        <Skeleton style={{ height: '36px', width: '120px' }} />
      </div>

      <div className="detail-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Skeleton style={{ height: '60px', width: '100%' }} />

          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--rh-color-border-subtle, #333)', paddingBottom: '8px' }}>
            <Skeleton style={{ height: '18px', width: '100px' }} />
            <Skeleton style={{ height: '18px', width: '90px' }} />
            <Skeleton style={{ height: '18px', width: '80px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} style={{ display: 'contents' }}>
                <Skeleton style={{ height: '16px', width: '100px' }} />
                <Skeleton style={{ height: '16px', width: '60%' }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px' }}>
            <Skeleton style={{ height: '24px', width: '280px', marginBottom: '16px' }} />
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--rh-color-border-subtle, #333)' }}>
                <Skeleton style={{ height: '18px', width: '70%' }} />
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-stack">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', border: '1px solid var(--rh-color-border-subtle, #333)', borderRadius: '8px' }}>
            <Skeleton style={{ height: '18px', width: '80px' }} />
            <Skeleton style={{ height: '36px', width: '100px' }} />
            <Skeleton style={{ height: '16px', width: '140px' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <Skeleton style={{ height: '40px', width: '120px', borderRadius: '4px' }} />
              <Skeleton style={{ height: '40px', width: '120px', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px', border: '1px solid var(--rh-color-border-subtle, #333)', borderRadius: '8px' }}>
            <Skeleton style={{ height: '18px', width: '110px' }} />
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} style={{ height: '16px', width: `${70 + i * 5}%` }} />
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px', border: '1px solid var(--rh-color-border-subtle, #333)', borderRadius: '8px' }}>
            <Skeleton style={{ height: '18px', width: '120px' }} />
            <Skeleton style={{ height: '36px', width: '120px' }} />
            <Skeleton style={{ height: '14px', width: '130px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
