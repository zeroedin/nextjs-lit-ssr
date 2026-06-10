import { getUserProfile } from '@/data/api';
import { SettingsPanel } from '@/components/pages/SettingsPanel';

export default async function SettingsPage() {
  const profile = await getUserProfile();
  return <SettingsPanel profile={profile} />;
}
