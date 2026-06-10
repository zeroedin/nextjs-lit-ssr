import type { User } from '@/lib/types';

export const users: User[] = [
  { id: 'usr-001', name: 'Alice Chen', email: 'alice.chen@example.com', role: 'admin', joinDate: '2023-01-15', status: 'active', avatar: { type: 'triangles' } },
  { id: 'usr-002', name: 'Bob Martinez', email: 'bob.martinez@example.com', role: 'developer', joinDate: '2023-03-22', status: 'active', avatar: { type: 'photo', src: 'https://randomuser.me/api/portraits/med/men/22.jpg' } },
  { id: 'usr-003', name: 'Carol Washington', email: 'carol.w@example.com', role: 'operator', joinDate: '2023-05-10', status: 'active', avatar: { type: 'squares' } },
  { id: 'usr-004', name: 'David Kim', email: 'david.kim@example.com', role: 'developer', joinDate: '2023-06-01', status: 'active', avatar: { type: 'photo', src: 'https://randomuser.me/api/portraits/med/men/45.jpg' } },
  { id: 'usr-005', name: 'Elena Popov', email: 'elena.popov@example.com', role: 'viewer', joinDate: '2023-07-18', status: 'inactive', avatar: { type: 'triangles' } },
  { id: 'usr-006', name: 'Frank O\'Brien', email: 'frank.obrien@example.com', role: 'developer', joinDate: '2023-08-30', status: 'active', avatar: { type: 'squares' } },
  { id: 'usr-007', name: 'Grace Tanaka', email: 'grace.tanaka@example.com', role: 'admin', joinDate: '2023-09-12', status: 'active', avatar: { type: 'photo', src: 'https://randomuser.me/api/portraits/med/women/31.jpg' } },
  { id: 'usr-008', name: 'Hassan Al-Rashid', email: 'hassan.ar@example.com', role: 'operator', joinDate: '2023-10-05', status: 'active', avatar: { type: 'triangles' } },
  { id: 'usr-009', name: 'Ingrid Svensson', email: 'ingrid.s@example.com', role: 'viewer', joinDate: '2023-11-20', status: 'pending', avatar: { type: 'photo', src: 'https://randomuser.me/api/portraits/med/women/55.jpg' } },
  { id: 'usr-010', name: 'James Cooper', email: 'james.cooper@example.com', role: 'developer', joinDate: '2024-01-08', status: 'active', avatar: { type: 'squares' } },
  { id: 'usr-011', name: 'Keiko Yamamoto', email: 'keiko.y@example.com', role: 'operator', joinDate: '2024-02-14', status: 'active', avatar: { type: 'triangles' } },
  { id: 'usr-012', name: 'Liam Foster', email: 'liam.foster@example.com', role: 'developer', joinDate: '2024-03-25', status: 'inactive', avatar: { type: 'photo', src: 'https://randomuser.me/api/portraits/med/men/67.jpg' } },
  { id: 'usr-013', name: 'Maya Patel', email: 'maya.patel@example.com', role: 'viewer', joinDate: '2024-04-10', status: 'active', avatar: { type: 'squares' } },
  { id: 'usr-014', name: 'Noah Bergström', email: 'noah.b@example.com', role: 'developer', joinDate: '2024-05-18', status: 'pending', avatar: { type: 'triangles' } },
  { id: 'usr-015', name: 'Olivia Santos', email: 'olivia.santos@example.com', role: 'admin', joinDate: '2024-06-02', status: 'active', avatar: { type: 'photo', src: 'https://randomuser.me/api/portraits/med/women/12.jpg' } },
];
