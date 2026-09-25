import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-fetch";

export async function PATCH(req: NextRequest) {
    const body = await req.json();

    const res = await apiFetch("/capabilities/cards/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}