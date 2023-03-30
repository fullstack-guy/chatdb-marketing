import { withClerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Set the paths that don't require the user to be signed in
const publicPaths = ["/", "/sign-in*", "/sign-up*", "/pricing"];
const privatePaths = ["/dashboard*"];

const isPrivate = (path: string) => {
  return privatePaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
  );
};

export default withClerkMiddleware((request: NextRequest) => {
  if (isPrivate(request.nextUrl.pathname)) {
    // if the user is not signed in redirect them to the sign in page.
    const { userId } = getAuth(request);

    if (!userId) {
      // redirect the users to /pages/sign-in/[[...index]].ts
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }
  return NextResponse.next();
});

// Stop Middleware running on static files and public folder
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/image (image optimization files)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     * - public /images folder
     * - public /assets folder
     */
    "/((?!_next/image|_next/static|favicon.ico|images|assets).*)",
    "/",
  ],
};
