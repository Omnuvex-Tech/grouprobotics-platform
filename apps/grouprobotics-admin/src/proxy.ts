import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;
    const { pathname } = req.nextUrl;

    if (!token && pathname !== "/login") {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    if (token && pathname === "/login") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};