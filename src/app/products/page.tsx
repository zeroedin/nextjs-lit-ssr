import { getProducts } from '@/data/api';
import { ProductCatalog } from '@/components/pages/ProductCatalog';

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductCatalog products={products} />;
}
