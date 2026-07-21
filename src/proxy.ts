import authConfig from "@/lib/auth/auth.config";
import { PROFILE_ROUTE_PREFIX, PROTECTED_ROUTES, ROLE_HOME } from "@/lib/auth/roles";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const PUBLIC_ONLY_ROUTES = ["/login"];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth);
  const role = req.auth?.user?.role;
  const status = req.auth?.user?.status;

  if (isLoggedIn && PUBLIC_ONLY_ROUTES.includes(pathname)) {
    const target = role ? ROLE_HOME[role] : PROFILE_ROUTE_PREFIX;
    // We'll let it redirect to target, and then the logic below will catch it if they are still pending
    // However, to prevent double redirect, we can check status here.
    if (role === "MOTHER" && status === "PENDING_ONBOARDING") {
      return NextResponse.redirect(new URL("/onboarding", req.nextUrl));
    }
    if (role === "MOTHER" && status === "PENDING_MIDWIFE_REVIEW") {
      return NextResponse.redirect(new URL("/onboarding/pending", req.nextUrl));
    }
    return NextResponse.redirect(new URL(target, req.nextUrl));
  }

  if (isLoggedIn && role === "MOTHER") {
    if (status === "ACTIVE") {
      // if (pathname.startsWith("/onboarding")) {
      //   return NextResponse.redirect(new URL(ROLE_HOME[role], req.nextUrl));
      // }
    } else if (status === "PENDING_ONBOARDING" || status === "PENDING_MIDWIFE_REVIEW") {
      const isOnboardingPath = pathname === "/onboarding" || pathname === "/onboarding/pending";
      // if (!isOnboardingPath && !pathname.startsWith("/api/auth")) {
      //   return NextResponse.redirect(new URL("/onboarding", req.nextUrl));
      // }
    }
  }

  const isProfileRoute = matchesPrefix(pathname, PROFILE_ROUTE_PREFIX);
  const matchedProtectedRoute = PROTECTED_ROUTES.find((route) =>
    matchesPrefix(pathname, route.prefix)
  );

  if (!isProfileRoute && !matchedProtectedRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (matchedProtectedRoute && role && !matchedProtectedRoute.roles.includes(role)) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|api/auth).*)",
  ],
};
