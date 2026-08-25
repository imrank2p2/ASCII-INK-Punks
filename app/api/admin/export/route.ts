import { NextRequest, NextResponse } from "next/server";
import { isValidSession } from "@/lib/admin-auth";

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(req: NextRequest) {
  if (!isValidSession(req)) return new NextResponse("Unauthorized", { status: 401 });
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return new NextResponse("Supabase is not configured", { status: 500 });
  const response = await fetch(`${url}/rest/v1/wl_applications?select=created_at,twitter,proof_url,wallet,score,status,reviewed_at&order=created_at.desc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!response.ok) return new NextResponse("Could not export", { status: 500 });
  const rows = await response.json();
  const columns = ["created_at", "twitter", "proof_url", "wallet", "score", "status", "reviewed_at"];
  const csv = [columns.join(","), ...rows.map((row: Record<string, unknown>) => columns.map((c) => csvEscape(row[c])).join(","))].join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=ascci-wl-applications.csv" } });
}
