import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/registration(.*)',
  '/sso-callback(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // ⚠️ MOCK PHASE: the (app) pages and /api/mock are EXCLUDED from Clerk
    // middleware entirely, so they render without a Clerk dev-browser handshake
    // (which would otherwise redirect to the publishable key's frontend-API
    // domain). Remove these exclusions when wiring real, auth-scoped data.
    '/((?!_next|today|inbox|social|reservations|workflows|vendors|website|insights|settings|api/mock|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api(?!/mock)|trpc)(.*)',
  ],
};
