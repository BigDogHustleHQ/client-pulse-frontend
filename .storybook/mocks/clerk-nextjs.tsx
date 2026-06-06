import * as React from 'react';

// Minimal stand-in for @clerk/nextjs used by Storybook stories and the
// Storybook Vitest run. Returns a "happy path" sign-in/sign-up object so
// forms render and play functions can exercise the submit flow.
const ok = async () => ({ error: null });

export const useSignIn = () => ({
  signIn: {
    status: 'complete' as const,
    createdSessionId: 'session_storybook',
    identifier: 'demo@company.com',
    userData: { firstName: 'Demo', lastName: 'User' },
    create: ok,
    finalize: ok,
    sso: ok,
    // Happy-path reset flow so ForgotPasswordForm stories/play functions can
    // step through email → code → new password.
    resetPasswordEmailCode: {
      sendCode: ok,
      verifyCode: ok,
      submitPassword: ok,
    },
  },
  fetchStatus: 'idle' as const,
});

export const useSignUp = () => ({
  signUp: {
    status: 'complete' as const,
    createdUserId: 'user_storybook',
    emailAddress: 'demo@company.com',
    firstName: 'Demo',
    lastName: 'User',
    create: ok,
    finalize: ok,
    sso: ok,
  },
  fetchStatus: 'idle' as const,
});

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const AuthenticateWithRedirectCallback = () => (
  <div>Authenticating...</div>
);
