import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const apiRes = await fetch(`${process.env.API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: body.email, password: body.password }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
        return NextResponse.json(data, { status: apiRes.status });
    }

    const response = NextResponse.json({ user: data.user });

    response.cookies.set("admin_token", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: body.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
    });

    return response;
}