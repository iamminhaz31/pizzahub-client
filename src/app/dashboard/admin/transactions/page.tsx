import { TransactionsTable } from "@/components/admin/TransactionsTable";

export default function AdminTransactionsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          Vendor subscription payments. These records cannot be edited.
        </p>
      </div>
      <TransactionsTable />
    </div>
  );
}