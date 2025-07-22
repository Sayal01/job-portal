import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("AuthToken")?.value;
  const role = request.cookies.get("Role")?.value;
  const { pathname } = request.nextUrl;

  // ✅ Allow public home page + auth pages when NOT logged in
  if (!token) {
    if (pathname === "/" || pathname.startsWith("/auth")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ If logged in, block /auth pages → send to own dashboard
  if (pathname.startsWith("/auth")) {
    let redirectUrl = "/";
    if (role === "job_seeker") redirectUrl = "/job_seeker/";
    else if (role === "employer") redirectUrl = "/employer/";
    else if (role === "admin") redirectUrl = "/admin/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }
  // Redirect exact dashboard base routes to /dashboard subpage
  if (role === "job_seeker" && pathname === "/job_seeker") {
    return NextResponse.redirect(new URL("/job-seeker/dashboard", request.url));
  }
  if (role === "employer" && pathname === "/employer") {
    return NextResponse.redirect(new URL("/employer/dashboard", request.url));
  }
  if (role === "admin" && pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // ✅ Role-based protection → redirect to correct dashboard only if NOT already there
  if (pathname.startsWith("/job_seeker") && role !== "job_seeker") {
    if (!pathname.startsWith(`/${role}/dashboard`)) {
      return NextResponse.redirect(new URL(`/${role}/`, request.url));
    }
  }
  if (pathname.startsWith("/employer") && role !== "employer") {
    if (!pathname.startsWith(`/${role}/dashboard`)) {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
  }
  if (pathname.startsWith("/admin") && role !== "admin") {
    if (!pathname.startsWith(`/${role}/dashboard`)) {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/job-seeker/:path*",
    "/employer/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
};
