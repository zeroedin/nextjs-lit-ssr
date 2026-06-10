'use client';

import { Card, Blockquote, Readtime } from '@/components/rhds/data-display';
import { Cta } from '@/components/rhds/actions';

export default function ResourcesDocsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card>
        <h3 slot="header">Getting Started Guide</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* rh-readtime snapshots light DOM textContent in connectedCallback as the
             %t template. React children arrive after connection, so the template is
             missed. dangerouslySetInnerHTML ensures %t is present before the element
             connects. This is a known React/Lit timing issue with light DOM templates. */}
          <Readtime wordCount={1200} dangerouslySetInnerHTML={{ __html: '%t min read' }} />
          <p>
            Learn how to set up your Product Hub environment, configure your first
            products, and start managing orders. This guide covers installation,
            authentication, and basic configuration.
          </p>
          <Blockquote>
            Product Hub integrates seamlessly with existing Red Hat infrastructure,
            reducing setup time by up to 60%.
            <span slot="author">Platform Engineering Team</span>
          </Blockquote>
        </div>
        <Cta slot="footer" href="#">Read the full guide</Cta>
      </Card>

      <Card>
        <h3 slot="header">API Reference</h3>
        <p>
          Complete API documentation for integrating Product Hub with your
          existing tools and workflows. Includes authentication, rate limits,
          and endpoint specifications.
        </p>
        <Cta slot="footer" href="#">View API docs</Cta>
      </Card>

      <Card>
        <h3 slot="header">Best Practices</h3>
        <p>
          Recommended patterns for organizing products, managing orders at scale,
          and setting up notifications for your team.
        </p>
        <Cta slot="footer" href="#">Explore best practices</Cta>
      </Card>
    </div>
  );
}
