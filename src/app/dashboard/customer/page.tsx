import { requireRole } from "@/lib/session";
import { formatRole } from "@/lib/navigation";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";

export default async function CustomerOverviewPage() {
  const user = await requireRole("customer");

  return (
    <WelcomeCard
      name={user.name}
      email={user.email}
      roleLabel={formatRole(user.role)}
      businessName={user.businessName}
    />
  );
}