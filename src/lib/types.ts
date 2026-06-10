export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  stockCount: number;
  rating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  features: string[];
  specs: Record<string, string>;
  reviews: Review[];
  faq: FaqItem[];
}

export interface Review {
  author: string;
  date: string;
  rating: number;
  comment: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Order {
  id: string;
  customerName: string;
  productName: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  fulfillmentSteps: FulfillmentStep[];
}

export interface FulfillmentStep {
  label: string;
  status: 'done' | 'active' | 'pending';
  date?: string;
}

export interface DashboardStats {
  totalProducts: number;
  ordersThisMonth: number;
  revenue: number;
  activeUsers: number;
}

export interface ActivityItem {
  description: string;
  timestamp: string;
  type: 'order' | 'product' | 'user' | 'system';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer' | 'operator';
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  avatar: { type: 'triangles' } | { type: 'squares' } | { type: 'photo'; src: string };
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  joinDate: string;
  apiKey: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
  };
}
