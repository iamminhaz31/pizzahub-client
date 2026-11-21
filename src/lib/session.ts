import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { normalizeRole, type UserRole } from "./navigation";

// cache() makes sure the session is read only once per request.
export const getServerSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

// Logged out users go to Sign In, blocked users go to the blocked page.
export async function requireUser() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.isBlocked) {
    redirect("/blocked");
  }

  return session.user;
}

// Users who open another role's dashboard are sent back to their own.
export async function requireRole(role: UserRole) {
  const user = await requireUser();

  if (normalizeRole(user.role) !== role) {
    redirect("/dashboard");
  }

  return user;
}