import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token");
    const hasGroup =
        request.cookies.get("group_id") !== undefined || "null" ? true : false;

    if (
        !token &&
        request.nextUrl.pathname !== "/auth/login" &&
        request.nextUrl.pathname !== "/"
    ) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (token && request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard/board", request.url));
    }

    if (
        token &&
        request.nextUrl.pathname.startsWith("/dashboard") &&
        !hasGroup &&
        request.nextUrl.pathname !== "/group"
    ) {
        return NextResponse.redirect(new URL("/group", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/group", "/auth/login", "/auth/register"],
};
