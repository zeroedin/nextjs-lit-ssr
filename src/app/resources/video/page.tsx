'use client';

import { Card } from '@/components/rhds/data-display';
import { VideoEmbed } from '@/components/rhds/misc';

export default function ResourcesVideoPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card>
        <h3 slot="header">Rick Astley — Never Gonna Give You Up</h3>
        <VideoEmbed>
          <img
            slot="thumbnail"
            src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
            alt="Rick Astley - Never Gonna Give You Up video thumbnail"
          />
          <template dangerouslySetInnerHTML={{ __html: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Rick Astley - Never Gonna Give You Up" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' }} />
          <p slot="caption">
            The classic 1987 hit that became the internet&apos;s most beloved meme.
            You just got rickrolled.
          </p>
        </VideoEmbed>
      </Card>
    </div>
  );
}
