import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getDashboardPath } from "@/lib/navigation";

// /dashboard sends every user to the dashboard of their own role.
export default async function DashboardIndexPage() {
  const user = await requireUser();
  redirect(getDashboardPath(user.role));
}