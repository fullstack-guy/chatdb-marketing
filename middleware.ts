import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/terms-and-conditions(.*)",
    "/privacy-policy(.*)",
    "/pricing",
    "/blog(.*)",
    "/post(.*)",
    "/contact-us(.*)",
    "/tools(.*)",
    "/checkout",
    "/api/send",
    "/api/og",
  ],
  afterAuth: (auth, req) => {
    if (!auth.userId && !auth.isPublicRoute) {
      if (req.nextUrl.pathname.includes("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
