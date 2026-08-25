import { NextResponse } from "next/server";
import { COOKIE, createSession } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return NextResponse.json({ error: "ADMIN_PASSWORD is not configured." }, { status: 500 });
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (String(password) !== configured) return NextResponse.json({ error: "Wrong password." }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, createSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
