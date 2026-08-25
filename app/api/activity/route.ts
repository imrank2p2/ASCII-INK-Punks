import { NextResponse } from "next/server";

const CHAIN_ID = "4663";
const CONTRACT = "0x5ae0cde11fb3f5072a0e8a2b802ecf9af0814dd8";
const ZERO = "0x0000000000000000000000000000000000000000";
const BASE = "https://robinhoodchain.blockscout.com/api/v2";

async function blockscout(path: string) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Blockscout returned ${response.status}`);
  return response.json();
}

export async function GET() {
  try {
    const [transfers, counters] = await Promise.all([
      blockscout(`/tokens/${CONTRACT}/transfers`),
      blockscout(`/tokens/${CONTRACT}/counters`),
    ]);

    const events = (transfers?.items ?? []).slice(0, 50).map((item: any) => {
      const from = String(item?.from?.hash ?? ZERO).toLowerCase();
      const to = String(item?.to?.hash ?? "").toLowerCase();
      const txHash = item?.transaction_hash ?? null;
      const tokenId = item?.total?.token_id ?? item?.token_id ?? item?.id ?? "";

      return {
        event_type: from === ZERO ? "mint" : "transfer",
        event_timestamp: item?.timestamp ?? null,
        transaction: txHash,
        token_id: String(tokenId),
        from,
        to,
        from_label: item?.from?.name ?? null,
        to_label: item?.to?.name ?? null,
      };
    });

    return NextResponse.json({
      configured: true,
      chain_id: CHAIN_ID,
      contract: CONTRACT,
      events,
      holders: Number(counters?.token_holders_count ?? 0),
      message: events.length ? "" : "No NFT activity found yet on Robinhood Chain.",
    }, {
      headers: { "Cache-Control": "s-maxage=15, stale-while-revalidate=60" },
    });
  } catch (error) {
    return NextResponse.json({
      configured: true,
      chain_id: CHAIN_ID,
      contract: CONTRACT,
      events: [],
      holders: 0,
      message: error instanceof Error ? error.message : "Unable to load Blockscout activity.",
    }, { status: 200 });
  }
}
