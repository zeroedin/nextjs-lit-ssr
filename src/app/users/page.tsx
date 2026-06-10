import { getUsers } from '@/data/api';
import { UserList } from '@/components/pages/UserList';

export default async function UsersPage() {
  const users = await getUsers();
  return <UserList users={users} />;
}
