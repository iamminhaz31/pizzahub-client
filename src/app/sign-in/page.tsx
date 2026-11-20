"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getOAuthErrorMessage(code: string): string {
  switch (code) {
    case "signup_disabled":
      return "No account found for this Google account. Please sign up first.";
    case "ACCOUNT_BLOCKED":
      return "Your account has been blocked. Please contact support.";
    case "access_denied":
      return "Google sign in was cancelled.";
    default:
      return "Google sign in failed. Please try again.";
  }
}

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Already logged in users do not need the sign in page.
  useEffect(() => {
    if (!isPending && session && !loading) {
      router.replace("/dashboard");
    }
  }, [isPending, session, loading, router]);

  // Show errors coming back from the Google sign in redirect.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get("error");

    if (errorCode) {
      toast.error(getOAuthErrorMessage(errorCode));
      window.history.replaceState(null, "", "/sign-in");
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length === 0) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      toast.success("Signed in successfully. Welcome back!");

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

  async function handleGoogleSignIn() {
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/sign-in",
      });

      if (error) {
        toast.error(error.message || "Google sign in failed. Please try again.");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Google sign in failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  const busy = loading || googleLoading;

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to order pizza or manage your restaurant."
      footer={
        <>
          New to PizzaHub?{" "}
          <Link href="/sign-up" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={busy}
          />
        </div>

        <Button type="submit" className="w-full" disabled={busy}>
          {loading ? (
            <>
              <Loader2Icon className="mr-2 size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
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
        onClick={handleGoogleSignIn}
        loading={googleLoading}
        disabled={loading}
      />
    </AuthShell>
  );
}