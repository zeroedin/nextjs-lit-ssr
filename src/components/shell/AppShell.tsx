'use client';

import '@lit-labs/ssr-client/lit-element-hydrate-support.js';
import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { NavigationPrimary, NavigationPrimaryItem, SkipLink } from '@/components/rhds/navigation';
import { Announcement, BackToTop } from '@/components/rhds/feedback';
import { SchemeToggle } from '@/components/rhds/forms';

const AppFooter = dynamic(() => import('./AppFooter'), { ssr: false });

const navItems = [
  { href: '/products', label: 'Products' },
  { href: '/orders', label: 'Orders' },
  { href: '/users', label: 'Users' },
  { href: '/resources', label: 'Resources' },
  { href: '/settings', label: 'Settings' },
];

// Tracks the current color scheme so components like rh-announcement can
// receive the correct color-palette prop. Reads from localStorage
// (rhdsColorScheme, set by rh-scheme-toggle) and falls back to the system
// prefers-color-scheme media query. A MutationObserver on <body> catches
// scheme changes triggered by the toggle without requiring a re-render.
function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => {
      const scheme = localStorage.getItem('rhdsColorScheme') ?? (localStorage as Storage & { rhdsColorScheme?: string }).rhdsColorScheme;
      if (scheme === 'dark') return setIsDark(true);
      if (scheme === 'light') return setIsDark(false);
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    };
    check();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', check);
    // rh-scheme-toggle's internal change event fires on a <fieldset> inside
    // shadow DOM and doesn't compose across the shadow boundary, so there's
    // no event to listen for on the host element. We use a MutationObserver
    // on the reflected `scheme` attribute as a workaround.
    // TODO: file upstream — rh-scheme-toggle should emit a composed event
    const toggle = document.querySelector('rh-scheme-toggle');
    const observer = toggle
      ? new MutationObserver(() => check())
      : null;
    observer?.observe(toggle!, { attributes: true, attributeFilter: ['scheme'] });
    return () => {
      mq.removeEventListener('change', check);
      observer?.disconnect();
    };
  }, []);
  return isDark;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const isDark = useIsDark();

  // Intercept clicks on <a> tags inside shadow DOM and route them through
  // Next.js instead of triggering a full page navigation. This is needed
  // for components like rh-cta that render an <a> in their shadow root
  // from the href attribute — React can't attach handlers to those links.
  // We only intercept same-origin, unmodified left-clicks.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const path = e.composedPath();
      const anchor = path.find(
        (el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement,
      );
      if (!anchor) return;
      if (!path.some(el => el instanceof ShadowRoot)) return;
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (anchor.target && anchor.target !== '_self') return;
      e.preventDefault();
      router.push(url.pathname + url.search + url.hash);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [router]);

  // Force rh-navigation-primary into the correct responsive state on mount.
  // React's hydration lifecycle doesn't follow the same sequence as a
  // standard custom element upgrade, so the component's internal responsive
  // state never gets set correctly despite the element already having its
  // final dimensions in the DOM via SSR. We manually sync the state after
  // Lit's updateComplete as a workaround.
  // See: https://github.com/RedHat-UX/red-hat-design-system/issues/2442
  useEffect(() => {
    const el = navRef.current as HTMLElement & {
      compact?: boolean;
      linksCompact?: boolean;
      _hamburgerOpen?: boolean;
      _linksMenuOpen?: boolean;
      updateComplete?: Promise<boolean>;
      requestUpdate?: () => void;
    };
    if (el) {
      (async () => {
        el.requestUpdate?.();
        await el.updateComplete;
        const isCompact = el.offsetWidth < 1200;
        const isLinksCompact = el.offsetWidth < 1440;
        el.compact = isCompact;
        el.linksCompact = isLinksCompact;
        if (!isCompact) {
          el._hamburgerOpen = true;
        }
        if (!isLinksCompact) {
          el._linksMenuOpen = true;
        }
        el.requestUpdate?.();
        await el.updateComplete;
        const container = el.shadowRoot?.querySelector('#container');
        if (container) {
          container.classList.toggle('compact', isCompact);
          container.classList.remove('dehydrated');
        }
        const hamburger = el.shadowRoot?.querySelector('#hamburger');
        if (hamburger && !isCompact) {
          hamburger.setAttribute('open', '');
        }
        const linksMenu = el.shadowRoot?.querySelector('#links-menu');
        if (linksMenu && !isLinksCompact) {
          linksMenu.setAttribute('open', '');
        }
      })();
    }
  }, []);

  const setNavRef = useCallback((node: HTMLElement | null) => {
    navRef.current = node;
  }, []);

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      <Announcement dismissable color-palette={isDark ? 'darker' : 'lighter'}>
        Welcome to <strong>Product Hub</strong> — a Next.js + Red Hat Design System demo showcasing Lit SSR with all RHDS components.
      </Announcement>

      <NavigationPrimary ref={setNavRef} siteName="Product Hub" siteHref="/">
        {navItems.map(item => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <NavigationPrimaryItem key={item.href}>
              <Link href={item.href} aria-current={active ? 'page' : undefined}>
                {item.label}
              </Link>
            </NavigationPrimaryItem>
          );
        })}
        <div slot="dropdowns" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <SchemeToggle />
        </div>
      </NavigationPrimary>

      <main id="main-content">
        {children}
      </main>

      <BackToTop href="#main-content" />

      <AppFooter />
    </>
  );
}
