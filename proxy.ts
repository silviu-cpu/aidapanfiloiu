import { NextResponse, type NextRequest } from "next/server";

/**
 * Româna este limba implicită și nu are prefix: /despre este servit intern din /ro/despre.
 * Engleza are prefixul /en. Adresele cu /ro sunt redirecționate către varianta fără prefix.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return;

  if (pathname === "/ro" || pathname.startsWith("/ro/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/ro${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|images|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
