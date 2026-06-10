'use client';

import type { User } from '@/lib/types';
import { Avatar, Tag, Table, Timestamp } from '@/components/rhds/data-display';

const statusColor: Record<User['status'], 'green' | 'yellow' | 'red'> = {
  active: 'green',
  pending: 'yellow',
  inactive: 'red',
};

const roleColor: Record<User['role'], 'purple' | 'blue' | 'teal' | 'orange'> = {
  admin: 'purple',
  developer: 'blue',
  operator: 'teal',
  viewer: 'orange',
};

function avatarProps(user: User) {
  if (user.avatar.type === 'photo') return { plain: true, src: user.avatar.src, name: user.name };
  return { plain: true, pattern: user.avatar.type, name: user.name };
}

export function UserList({ users }: { users: User[] }) {
  return (
    <div className="page-grid">
      <div className="page-header">
        <h1>Users</h1>
      </div>

      <Table>
        <table>
          <thead>
            <tr>
              <th scope="col" data-label="Avatar"></th>
              <th scope="col" data-label="Name">Name</th>
              <th scope="col" data-label="Email">Email</th>
              <th scope="col" data-label="Role">Role</th>
              <th scope="col" data-label="Status">Status</th>
              <th scope="col" data-label="Joined">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td data-label="Avatar">
                  <Avatar {...avatarProps(user)} />
                </td>
                <td data-label="Name"><strong>{user.name}</strong></td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Role"><Tag color={roleColor[user.role]}>{user.role}</Tag></td>
                <td data-label="Status">
                  <Tag color={statusColor[user.status]}>{user.status}</Tag>
                </td>
                <td data-label="Joined">
                  <Timestamp date={user.joinDate} dateFormat="medium" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Table>
    </div>
  );
}
