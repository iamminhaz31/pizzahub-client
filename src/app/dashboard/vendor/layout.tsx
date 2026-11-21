import { requireRole } from "@/lib/session";

export default async function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("vendor");
  return <>{children}</>;
}