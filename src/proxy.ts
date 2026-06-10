import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token");
    const groupId = request.cookies.get("group_id");
    const hasGroup =
        groupId?.value !== undefined &&
        groupId?.value !== "null" &&
        groupId?.value !== "";

    if (!token) {
        if (
            request.nextUrl.pathname !== "/" &&
            request.nextUrl.pathname !== "/auth/login" &&
            request.nextUrl.pathname !== "/auth/register"
        ) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    if (token) {
        if (
            !hasGroup &&
            request.nextUrl.pathname !== "/" &&
            request.nextUrl.pathname !== "/group"
        ) {
            return NextResponse.redirect(new URL("/group", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/group", "/auth/login", "/auth/register"],
};
