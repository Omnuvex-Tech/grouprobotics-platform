import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

export async function apiFetch(path: string, init?: RequestInit) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    return fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            ...(init?.headers ?? {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
    });
}