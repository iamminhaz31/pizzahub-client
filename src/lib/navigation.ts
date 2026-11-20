export type NavLink = {
  label: string;
  href: string;
};

export const publicLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
];

// One extra link per role, shown after Home and Browse Menu.
export function getRoleLinks(role?: string | null): NavLink[] {
  switch (role) {
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
  if (!role) return "Customer";
  return role.charAt(0).toUpperCase() + role.slice(1);
}