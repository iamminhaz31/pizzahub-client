
import { requireRole } from "@/lib/session";
import { CustomerOverview } from "@/components/customer/CustomerOverview";

export default async function CustomerOverviewPage() {
  await requireRole("customer");

  return <CustomerOverview />;
}
