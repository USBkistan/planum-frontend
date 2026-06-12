import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { internalApiClient } from "@/services/internal";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("access_token")!;
    const body = await request.json();
    const { data } = await internalApiClient.post(
        "/groups",
        { ...body },
        {
            headers: {
                Authorization: `Bearer ${accessTokenCookie.value}`,
            },
        },
    );

    if (!data) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const group_id = data["id"];

    const nextResponse = NextResponse.json({ data }, { status: 200 });

    nextResponse.cookies.set("group_id", group_id, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return nextResponse;
}
