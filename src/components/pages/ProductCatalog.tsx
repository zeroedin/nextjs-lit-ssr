'use client';

import { useState, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { Card, Badge, Tag } from '@/components/rhds/data-display';
import { Cta } from '@/components/rhds/actions';
import { Chip, ChipGroup } from '@/components/rhds/forms';

export function ProductCatalog({ products }: { products: Product[] }) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category))).sort();
  }, [products]);

  const filtered = useMemo(() => {
    if (selectedCategories.size === 0) return products;
    return products.filter(p => selectedCategories.has(p.category));
  }, [products, selectedCategories]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  return (
    <div className="page-grid">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', lineHeight: 0 }}>Products <Badge number={filtered.length} /></h1>
      </div>

      <div className="filter-bar">
        <ChipGroup>
          {categories.map(cat => (
            <Chip
              key={cat}
              checked={selectedCategories.has(cat) || undefined}
              onChange={() => toggleCategory(cat)}
            >
              {cat}
            </Chip>
          ))}
        </ChipGroup>
      </div>

      <div className="product-grid">
        {filtered.map(product => (
          <Card key={product.id}>
            <h3 slot="header">{product.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p>{product.description}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Tag>{product.category}</Tag>
                {!product.inStock && (
                  <Tag color="red">Out of Stock</Tag>
                )}
              </div>
              <strong style={{ fontSize: '1.25rem' }}>
                {product.price === 0 ? 'Free' : `$${product.price.toLocaleString()}`}
              </strong>
            </div>
            <div slot="footer" style={{ display: 'flex', gap: '8px' }}>
              <Cta variant="primary" href={`/products/${product.id}`}>View Details</Cta>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', padding: '48px 0', color: 'var(--rh-color-text-secondary, #666)' }}>
          No products found matching the selected filters.
        </p>
      )}
    </div>
  );
}
