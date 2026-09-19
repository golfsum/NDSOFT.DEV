import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();

  if (host === "stridescore.ndsoft.dev") {
    const url = request.nextUrl.clone();
    const path = url.pathname === "/" ? "" : url.pathname;
    url.pathname = `/stridescore${path}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
