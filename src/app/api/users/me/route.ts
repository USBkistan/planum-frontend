import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { serverUrl } from "@/services/globals";
import { getMeRequest } from "@/services/user";

export async function GET() {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("access_token")!;
    const { data } = await axios.get(`${serverUrl}/users/me`, {
        headers: {
            Authorization: `Bearer ${accessTokenCookie.value}`,
        },
    });

    if (!data) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const group_id = data["group_id"];

    const nextResponse = NextResponse.json({ data }, { status: 200 });

    nextResponse.cookies.set("group_id", group_id, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return nextResponse;
}
