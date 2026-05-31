import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/registration(.*)',
  '/sso-callback(.*)',
  // ⚠️ MOCK PHASE: app pages and their mock endpoints are publicly viewable so
  // the UI can be demoed without a Clerk session. Remove these once pages read
  // real, auth-scoped data.
  '/today(.*)',
  '/inbox(.*)',
  '/social(.*)',
  '/reservations(.*)',
  '/workflows(.*)',
  '/vendors(.*)',
  '/website(.*)',
  '/insights(.*)',
  '/settings(.*)',
  '/api/mock(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
