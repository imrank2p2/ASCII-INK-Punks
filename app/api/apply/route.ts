import { NextResponse } from "next/server";

const walletRegex = /^0x[a-fA-F0-9]{40}$/;

function env() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  return { url: url.replace(/\/$/, ""), key };
}

function scoreApplication(input: { proof: string; twitter: string; wallet: string }) {
  let score = 0;
  if (input.twitter.trim()) score += 10;
  if (input.proof.trim()) score += 20;
  if (walletRegex.test(input.wallet.trim())) score += 20;
  return score;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const twitter = String(body.twitter ?? "").trim().replace(/^@+/, "@");
    const proof = String(body.proof ?? "").trim();
    const wallet = String(body.wallet ?? "").trim();

    if (!twitter || !proof || !wallet) return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
    if (!walletRegex.test(wallet)) return NextResponse.json({ error: "Invalid EVM wallet address." }, { status: 400 });

    const { url, key } = env();
    const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" };

    const existing = await fetch(`${url}/rest/v1/wl_applications?select=id&or=(wallet.eq.${encodeURIComponent(wallet.toLowerCase())},twitter.eq.${encodeURIComponent(twitter.toLowerCase())})&limit=1`, { headers, cache: "no-store" });
    if (!existing.ok) throw new Error(await existing.text());
    if ((await existing.json()).length) return NextResponse.json({ error: "An application with this X handle or wallet already exists." }, { status: 409 });

    const insert = await fetch(`${url}/rest/v1/wl_applications`, { method: "POST", headers, body: JSON.stringify({ twitter, proof_url: proof, wallet: wallet.toLowerCase(), score: scoreApplication({ twitter, proof, wallet }), status: "pending" }), cache: "no-store" });
    if (!insert.ok) {
      const text = await insert.text();
      if (text.toLowerCase().includes("duplicate")) return NextResponse.json({ error: "An application with this X handle or wallet already exists." }, { status: 409 });
      throw new Error(text);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "WL application system is not configured yet." }, { status: 500 });
  }
}
