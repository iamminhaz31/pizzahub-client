"use client";

import Link from "next/link";
import {
  ClipboardCheckIcon,
  DollarSignIcon,
  PizzaIcon,
  ReceiptIcon,
  StoreIcon,
  UsersIcon,
  UtensilsCrossedIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney, type AdminOverview as OverviewData } from "@/lib/admin";
import { useApiData } from "@/lib/use-api-data";

const ITEM_COLORS = {
  Pending: "#f59e0b",
  Approved: "#16a34a",
  Rejected: "#c8102e",
  Inactive: "#a8a29e",
};

const ORDER_COLORS = {
  Pending: "#f59e0b",
  Accepted: "#16a34a",
  Rejected: "#c8102e",
  Cancelled: "#a8a29e",
};

function toChartData(
  values: Record<string, number>,
  colors: Record<string, string>
) {
  return Object.entries(values).map(([key, value]) => {
    const name = key.charAt(0).toUpperCase() + key.slice(1);
    return { name, value, fill: colors[name] ?? "#a8a29e" };
  });
}

export function AdminOverview() {
  const { data, error, ready, reload } = useApiData<OverviewData>(
    "/api/admin/overview"
  );

  if (!ready) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="font-medium text-destructive">
          {error ?? "Could not load the overview."}
        </p>
        <Button variant="outline" className="mt-4" onClick={reload}>
          Try again
        </Button>
      </div>
    );
  }

  const { totals } = data;
  const itemData = toChartData(data.menuItemsByStatus, ITEM_COLORS);
  const orderData = toChartData(data.ordersByStatus, ORDER_COLORS);
  const orderTotal = orderData.reduce((sum, row) => sum + row.value, 0);

  return (
    <div className="space-y-6">
      {totals.pendingMenuItems > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm">
          <p className="font-medium text-amber-900">
            {totals.pendingMenuItems} menu{" "}
            {totals.pendingMenuItems === 1 ? "item is" : "items are"} waiting for
            review.
          </p>
          <Button asChild size="sm">
            <Link href="/dashboard/admin/menu-items">Review now</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Users" value={totals.users} icon={UsersIcon} />
        <StatCard label="Vendors" value={totals.vendors} icon={StoreIcon} />
        <StatCard label="Customers" value={totals.customers} icon={UsersIcon} />
        <StatCard
          label="Total Menu Items"
          value={totals.menuItems}
          icon={PizzaIcon}
        />
        <StatCard
          label="Pending Menu Items"
          value={totals.pendingMenuItems}
          icon={ClipboardCheckIcon}
        />
        <StatCard
          label="Total Transactions"
          value={totals.transactions}
          icon={ReceiptIcon}
          hint={`Revenue: ${formatMoney(totals.revenue, "usd")}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-4">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <UtensilsCrossedIcon className="size-4 text-primary" />
            Menu items by status
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={itemData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Items" radius={[6, 6, 0, 0]}>
                  {itemData.map((row) => (
                    <Cell key={row.name} fill={row.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-4">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <DollarSignIcon className="size-4 text-primary" />
            Orders by status
          </h2>
          {orderTotal === 0 ? (
            <div className="grid h-72 place-items-center text-sm text-muted-foreground">
              No orders yet.
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {orderData.map((row) => (
                      <Cell key={row.name} fill={row.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}