"use client";

import Link from "next/link";

import { OrderDialog } from "@/components/menu/OrderDialog";
import type { PublicMenuItem } from "@/lib/browse-menu";

export type Viewer = {
  id: string;
  role: "customer" | "vendor" | "admin";
};

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function OrderPanel({
  item,
  viewer,
}: {
  item: PublicMenuItem;
  viewer: Viewer;
}) {
  if (viewer.role === "admin") {
    return <Notice>Admin accounts cannot place customer orders.</Notice>;
  }

  if (viewer.role === "vendor") {
    if (item.vendorId === viewer.id) {
      return (
        <Notice>
          This is your own menu item, so you cannot order it.{" "}
          <Link
            href="/dashboard/vendor/menu-items"
            className="font-medium text-primary hover:underline"
          >
            Manage your menu items
          </Link>
        </Notice>
      );
    }
    return (
      <Notice>
        Vendor accounts cannot place orders. Please sign in with a customer
        account to order.
      </Notice>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">
        Choose your delivery date and address, and the restaurant will confirm
        your order.
      </p>
      <OrderDialog item={item} />
    </div>
  );
}