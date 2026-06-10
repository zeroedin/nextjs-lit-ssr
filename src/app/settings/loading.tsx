'use client';

import { Skeleton } from '@/components/rhds/feedback';

export default function Loading() {
  return (
    <div className="page-grid">
      <div className="page-header">
        <Skeleton style={{ height: '36px', width: '150px' }} />
      </div>

      <div className="settings-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', border: '1px solid var(--rh-color-border-subtle, #333)', borderRadius: '8px' }}>
          <Skeleton style={{ height: '18px', width: '80px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Skeleton style={{ height: '48px', width: '48px', borderRadius: '50%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Skeleton style={{ height: '18px', width: '140px' }} />
              <Skeleton style={{ height: '14px', width: '180px' }} />
              <Skeleton style={{ height: '14px', width: '130px' }} />
            </div>
          </div>
        </div>

        {['Notifications', 'Locale', 'API Access'].map(section => (
          <div key={section} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--rh-color-border-subtle, #333)' }}>
            <Skeleton style={{ height: '20px', width: `${80 + section.length * 5}px` }} />
            <Skeleton style={{ height: '16px', width: '16px' }} />
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <Skeleton style={{ height: '36px', width: '80px', borderRadius: '4px' }} />
          <Skeleton style={{ height: '36px', width: '120px', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  );
}
