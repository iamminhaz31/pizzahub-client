import { AdminMenuItems } from "@/components/admin/AdminMenuItems";

export default function AdminMenuItemsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Menu Items</h1>
        <p className="text-muted-foreground">
          Review new items, change the status of published items, or delete
          inappropriate ones. Only approved items appear on the menu.
        </p>
      </div>
      <AdminMenuItems />
    </div>
  );
}