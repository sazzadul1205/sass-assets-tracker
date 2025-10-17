// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const isLoggedIn = req.cookies.get("token"); // example auth check
  const { pathname } = req.nextUrl;

  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect("/auth/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
