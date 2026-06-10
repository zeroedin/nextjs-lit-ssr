import type { Product, Order, DashboardStats, ActivityItem, UserProfile, User } from '@/lib/types';
import { products } from './mock-products';
import { orders } from './mock-orders';
import { dashboardStats, recentActivity, userProfile } from './mock-stats';
import { users } from './mock-users';

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProduct(id: string): Promise<Product | null> {
  return products.find(p => p.id === id) ?? null;
}

export async function getOrders(): Promise<Order[]> {
  return orders;
}

export async function getDashboardStats(): Promise<{ stats: DashboardStats; activity: ActivityItem[] }> {
  return { stats: dashboardStats, activity: recentActivity };
}

export async function getUserProfile(): Promise<UserProfile> {
  return userProfile;
}

export async function getUsers(): Promise<User[]> {
  return users;
}
