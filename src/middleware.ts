import { NextResponse, NextRequest } from 'next/server';

// Routes that are accessible to everyone (authenticated users will be redirected away)
const publicRoutes = ["/", "/sign-in", "/sign-up"];

// Routes that require authentication
const protectedRoutes = [
  "/practice",
  "/browse",
  "/create",
  "/profile",
  "/playground",
  "/interview/feedback"
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  // Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log("Middleware check:", { pathname, hasToken: !!token, hasRefreshToken: !!refreshToken });
  }

  const isAuthenticated = !!(token || refreshToken);

  // Redirect authenticated users away from public routes (sign-in, sign-up, home)
  if (isAuthenticated && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/practice", request.url));
  }

  // Redirect unauthenticated users to sign-in if they try to access protected routes
  if (!isAuthenticated) {
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
      // Store the original URL to redirect back after login
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    "/create/:path*",
    "/browse/:path*",
    "/practice/:path*",
    "/profile/:path*",
    "/playground/:path*",
    "/interview/:path*",
    // Public routes
    "/",
    "/sign-in",
    "/sign-up",
  ],
};