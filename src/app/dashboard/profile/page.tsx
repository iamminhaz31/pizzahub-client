
import { Suspense } from "react";
import { requireUser } from "@/lib/session";
import type { ProfileUser } from "@/lib/profile";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

async function ProfileContent() {
  const user = await requireUser();

  const initialUser: ProfileUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: user.role ?? "customer",
    businessName: user.businessName ?? null,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your account information and profile picture.
        </p>
      </div>

      <ProfileForm initialUser={initialUser} />
    </div>
  );
}

export default function ProfileSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-64 max-w-2xl animate-pulse rounded-xl bg-muted" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
