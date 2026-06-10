import { ResourcesSubnav } from '@/components/pages/ResourcesSubnav';

export const dynamic = 'force-dynamic';

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-grid">
      <div className="page-header">
        <h1>Resources</h1>
      </div>

      <ResourcesSubnav />

      {children}
    </div>
  );
}
