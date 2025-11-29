import { NextResponse, NextRequest } from 'next/server';

const publicRoutes = ["/", "/sign-in", "/sign-up"];
const protectedRoutes = ["/practice", "/browse", "/create", "/profile"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const rtoken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  console.log("Middleware check:", { pathname, token, rtoken });

  const isAuthenticated = !!(token || rtoken);
 
  if (isAuthenticated && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/practice", request.url));
  }
 
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route.replace("/:path*", "")))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/create",
    "/browse",
    "/practice",
    "/profile",
    "/playground/:path*",
    "/interview/feedback/:path*",
    "/",
    "/sign-in",
    "/sign-up",
  ],
};