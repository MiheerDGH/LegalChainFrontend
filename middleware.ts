// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Skip static files
    "/",                      // Match root
    "/(api|trpc)(.*)",        // Match API routes
  ],
};
