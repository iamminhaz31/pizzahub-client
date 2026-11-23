"use client";

import { useState, type FormEvent } from "react";
import { useSession } from "@/lib/auth-client";
import {
  PHONE_PATTERN,
  updateProfile,
  type ProfileUser,
} from "@/lib/profile";
import { uploadImage } from "@/lib/upload";
import { toast } from "sonner";

type ProfileFormProps = {
  initialUser: ProfileUser;
};

const inputClass =
  "h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60";

const textareaClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60";

// Empty text is sent as null so the server clears the saved value.
function emptyToNull(value: string) {
  const text = value.trim();
  return text === "" ? null : text;
}

export function ProfileForm({ initialUser }: ProfileFormProps) {
  const { refetch } = useSession();

  const [name, setName] = useState(initialUser.name);
  const [businessName, setBusinessName] = useState(
    initialUser.businessName || ""
  );
  const [phone, setPhone] = useState(initialUser.phone || "");
  const [area, setArea] = useState(initialUser.area || "");
  const [address, setAddress] = useState(initialUser.address || "");
  const [description, setDescription] = useState(
    initialUser.description || ""
  );
  const [image, setImage] = useState(initialUser.image);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const isVendor = initialUser.role === "vendor";

  function resetForm() {
    setName(initialUser.name);
    setBusinessName(initialUser.businessName || "");
    setPhone(initialUser.phone || "");
    setArea(initialUser.area || "");
    setAddress(initialUser.address || "");
    setDescription(initialUser.description || "");
    setImage(initialUser.image);
    setFile(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const compactPhone = phone.replace(/[\s-]/g, "");

    if (compactPhone !== "" && !PHONE_PATTERN.test(compactPhone)) {
      toast.error("Please enter a valid Bangladesh phone number.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = image;

      if (file) {
        imageUrl = await uploadImage(file);
      }

      const result = await updateProfile({
        name,
        image: imageUrl,
        phone: emptyToNull(compactPhone),
        area: emptyToNull(area),
        address: emptyToNull(address),
        ...(isVendor
          ? { businessName, description: emptyToNull(description) }
          : {}),
      });

      setName(result.user.name);
      setBusinessName(result.user.businessName || "");
      setPhone(result.user.phone || "");
      setArea(result.user.area || "");
      setAddress(result.user.address || "");
      setDescription(result.user.description || "");
      setImage(result.user.image);
      setFile(null);

      // Refresh Better Auth session so the Navbar receives
      // the latest name and profile image.
      await refetch();

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your personal profile information.
            </p>
          </div>

          <div className="space-y-5">
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
                className={inputClass}
              />
            </div>

            {isVendor && (
              <div className="space-y-2">
                <label htmlFor="business-name" className="text-sm font-medium">
                  Business Name
                </label>
                <input
                  id="business-name"
                  type="text"
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  minLength={2}
                  maxLength={80}
                  required
                  disabled={saving}
                  className={inputClass}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
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
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium"
              />

              {file && (
                <p className="text-xs text-muted-foreground">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              {isVendor ? "Restaurant Contact & Location" : "Contact & Delivery"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isVendor
                ? "Tell customers how to reach your restaurant and where it is."
                : "Save your phone number and default delivery address."}
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="profile-phone" className="text-sm font-medium">
                {isVendor ? "Business Phone" : "Phone Number"}
              </label>
              <input
                id="profile-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="01XXXXXXXXX"
                maxLength={20}
                disabled={saving}
                className={inputClass}
              />
              <p className="text-xs text-muted-foreground">
                Bangladesh mobile number, for example 01712345678.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="profile-area" className="text-sm font-medium">
                Area / City
              </label>
              <input
                id="profile-area"
                type="text"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                placeholder="For example Mirpur, Dhaka"
                maxLength={80}
                disabled={saving}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="profile-address" className="text-sm font-medium">
                {isVendor ? "Restaurant Address" : "Default Delivery Address"}
              </label>
              <textarea
                id="profile-address"
                rows={3}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="House, road, area and city"
                maxLength={200}
                disabled={saving}
                className={textareaClass}
              />
            </div>

            {isVendor && (
              <div className="space-y-2">
                <label
                  htmlFor="profile-description"
                  className="text-sm font-medium"
                >
                  Short Description
                </label>
                <textarea
                  id="profile-description"
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="A few words about your restaurant"
                  maxLength={300}
                  disabled={saving}
                  className={textareaClass}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/300 characters
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
            onClick={resetForm}
            className="inline-flex h-10 items-center justify-center rounded-md border px-5 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}