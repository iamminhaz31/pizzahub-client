
"use client";

import { useState, type FormEvent } from "react";
import { useSession } from "@/lib/auth-client";
import { updateProfile, type ProfileUser } from "@/lib/profile";
import { uploadImage } from "@/lib/upload";
import { toast } from "sonner";

type ProfileFormProps = {
  initialUser: ProfileUser;
};

export function ProfileForm({ initialUser }: ProfileFormProps) {
  const { refetch } = useSession();

  const [name, setName] = useState(initialUser.name);
  const [businessName, setBusinessName] = useState(
    initialUser.businessName || ""
  );
  const [image, setImage] = useState(initialUser.image);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const isVendor = initialUser.role === "vendor";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      let imageUrl = image;

      if (file) {
        imageUrl = await uploadImage(file);
      }

      const result = await updateProfile({
        name,
        image: imageUrl,
        ...(isVendor ? { businessName } : {}),
      });

      setName(result.user.name);
      setBusinessName(result.user.businessName || "");
      setImage(result.user.image);
      setFile(null);

      // Refresh Better Auth session so the Navbar receives
      // the latest name and profile image.
      await refetch();

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your personal profile information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="profile-name" className="text-sm font-medium">
              Full Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={80}
              required
              disabled={saving}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {isVendor && (
            <div className="space-y-2">
              <label
                htmlFor="business-name"
                className="text-sm font-medium"
              >
                Business Name
              </label>

              <input
                id="business-name"
                type="text"
                value={businessName}
                onChange={(event) =>
                  setBusinessName(event.target.value)
                }
                minLength={2}
                maxLength={80}
                required
                disabled={saving}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              value={initialUser.email}
              disabled
              className="h-10 w-full rounded-md border bg-muted px-3 text-sm text-muted-foreground"
            />

            <p className="text-xs text-muted-foreground">
              Email address cannot be changed here.
            </p>
          </div>

          <div className="space-y-3">
            <label htmlFor="profile-image" className="text-sm font-medium">
              Profile Image
            </label>

            {image && (
              <div className="flex items-center gap-4">
                <img
                  src={image}
                  alt="Current profile"
                  className="size-16 rounded-full border object-cover"
                />
                <span className="text-sm text-muted-foreground">
                  Current profile picture
                </span>
              </div>
            )}

            <input
              id="profile-image"
              type="file"
              accept="image/*"
              disabled={saving}
              onChange={(event) =>
                setFile(event.target.files?.[0] || null)
              }
              className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium"
            />

            {file && (
              <p className="text-xs text-muted-foreground">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setName(initialUser.name);
                setBusinessName(initialUser.businessName || "");
                setImage(initialUser.image);
                setFile(null);
              }}
              className="inline-flex h-10 items-center justify-center rounded-md border px-5 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
