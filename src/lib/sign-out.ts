import { signOut } from "@/lib/auth-client";

export async function handleSignOut() {
  await signOut();
  // Full page navigation clears any cached client state.
  window.location.assign("/");
}