import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
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
    "/rjrj.png"
  ]
  if (
    !(await cookies()).get("auth_session") &&
    pathname !== "/auth" &&
    pathname !== "/" &&
    pathname !== "/favicon.png" &&
    !notProtectedRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth|og.png|images).*)"],
}
