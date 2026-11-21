import { requireUser } from "@/lib/session";

export default async function ProfileSettingsPage() {
  await requireUser();

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Profile settings will be available soon.
      </p>
    </div>
  );
}