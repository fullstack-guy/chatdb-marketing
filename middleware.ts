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
    "/api/send",
    "/api/og",
  ],
  afterAuth: (auth, req) => {
    const url = req.nextUrl.clone();

    if (req.nextUrl.pathname.startsWith("/dashboard/")) {
      if (auth.user && auth.user.publicMetadata.isActive === true) {
        return NextResponse.next();
      } else {
        url.pathname = "/pricing";
        return NextResponse.redirect(url);
      }
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
