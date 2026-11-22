
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
  LoaderCircle,
  RefreshCw,
  ShoppingBag,
  XCircle,
  Ban,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { MyOrdersResponse } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export function CustomerOverview() {
  const [data, setData] = useState<MyOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<MyOrdersResponse>("/api/orders/mine");
      setData(response);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

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
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={loadData}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { counts } = data;

  const stats = [
    {
      title: "Total Orders",
      value: counts.total,
      description: "All your placed orders",
      icon: ShoppingBag,
    },
    {
      title: "Pending Orders",
      value: counts.pending,
      description: "Waiting for restaurant response",
      icon: Clock3,
    },
    {
      title: "Accepted Orders",
      value: counts.accepted,
      description: "Orders accepted by restaurants",
      icon: CheckCircle2,
    },
    {
      title: "Rejected Orders",
      value: counts.rejected,
      description: "Orders rejected by restaurants",
      icon: XCircle,
    },
  ];

  const chartData = [
    { status: "Pending", orders: counts.pending },
    { status: "Accepted", orders: counts.accepted },
    { status: "Rejected", orders: counts.rejected },
    { status: "Cancelled", orders: counts.cancelled },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Customer Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Track your pizza orders and their current status.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw className="mr-2 size-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </p>
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
            <CardTitle>Order Statistics</CardTitle>
            <CardDescription>
              Breakdown of your orders by status.
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
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--card)",
                      color: "var(--card-foreground)",
                    }}
                  />
                  <Bar
                    dataKey="orders"
                    name="Orders"
                    fill="#f97316"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Your order activity at a glance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm text-muted-foreground">Completed decisions</p>
              <p className="mt-1 text-2xl font-bold">
                {counts.accepted + counts.rejected}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Awaiting response</p>
              <p className="mt-1 text-2xl font-bold">{counts.pending}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Ban className="size-4" />
              {counts.cancelled} cancelled orders
            </div>
            <Button asChild className="w-full">
              <a href="/dashboard/customer/orders">
                View My Orders
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
