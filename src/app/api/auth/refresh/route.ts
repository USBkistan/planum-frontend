import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { serverUrl } from "@/services/globals";

export async function POST() {
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("refresh_token")!;
    const { data } = await axios.post(
        `${serverUrl}/auth/refresh`,
        {},
        {
            headers: {
                Cookie: `${refreshTokenCookie.name}=${refreshTokenCookie.value}`,
            },
        },
    );

    const access_token = data["access_token"];
    const refresh_token = data["refresh_token"];

    const nextResponse = NextResponse.json({ access_token }, { status: 200 });

    nextResponse.cookies.set("access_token", access_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
    nextResponse.cookies.set("refresh_token", refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });

    return nextResponse;
}
