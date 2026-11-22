
import { requireRole } from "@/lib/session";
import { VendorOverview } from "@/components/vendor/VendorOverview";

export default async function VendorOverviewPage() {
  await requireRole("vendor");

  return <VendorOverview />;
}
