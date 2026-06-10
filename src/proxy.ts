import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const groupId = request.cookies.get("group_id")?.value;

    const hasToken = !!token && token.length > 0;
    const hasGroup = !!groupId && groupId !== "null" && groupId.length > 0;

    const pathname = request.nextUrl.pathname;
    const isPublicPage =
        pathname === "/" || pathname === "/auth/login" || pathname === "/auth/register";
    const isGroupPage = pathname === "/group";
    const isDashboardPage = pathname.startsWith("/dashboard");

    if (!hasToken && !isPublicPage) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (hasToken && !hasGroup && isDashboardPage) {
        return NextResponse.redirect(new URL("/group", request.url));
    }

    if (hasToken && hasGroup && isGroupPage) {
        return NextResponse.redirect(new URL("/dashboard/board", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/group", "/auth/:path*"],
};
