import {
  ClipboardListIcon,
  CirclePlusIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  PizzaIcon,
  ReceiptIcon,
  SettingsIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { normalizeRole } from "@/lib/navigation";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const customerNav: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboardIcon },
  { label: "My Orders", href: "/dashboard/customer/orders", icon: ClipboardListIcon },
  { label: "Profile Settings", href: "/dashboard/profile", icon: SettingsIcon },
];

const vendorNav: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboardIcon },
  { label: "My Menu Items", href: "/dashboard/vendor/menu-items", icon: PizzaIcon },
  { label: "Add Menu Item", href: "/dashboard/vendor/add-item", icon: CirclePlusIcon },
  { label: "Customer Orders", href: "/dashboard/vendor/orders", icon: ClipboardListIcon },
  { label: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCardIcon },
  { label: "Profile Settings", href: "/dashboard/profile", icon: SettingsIcon },
];

const adminNav: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboardIcon },
  { label: "Manage Users", href: "/dashboard/admin/users", icon: UsersIcon },
  { label: "Manage Menu Items", href: "/dashboard/admin/menu-items", icon: PizzaIcon },
  { label: "Transactions", href: "/dashboard/admin/transactions", icon: ReceiptIcon },
];

export function getDashboardNav(role?: string | null): DashboardNavItem[] {
  switch (normalizeRole(role)) {
    case "vendor":
      return vendorNav;
    case "admin":
      return adminNav;
    default:
      return customerNav;
  }
}