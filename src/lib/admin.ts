import type { MenuItem } from "@/lib/menu-items";

export type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminOverview = {
  totals: {
    users: number;
    vendors: number;
    customers: number;
    menuItems: number;
    pendingMenuItems: number;
    transactions: number;
    revenue: number;
  };
  menuItemsByStatus: Record<"pending" | "approved" | "rejected" | "inactive", number>;
  ordersByStatus: Record<"pending" | "accepted" | "rejected" | "cancelled", number>;
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  image: string | null;
  role: "customer" | "vendor" | "admin";
  isBlocked: boolean;
  businessName: string | null;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt: string | null;
  createdAt: string | null;
};

export type AdminUsersResponse = {
  users: AdminUser[];
  pagination: PaginationInfo;
};

export type AdminUserDetails = {
  user: AdminUser;
  stats: { menuItems?: number; ordersReceived?: number; ordersPlaced?: number };
};

export type AdminVendor = {
  _id: string;
  name: string;
  email: string;
  businessName: string | null;
};

export type AdminMenuItem = MenuItem & { vendor: AdminVendor | null };

export type AdminMenuItemsResponse = {
  items: AdminMenuItem[];
  counts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    inactive: number;
  };
  pagination: PaginationInfo;
};

export type AdminTransaction = {
  _id: string;
  vendor: AdminVendor | null;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  stripeSessionId: string | null;
  createdAt: string;
};

export type AdminTransactionsResponse = {
  transactions: AdminTransaction[];
  pagination: PaginationInfo;
};

export function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export function formatMoney(amount: number, currency: string) {
  return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
}

export function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}