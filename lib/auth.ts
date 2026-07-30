import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/client";
import * as schema from "./db/schema";

const gatewayUrl = process.env.GATEWAY_URL || "http://localhost:4000";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : [],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: ({ user, url }) => {
      return fetch(`${gatewayUrl}/api/notifications/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gateway-key": process.env.FRONTEND_GATEWAY_KEY || "",
        },
        body: JSON.stringify({
          userId: user.id,
          channel: "email",
          template: "reset_password",
          recipient: user.email,
          data: { url },
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            console.error(`[auth] Gateway error dispatching notification: ${res.status} ${text}`);
          }
        })
        .catch((err) => {
          console.error("[auth] Network/Fetch error connecting to Gateway:", err);
        });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: ({ user, url }) => {
      return fetch(`${gatewayUrl}/api/notifications/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gateway-key": process.env.FRONTEND_GATEWAY_KEY || "",
        },
        body: JSON.stringify({
          userId: user.id,
          channel: "email",
          template: "verify_email",
          recipient: user.email,
          data: { url },
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            console.error(`[auth] Gateway error dispatching notification: ${res.status} ${text}`);
          }
        })
        .catch((err) => {
          console.error("[auth] Network/Fetch error connecting to Gateway:", err);
        });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "member",
      },
    },
  },
});