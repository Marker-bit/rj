import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // CSRF protection: validate Origin header on mutating API requests
  if (pathname.startsWith("/api")) {
    const method = request.method;
    if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
      const origin = request.headers.get("origin");
      const host = request.headers.get("host");
      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          if (originHost !== host) {
            return NextResponse.json(
              { error: "Forbidden: origin mismatch" },
              { status: 403 },
            );
          }
        } catch {
          return NextResponse.json(
            { error: "Forbidden: invalid origin" },
            { status: 403 },
          );
        }
      }
      // Allow requests without Origin header (e.g. same-origin fetch,
      // curl, server-to-server) — SameSite cookie + CORS preflight
      // provide additional layers.
    }
    return NextResponse.next();
  }

  // Page route auth: redirect unauthenticated users to /auth
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
    "/manifest.json",
  ];
  if (
    !(await cookies()).get("auth_session") &&
    pathname !== "/auth" &&
    pathname !== "/" &&
    pathname !== "/favicon.png" &&
    !notProtectedRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|og.png|images).*)"],
};
