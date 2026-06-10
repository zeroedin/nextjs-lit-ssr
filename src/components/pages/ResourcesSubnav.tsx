'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Subnav, NavigationLink } from '@/components/rhds/navigation';

const sections = [
  { href: '/resources', label: 'Documentation' },
  { href: '/resources/video', label: 'Video' },
  { href: '/resources/podcast', label: 'Podcast' },
];

export function ResourcesSubnav() {
  const pathname = usePathname();

  return (
    <Subnav>
      {sections.map(({ href, label }) => (
        <NavigationLink key={href} {...(pathname === href ? { 'current-page': true } : {})}>
          <Link href={href}>{label}</Link>
        </NavigationLink>
      ))}
    </Subnav>
  );
}
