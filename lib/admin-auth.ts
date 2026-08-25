import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

const COOKIE = "ascci_admin";

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "change-me";
}

export function createSession() {
  const payload = `${Date.now()}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function isValidSession(req: NextRequest) {
  const value = req.cookies.get(COOKIE)?.value;
  if (!value) return false;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return false;
  const age = Date.now() - Number(payload);
  if (!Number.isFinite(age) || age < 0 || age > 1000 * 60 * 60 * 24 * 7) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export { COOKIE };
