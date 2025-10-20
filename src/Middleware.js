// src/app/middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const middleware = async (req) => {
  // Get the NextAuth token
  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  });

  // If no valid token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/Auth/Login?expired=true", req.url));
  }

  // Optional: You can check roles here if needed
  // e.g., if only Employees allowed for certain routes
  // const role = token.role || "Employee";
  // if (role !== "Employee") { ... redirect or block }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/Employee/:path*", // Protect Employee routes
    "/Manager/:path*", // Protect Manager routes
    "/Admin/:path*", // Protect Admin routes
  ],
};
