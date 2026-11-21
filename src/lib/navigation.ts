export type NavLink = {
  label: string;
  href: string;
};

export type UserRole = "customer" | "vendor" | "admin";

// Any unknown or missing role is treated as a customer.
export function normalizeRole(role?: string | null): UserRole {
  if (role === "admin" || role === "vendor") return role;
  return "customer";
}

export function getDashboardPath(role?: string | null): string {
  return `/dashboard/${normalizeRole(role)}`;
}

export const publicLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
];

// One extra link per role, shown after Home and Browse Menu.
export function getRoleLinks(role?: string | null): NavLink[] {
  switch (normalizeRole(role)) {
    case "vendor":
      return [{ label: "My Menu Items", href: "/dashboard/vendor/menu-items" }];
    case "admin":
      return [{ label: "Manage Users", href: "/dashboard/admin/users" }];
    default:
      return [{ label: "My Orders", href: "/dashboard/customer/orders" }];
  }
}

export const dashboardHref = "/dashboard";
export const profileSettingsHref = "/dashboard/profile";

export function getInitials(name?: string | null): string {
  const letters = (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return letters || "U";
}

export function formatRole(role?: string | null): string {
  const value = normalizeRole(role);
  return value.charAt(0).toUpperCase() + value.slice(1);
}