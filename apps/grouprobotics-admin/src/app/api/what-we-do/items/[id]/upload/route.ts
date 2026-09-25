import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-fetch";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const formData = await req.formData();

    const res = await apiFetch(`/what-we-do/items/${id}/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}