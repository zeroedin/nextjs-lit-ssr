'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, Tag, Avatar, Timestamp, HealthIndex, Blockquote, Readtime, Icon } from '@/components/rhds/data-display';
import { Breadcrumb } from '@/components/rhds/navigation';
import { Cta, ButtonGroup } from '@/components/rhds/actions';
import { Tabs, Tab, TabPanel, Accordion, AccordionHeader, AccordionPanel, Surface, JumpLinks, JumpLink } from '@/components/rhds/layout';
import { Tooltip } from '@/components/rhds/feedback';

export function ProductDetail({ product }: { product: Product }) {
  const wordCount = product.description.split(/\s+/).length
    + product.features.join(' ').split(/\s+/).length
    + Object.entries(product.specs).flat().join(' ').split(/\s+/).length;

  return (
    <div className="page-grid">
      <Breadcrumb>
        <ol>
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li><Link href={`/products/${product.id}`} aria-current="page">{product.name}</Link></li>
        </ol>
      </Breadcrumb>

      <div className="page-header">
        <div>
          <h1>{product.name}</h1>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Tag>{product.category}</Tag>
            {product.features.slice(0, 3).map(f => (
              <Tag key={f} variant="outline">{f}</Tag>
            ))}
            <Readtime wordCount={wordCount} />
          </div>
        </div>
      </div>

      <div className="detail-layout">
        <div>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '24px' }}>
            {product.description}
          </p>

          <h2 id="details" style={{ marginBottom: '16px' }}>Product Details</h2>
          <Tabs>
            <Tab slot="tab">Specifications</Tab>
            <TabPanel>
              <Surface>
                <div id="specs" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', padding: '16px 0' }}>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} style={{ display: 'contents' }}>
                      <Tooltip content={`Technical detail: ${key}`}>
                        <strong>{key}</strong>
                      </Tooltip>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </Surface>
            </TabPanel>

            <Tab slot="tab">Reviews ({product.reviews.length})</Tab>
            <TabPanel>
              <div id="reviews" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
                {product.reviews.map((review, i) => (
                  <Card key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar plain name={review.author} />
                      <div>
                        <strong>{review.author}</strong>
                        <br />
                        <Timestamp date={review.date} dateFormat="long" />
                      </div>
                      <span style={{ marginLeft: 'auto' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p style={{ marginTop: '8px' }}>{review.comment}</p>
                  </Card>
                ))}
              </div>
            </TabPanel>

            <Tab slot="tab">Testimonials</Tab>
            <TabPanel>
              <div id="testimonials" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
                {product.reviews.map((review, i) => (
                  <Blockquote key={i}>
                    {review.comment}
                    <span slot="author">{review.author}</span>
                  </Blockquote>
                ))}
              </div>
            </TabPanel>

            <Tab slot="tab">Features</Tab>
            <TabPanel>
              <ul id="features" style={{ padding: '16px 0 16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {product.features.map(f => (
                  <li key={f}>
                    <Icon set="ui" icon="check-circle" style={{ marginRight: '8px', color: 'var(--rh-color-status-success)' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </TabPanel>
          </Tabs>

          {product.faq.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h2 id="faq" style={{ marginBottom: '16px' }}>Frequently Asked Questions</h2>
              <Accordion>
                {product.faq.map((item, i) => (
                  <Fragment key={i}>
                    <AccordionHeader>
                      <h3>{item.question}</h3>
                    </AccordionHeader>
                    <AccordionPanel>
                      <p>{item.answer}</p>
                    </AccordionPanel>
                  </Fragment>
                ))}
              </Accordion>
            </div>
          )}

          <div style={{ marginTop: '32px' }}>
            <h2 id="getting-started" style={{ marginBottom: '16px' }}>Getting Started</h2>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <span style={{ background: 'var(--rh-color-interactive-primary-default, #06c)', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>1</span>
                  <div>
                    <strong>Request access</strong>
                    <p style={{ color: 'var(--rh-color-text-secondary, #666)', marginTop: '4px' }}>
                      Sign up for a Red Hat account and activate your subscription or developer license for {product.name}.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <span style={{ background: 'var(--rh-color-interactive-primary-default, #06c)', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>2</span>
                  <div>
                    <strong>Download and install</strong>
                    <p style={{ color: 'var(--rh-color-text-secondary, #666)', marginTop: '4px' }}>
                      Download the latest release from the Customer Portal and follow the installation guide for your target environment.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <span style={{ background: 'var(--rh-color-interactive-primary-default, #06c)', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>3</span>
                  <div>
                    <strong>Configure and connect</strong>
                    <p style={{ color: 'var(--rh-color-text-secondary, #666)', marginTop: '4px' }}>
                      Register with Red Hat Insights for proactive analytics, enable content repositories, and apply initial security policies.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <span style={{ background: 'var(--rh-color-interactive-primary-default, #06c)', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>4</span>
                  <div>
                    <strong>Deploy your workloads</strong>
                    <p style={{ color: 'var(--rh-color-text-secondary, #666)', marginTop: '4px' }}>
                      Start deploying applications and services. Refer to the product documentation for best practices and architecture guidance.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
              <Cta variant="primary" href="#">View Documentation</Cta>
              <Cta variant="secondary" href="#">Contact Sales</Cta>
            </div>
          </div>
        </div>

        <div className="sidebar-stack">
          <Card>
            <h3 slot="header">Pricing</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700 }}>
                {product.price === 0 ? 'Free' : `$${product.price.toLocaleString()}`}
              </span>
              <span style={{ color: product.inStock ? 'var(--rh-color-green-500, green)' : 'var(--rh-color-red-500, red)' }}>
                {product.inStock ? `In stock (${product.stockCount.toLocaleString()} available)` : 'Out of stock'}
              </span>
              <ButtonGroup>
                {product.inStock && (
                  <Cta variant="primary" href="#">Add to Cart</Cta>
                )}
                <Cta variant="secondary" href="#">Request Demo</Cta>
              </ButtonGroup>
            </div>
          </Card>

          <Card>
            <h3 slot="header" id="jump-links-title">On This Page</h3>
            <JumpLinks aria-labelledby="jump-links-title">
              <JumpLink href="#details">Product Details</JumpLink>
              <JumpLink href="#faq">FAQ</JumpLink>
              <JumpLink href="#getting-started">Getting Started</JumpLink>
            </JumpLinks>
          </Card>

          <Card>
            <h3 slot="header">Quality Rating</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 0' }}>
              <HealthIndex grade={product.rating} size="lg" />
              <span>Overall product health</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
