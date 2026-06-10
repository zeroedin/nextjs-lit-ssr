import type { DashboardStats, ActivityItem, UserProfile } from '@/lib/types';

export const dashboardStats: DashboardStats = {
  totalProducts: 12,
  ordersThisMonth: 8,
  revenue: 65451,
  activeUsers: 342,
};

export const recentActivity: ActivityItem[] = [
  { description: 'New order ORD-001 placed by Acme Corp', timestamp: '2026-06-07T14:30:00Z', type: 'order' },
  { description: 'OpenShift Container Platform updated to 4.16', timestamp: '2026-06-06T11:15:00Z', type: 'product' },
  { description: 'Globex Industries upgraded to Premium tier', timestamp: '2026-06-06T09:00:00Z', type: 'user' },
  { description: 'New order ORD-002 placed by Globex Industries', timestamp: '2026-06-06T08:45:00Z', type: 'order' },
  { description: 'Scheduled maintenance completed successfully', timestamp: '2026-06-05T22:00:00Z', type: 'system' },
  { description: 'Ansible Lightspeed added to catalog', timestamp: '2026-06-05T10:30:00Z', type: 'product' },
  { description: 'New order ORD-003 placed by Initech LLC', timestamp: '2026-06-05T09:15:00Z', type: 'order' },
  { description: '3 new user registrations', timestamp: '2026-06-04T16:00:00Z', type: 'user' },
];

export const userProfile: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'Platform Administrator',
  joinDate: '2024-03-15',
  apiKey: 'rh_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    theme: 'auto',
    language: 'en-US',
    timezone: 'America/New_York',
  },
};
