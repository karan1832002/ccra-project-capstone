import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/client";
import * as schema from "./db/schema";
import { Resend } from "resend";

let resendClient: Resend | null = null;
function getResend() {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "http://172.30.64.1:3000",
  ],
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
    sendResetPassword: async ({ user, url }) => {
      console.log(`[auth] Password reset requested for existing user: ${user.email}`);
      try {
        await getResend().emails.send({
          from: "CCRA Rodeo <onboarding@resend.dev>",
          to: user.email,
          subject: "Reset your CCRA Rodeo password",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #933d04;">Reset your password</h2>
              <p>We received a request to reset the password for your CCRA Rodeo account.</p>
              <a href="${url}" style="display:inline-block; background:#933d04; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600;">
                Reset Password
              </a>
              <p style="color:#666; font-size:12px; margin-top:24px;">If you didn't request this, you can safely ignore this email — your password will not be changed.</p>
            </div>
          `,
        });
        console.log(`[auth] Reset email sent successfully to: ${user.email}`);
      } catch (err) {
        console.error("[auth] Resend send() FAILED (reset password):", err);
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log(`[auth] Verification email requested for: ${user.email}`);
      try {
        await getResend().emails.send({
          from: "CCRA Rodeo <onboarding@resend.dev>",
          to: user.email,
          subject: "Verify your CCRA Rodeo account",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #933d04;">Welcome to CCRA Rodeo</h2>
              <p>Please confirm your email address to activate your account.</p>
              <a href="${url}" style="display:inline-block; background:#933d04; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600;">
                Verify Email
              </a>
              <p style="color:#666; font-size:12px; margin-top:24px;">If you didn't create this account, you can safely ignore this email.</p>
            </div>
          `,
        });
        console.log(`[auth] Verification email sent successfully to: ${user.email}`);
      } catch (err) {
        console.error("[auth] Resend send() FAILED (verify email):", err);
      }
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