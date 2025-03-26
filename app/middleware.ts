import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/profile", "/orders", "/cart/checkout"];

// Routes that require admin role
const ADMIN_ROUTES = ["/admin"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const path = req.nextUrl.pathname;

  // Check if the route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    path.startsWith(route)
  );
  const isAdminRoute = ADMIN_ROUTES.some((route) => path.startsWith(route));

  // If no session and trying to access a protected route, redirect to login
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If session exists but trying to access an admin route without admin role
  if (session && isAdminRoute) {
    const { data: userData, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error || userData?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * But include:
     * - /profile, /orders, /cart/checkout (protected routes)
     * - /admin (admin routes)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    "/profile/:path*",
    "/orders/:path*",
    "/cart/checkout/:path*",
    "/admin/:path*",
  ],
};
