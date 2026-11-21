import { requireRole } from "@/lib/session";

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("customer");
  return <>{children}</>;
}