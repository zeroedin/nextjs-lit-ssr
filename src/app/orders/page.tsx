import { getOrders } from '@/data/api';
import { OrdersTable } from '@/components/pages/OrdersTable';

export default async function OrdersPage() {
  const orders = await getOrders();
  return <OrdersTable orders={orders} />;
}
