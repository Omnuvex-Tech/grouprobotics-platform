import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-fetch";

export async function GET() {
    const res = await apiFetch("/market");
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();

    const res = await apiFetch("/market", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}