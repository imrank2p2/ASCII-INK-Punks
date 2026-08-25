import { NextRequest, NextResponse } from "next/server";
import { isValidSession } from "@/lib/admin-auth";

function env() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured");
  return { url: url.replace(/\/$/, ""), key };
}

function headers(key: string) {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export async function GET(req: NextRequest) {
  if (!isValidSession(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { url, key } = env();
    const status = req.nextUrl.searchParams.get("status");
    const q = req.nextUrl.searchParams.get("q");
    const params = new URLSearchParams({ select: "*", order: "created_at.desc", limit: "1000" });
    if (status && status !== "all") params.set("status", `eq.${status}`);
    if (q) params.set("or", `(twitter.ilike.*${q}*,wallet.ilike.*${q}*)`);
    const response = await fetch(`${url}/rest/v1/wl_applications?${params}`, { headers: headers(key), cache: "no-store" });
    if (!response.ok) throw new Error(await response.text());
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not load applications." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isValidSession(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, status } = await req.json();
    if (!id || !["pending", "approved", "rejected"].includes(status)) return NextResponse.json({ error: "Invalid update." }, { status: 400 });
    const { url, key } = env();
    const response = await fetch(`${url}/rest/v1/wl_applications?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { ...headers(key), Prefer: "return=representation" },
      body: JSON.stringify({ status, reviewed_at: new Date().toISOString() }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(await response.text());
    return NextResponse.json((await response.json())[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not update application." }, { status: 500 });
  }
}
