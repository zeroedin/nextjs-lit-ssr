import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/data/api';
import { ProductDetail } from '@/components/pages/ProductDetail';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(p => ({ id: p.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
