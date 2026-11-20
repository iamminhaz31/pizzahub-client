import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import {
  APIError,
  createAuthMiddleware,
  getOAuthState,
} from "better-auth/api";
import { db } from "./mongodb";

type OAuthSignupState = { role?: unknown; businessName?: unknown } | null;

// For Google sign up, the chosen role travels through the OAuth flow.
// It is client supplied, so it is always sanitized below.
async function readOAuthSignupState(): Promise<OAuthSignupState> {
  try {
    return (await getOAuthState()) as OAuthSignupState;
  } catch {
    return null;
  }
}

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // New accounts can only be created from the Sign Up page,
      // where the user chooses a role.
      disableImplicitSignUp: true,
    },
  },

  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      businessName: {
        type: "string",
        required: false,
        input: true,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password: string = ctx.body?.password ?? "";
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must contain at least one uppercase and one lowercase letter.",
          });
        }
      }
    }),
  },

  databaseHooks: {
    session: {
      create: {
        // Blocked users can never start a new session.
        before: async (session, ctx) => {
          const dbUser = await ctx?.context.internalAdapter.findUserById(
            session.userId
          );

          if ((dbUser as { isBlocked?: boolean } | null)?.isBlocked) {
            throw new APIError("FORBIDDEN", {
              message: "Your account has been blocked. Please contact support.",
              code: "ACCOUNT_BLOCKED",
            });
          }
        },
      },
    },
    user: {
      create: {
        before: async (user) => {
          const oauthState = await readOAuthSignupState();

          const requestedRole =
            typeof oauthState?.role === "string"
              ? oauthState.role
              : (user as { role?: string }).role;

          // Admin accounts can never be created through public registration.
          const role = requestedRole === "vendor" ? "vendor" : "customer";

          const rawBusinessName =
            typeof oauthState?.businessName === "string"
              ? oauthState.businessName
              : (user as { businessName?: string }).businessName;

          const businessName =
            typeof rawBusinessName === "string"
              ? rawBusinessName.trim().slice(0, 80)
              : "";

          const data: Record<string, unknown> = {
            ...user,
            role,
            isBlocked: false,
            subscriptionPlan: "free",
          };

          if (role === "vendor" && businessName) {
            data.businessName = businessName;
          } else {
            delete data.businessName;
          }

          return { data: data as typeof user };
        },
      },
    },
  },
});