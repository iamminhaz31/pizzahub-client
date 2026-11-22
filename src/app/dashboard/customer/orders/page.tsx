import { MyOrders } from "@/components/customer/MyOrders";

export default function CustomerOrdersPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">
          Track your orders and cancel the ones that are still pending.
        </p>
      </div>
      <MyOrders />
    </div>
  );
}