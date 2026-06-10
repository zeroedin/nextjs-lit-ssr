import { getDashboardStats } from '@/data/api';
import { DashboardContent } from '@/components/pages/DashboardContent';

export default async function DashboardPage() {
  const { stats, activity } = await getDashboardStats();
  return <DashboardContent stats={stats} activity={activity} />;
}
