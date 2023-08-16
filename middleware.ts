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
    "/pricing",
    "/blog(.*)",
    "/post(.*)",
    "/contact-us(.*)",
    "/tools(.*)",
  ],
  afterAuth: (auth) => {
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
