import { AdminOverview } from "@/components/admin/AdminOverview";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground">
          Platform activity at a glance.
        </p>
      </div>
      <AdminOverview />
    </div>
  );
}