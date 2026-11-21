import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MenuItemsManager } from "@/components/vendor/MenuItemsManager";

export default function MyMenuItemsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Menu Items</h1>
          <p className="text-muted-foreground">
            View, edit, pause or delete the items you have added.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/vendor/add-item">Add Menu Item</Link>
        </Button>
      </div>
      <MenuItemsManager />
    </div>
  );
}