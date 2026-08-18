import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = new Set(["/", "/login", "/signup"])

/**
 * Performs an optimistic auth check before protected pages are rendered.
 * Authorization must still be enforced by the API for every protected request.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicPath = PUBLIC_PATHS.has(pathname)
  const hasSession = Boolean(request.cookies.get("token")?.value)

  if (!isPublicPath && !hasSession) {
    const loginUrl = new URL("/login", request.url)
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", pathname)
    }

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
