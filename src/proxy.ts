import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/registration(.*)',
  '/sso-callback(.*)',
]);

const clerk = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

// e2e runs against a build with no real Clerk backend. A dev Clerk instance
// would redirect every browser navigation to its frontend-API "dev-browser
// handshake", which can't complete without a live backend — so the app never
// renders. When this flag is set at build time we skip Clerk entirely and let
// every request through. It is ONLY set in the e2e CI job; never in production.
const bypassClerk = process.env.NEXT_PUBLIC_E2E_BYPASS_CLERK === 'true';

export default bypassClerk ? () => NextResponse.next() : clerk;

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
