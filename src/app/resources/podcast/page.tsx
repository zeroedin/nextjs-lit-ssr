'use client';

import dynamic from 'next/dynamic';

const AudioPlayerSection = dynamic(() => import('@/components/pages/AudioPlayerSection'), { ssr: false });

export default function ResourcesPodcastPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <AudioPlayerSection />
    </div>
  );
}
