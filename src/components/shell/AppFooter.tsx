'use client';

import Link from 'next/link';
import {
  Footer,
  FooterUniversal,
  FooterCopyright,
  FooterBlock,
  FooterSocialLink,
  SiteStatus,
} from '@/components/rhds/misc';

export default function AppFooter() {
  return (
    <Footer>
      <a slot="logo" href="https://redhat.com/en">
        <img
          alt="Red Hat logo"
          src="https://static.redhat.com/libs/redhat/brand-assets/2/corp/logo--on-dark.svg"
          loading="lazy"
        />
      </a>
      <FooterSocialLink slot="social-links" icon="linkedin">
        <a href="https://www.linkedin.com/company/red-hat">LinkedIn</a>
      </FooterSocialLink>
      <FooterSocialLink slot="social-links" icon="youtube">
        <a href="https://www.youtube.com/user/RedHatVideos">YouTube</a>
      </FooterSocialLink>
      <FooterSocialLink slot="social-links" icon="facebook">
        <a href="https://www.facebook.com/redhatinc">Facebook</a>
      </FooterSocialLink>
      <FooterSocialLink slot="social-links" icon="x">
        <a href="https://x.com/RedHat">X</a>
      </FooterSocialLink>
      <h3 slot="links">Quick Links</h3>
      <ul slot="links">
        <li><Link href="/">Dashboard</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/orders">Orders</Link></li>
        <li><Link href="/settings">Settings</Link></li>
      </ul>
      <h3 slot="links">Resources</h3>
      <ul slot="links">
        <li><a href="https://access.redhat.com">Customer Portal</a></li>
        <li><a href="https://developers.redhat.com">Developer Hub</a></li>
        <li><a href="https://ux.redhat.com">Design System</a></li>
      </ul>
      <FooterBlock slot="main-secondary">
        <h3 slot="header">About Product Hub</h3>
        <p>
          A demo application built with Next.js and Red Hat Design System web
          components, showcasing full SSR with Lit elements.
        </p>
        <SiteStatus />
      </FooterBlock>
      <FooterUniversal slot="universal">
        <h3 slot="links-primary" hidden>Red Hat corporate links</h3>
        <ul slot="links-primary">
          <li><a href="https://redhat.com/en/about/company">About Red Hat</a></li>
          <li><a href="https://redhat.com/en/jobs">Jobs</a></li>
          <li><a href="https://redhat.com/en/events">Events</a></li>
          <li><a href="https://redhat.com/en/about/office-locations">Locations</a></li>
          <li><a href="https://redhat.com/en/contact">Contact Red Hat</a></li>
          <li><a href="https://redhat.com/en/blog">Red Hat Blog</a></li>
        </ul>
        <FooterCopyright slot="links-secondary">&copy; 2026 Red Hat, Inc.</FooterCopyright>
        <h3 slot="links-secondary" hidden>Red Hat legal and privacy links</h3>
        <ul slot="links-secondary">
          <li><a href="https://redhat.com/en/about/privacy-policy">Privacy statement</a></li>
          <li><a href="https://redhat.com/en/about/terms-use">Terms of use</a></li>
          <li><a href="https://redhat.com/en/about/all-policies-guidelines">All policies and guidelines</a></li>
          <li><a href="https://redhat.com/en/about/digital-accessibility">Digital accessibility</a></li>
        </ul>
      </FooterUniversal>
    </Footer>
  );
}
