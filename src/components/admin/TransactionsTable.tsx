"use client";

import { useState } from "react";

import { Pagination } from "@/components/admin/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDate,
  formatMoney,
  type AdminTransactionsResponse,
} from "@/lib/admin";
import { useApiData } from "@/lib/use-api-data";

const STATUS_STYLES: Record<string, string> = {
  paid: "border-green-300 bg-green-100 text-green-800",
  pending: "border-amber-300 bg-amber-100 text-amber-800",
  failed: "border-red-300 bg-red-100 text-red-800",
  expired: "border-stone-300 bg-stone-100 text-stone-700",
  cancelled: "border-stone-300 bg-stone-100 text-stone-700",
};

export function TransactionsTable() {
  const [page, setPage] = useState(1);
  const { data, error, loading, ready, reload } =
    useApiData<AdminTransactionsResponse>(
      `/api/admin/transactions${page > 1 ? `?page=${page}` : ""}`
    );

  if (!ready) return <Skeleton className="h-80 rounded-xl" />;

  if (!data) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="font-medium text-destructive">
          {error ?? "Could not load transactions."}
        </p>
        <Button variant="outline" className="mt-4" onClick={reload}>
          Try again
        </Button>
      </div>
    );
  }

  if (data.pagination.total === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="font-medium">No transactions yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Premium subscription payments from vendors will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {data.pagination.total}{" "}
        {data.pagination.total === 1 ? "transaction" : "transactions"} · Payment
        records are read-only.
      </p>

      <div
        className={`overflow-x-auto rounded-xl border bg-card ${
          loading ? "opacity-60 transition-opacity" : ""
        }`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>
                  <p className="font-medium">
                    {transaction.vendor?.businessName ||
                      transaction.vendor?.name ||
                      "Unknown vendor"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.vendor?.email ?? ""}
                  </p>
                </TableCell>
                <TableCell className="capitalize">{transaction.plan}</TableCell>
                <TableCell>
                  {formatMoney(transaction.amount, transaction.currency)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize ${STATUS_STYLES[transaction.status] ?? ""}`}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(transaction.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        pagination={data.pagination}
        loading={loading}
        onPage={(next) => setPage(next)}
      />
    </div>
  );
}