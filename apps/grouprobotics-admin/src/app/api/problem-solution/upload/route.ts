import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-fetch";

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const res = await apiFetch("/problem-solution/upload", {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}