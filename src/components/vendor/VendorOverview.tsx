
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CheckCircle2,
  Clock3,
  Crown,
  LoaderCircle,
  Pizza,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { MyMenuItemsResponse } from "@/lib/menu-items";
import type { VendorOrdersResponse } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type OverviewData = {
  menu: MyMenuItemsResponse;
  orders: VendorOrdersResponse;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export function VendorOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [menu, orders] = await Promise.all([
        apiFetch<MyMenuItemsResponse>("/api/menu-items/mine"),
        apiFetch<VendorOrdersResponse>("/api/orders/vendor"),
      ]);

      setData({ menu, orders });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  if (loading && !data) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <p className="font-medium text-destructive">{error}</p>
          <Button onClick={loadOverview} variant="outline">
            <RefreshCw className="mr-2 size-4" />
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { menu, orders } = data;

  const stats = [
    {
      title: "Total Menu Items",
      value: menu.counts.total,
      description: "All submitted menu items",
      icon: Pizza,
    },
    {
      title: "Active Menu Items",
      value: menu.counts.approved,
      description: "Approved and visible to customers",
      icon: ShoppingBag,
    },
    {
      title: "Pending Orders",
      value: orders.counts.pending,
      description: "Waiting for your response",
      icon: Clock3,
    },
    {
      title: "Accepted Orders",
      value: orders.counts.accepted,
      description: "Successfully accepted orders",
      icon: CheckCircle2,
    },
  ];

  const chartData = [
    {
      status: "Pending",
      menuItems: menu.counts.pending,
      orders: orders.counts.pending,
    },
    {
      status: "Approved",
      menuItems: menu.counts.approved,
      orders: 0,
    },
    {
      status: "Accepted",
      menuItems: 0,
      orders: orders.counts.accepted,
    },
    {
      status: "Rejected",
      menuItems: menu.counts.rejected,
      orders: orders.counts.rejected,
    },
    {
      status: "Inactive",
      menuItems: menu.counts.inactive,
      orders: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Vendor Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitor your restaurant performance and customer orders.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadOverview}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="size-5 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Menu & Order Statistics
            </CardTitle>
            <CardDescription>
              Overview of your menu item and customer order statuses.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="status"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--card)",
                      color: "var(--card-foreground)",
                    }}
                  />
                  <Bar
                    dataKey="menuItems"
                    name="Menu Items"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="orders"
                    name="Customer Orders"
                    fill="#16a34a"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="size-5 text-primary" />
              Subscription Plan
            </CardTitle>
            <CardDescription>
              Your current restaurant subscription.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">
                CURRENT PLAN
              </p>

              <p className="mt-2 text-2xl font-bold capitalize">
                {menu.plan.name}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {menu.plan.name === "premium"
                  ? "Unlimited active menu items"
                  : `${menu.plan.activeUsed} of ${menu.plan.maxActive} active items used`}
              </p>
            </div>

            {menu.plan.name === "free" && (
              <Button asChild className="w-full">
                <a href="/dashboard/vendor/subscription">
                  <Crown className="mr-2 size-4" />
                  Upgrade to Premium
                </a>
              </Button>
            )}

            {menu.plan.name === "premium" && (
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <CheckCircle2 className="size-5" />
                Premium membership active
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
