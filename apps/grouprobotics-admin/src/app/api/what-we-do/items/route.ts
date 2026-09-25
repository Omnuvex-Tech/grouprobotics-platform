import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-fetch";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const res = await apiFetch("/what-we-do/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}