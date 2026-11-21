import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ApiTestButtons } from "@/components/auth/ApiTestButtons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function DashboardContent() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome, {user.name}</CardTitle>
        <CardDescription>Temporary page to verify your session.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>Email: {user.email}</p>
        <p>Role: {user.role ?? "customer"}</p>
        {user.businessName && <p>Restaurant: {user.businessName}</p>}
        <SignOutButton />
        <ApiTestButtons />
      </CardContent>
    </Card>
  );
}

export default function DashboardPlaceholderPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Loading...</p>}
      >
        <DashboardContent />
      </Suspense>
    </main>
  );
}