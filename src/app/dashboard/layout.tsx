import { Suspense } from "react";
import { requireUser } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

async function ShellLoader({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <DashboardShell
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      }}
    >
      {children}
    </DashboardShell>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      }
    >
      <ShellLoader>{children}</ShellLoader>
    </Suspense>
  );
}