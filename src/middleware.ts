import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
	let response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const notProtectedRoutes = [
    "/",
    "/auth",
    "/favicon.png",
    "/privacy-policy",
    "/terms-of-service",
    "/manifest.json",
    "/icon.png",
    "/yandex_82f007f1c17a7d7a.html",
    "/sitemap.xml",
    "/rjrj.png",
    "/manifest.webmanifest",
    "/manifest.json"
  ];
  if (
    !(await cookies()).get("auth_session") &&
    pathname !== "/auth" &&
    pathname !== "/" &&
    pathname !== "/favicon.png" &&
    !notProtectedRoutes.includes(pathname)
  ) {
    response = NextResponse.redirect(new URL("/auth", request.url));
  }
	const sessionToken = request.cookies.get("session")?.value ?? null;

	if (sessionToken !== null) {
		// Re-set the cookie with updated expiration
		response.cookies.set({
			name: "session",
			value: sessionToken,
			maxAge: 60 * 60 * 24 * 365, // 1 year
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production"
		});
	}
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth|og.png|images).*)",
  ],
};
