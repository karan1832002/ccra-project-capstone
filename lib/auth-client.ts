import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession, requestPasswordReset, resetPassword, updateUser } = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
});
