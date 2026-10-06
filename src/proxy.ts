import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { PREVIEW_MODE } from "@/lib/preview";

export async function proxy(request: NextRequest) {
  if (PREVIEW_MODE) return NextResponse.next();
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on everything except static files and image optimization assets.
    // sw.js and the manifest are fetched without a login, so they must skip auth.
    "/((?!_next/static|_next/image|favicon.ico|sw\\.js|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)",
  ],
};
