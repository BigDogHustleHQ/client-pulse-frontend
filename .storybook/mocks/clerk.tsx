// Lightweight mock of @clerk/nextjs for Storybook so auth forms render
// without a ClerkProvider or network calls. Submit handlers resolve to no-ops.
const noopResult = Promise.resolve({ error: null });

const signIn = {
  status: 'complete',
  createdSessionId: 'sb_session',
  identifier: 'demo@clientpulse.com',
  userData: { firstName: 'Demo', lastName: 'User' },
  create: () => noopResult,
  finalize: () => noopResult,
  sso: () => noopResult,
};

const signUp = {
  status: 'complete',
  createdUserId: 'sb_user',
  emailAddress: 'demo@clientpulse.com',
  firstName: 'Demo',
  lastName: 'User',
  create: () => noopResult,
  finalize: () => noopResult,
  sso: () => noopResult,
};

export const useSignIn = () => ({ signIn, fetchStatus: 'idle' as const });
export const useSignUp = () => ({ signUp, fetchStatus: 'idle' as const });

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return children;
};
