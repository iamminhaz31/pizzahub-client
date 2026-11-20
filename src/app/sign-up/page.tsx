"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon, StoreIcon, UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "customer" | "vendor";

const roleOptions: {
  value: Role;
  title: string;
  description: string;
  icon: typeof UserIcon;
}[] = [
  {
    value: "customer",
    title: "Customer",
    description: "Order delicious pizza",
    icon: UserIcon,
  },
  {
    value: "vendor",
    title: "Vendor",
    description: "Restaurant owner",
    icon: StoreIcon,
  },
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [role, setRole] = useState<Role>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Already logged in users do not need the sign up page.
  useEffect(() => {
    if (!isPending && session && !loading) {
      router.replace("/dashboard");
    }
  }, [isPending, session, loading, router]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      event.target.value = "";
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be smaller than 5 MB.");
      event.target.value = "";
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function validateForm(): string | null {
    if (name.trim().length < 2) {
      return "Please enter your full name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Please enter a valid email address.";
    }
    if (role === "vendor" && businessName.trim().length < 2) {
      return "Please enter your restaurant name.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    let imageUrl: string | undefined;

    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Image upload failed. Please try again."
        );
        setLoading(false);
        return;
      }
    }

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: imageUrl,
        role,
        businessName: role === "vendor" ? businessName.trim() : undefined,
      });

      if (error) {
        toast.error(error.message || "Sign up failed. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully. Welcome to PizzaHub!");

      // A full page navigation makes sure the new session cookie is used.
      // The button stays disabled until the page changes.
      setTimeout(() => {
        window.location.assign("/dashboard");
      }, 700);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    if (role === "vendor" && businessName.trim().length < 2) {
      toast.error("Please enter your restaurant name first.");
      return;
    }

    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        additionalData: {
          role,
          businessName: role === "vendor" ? businessName.trim() : "",
        },
      });

      if (error) {
        toast.error(error.message || "Google sign up failed. Please try again.");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Google sign up failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  const busy = loading || googleLoading;

  return (
    <AuthShell
      title="Create your account"
      description="Join PizzaHub to order fresh pizza or grow your restaurant."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Account role</Label>
          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const selected = role === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  disabled={busy}
                  aria-pressed={selected}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-colors",
                    selected
                      ? "border-primary bg-secondary text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="size-5" />
                  <span className="text-sm font-semibold">{option.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            disabled={busy}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={busy}
          />
        </div>

        {role === "vendor" && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Restaurant name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              placeholder="Your restaurant name"
              disabled={busy}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            autoComplete="new-password"
            disabled={busy}
          />
          <p className="text-xs text-muted-foreground">
            At least 6 characters, with one uppercase and one lowercase letter.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Profile image (optional)</Label>
          <div className="flex items-center gap-3">
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Profile preview"
                className="size-12 rounded-full border object-cover"
              />
            )}
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={busy}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={busy}>
          {loading ? (
            <>
              <Loader2Icon className="mr-2 size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton
        label="Continue with Google"
        onClick={handleGoogleSignUp}
        loading={googleLoading}
        disabled={loading}
      />
    </AuthShell>
  );
}