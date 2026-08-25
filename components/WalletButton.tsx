"use client";

import { OPENSEA_MINT_URL } from "@/lib/contract";

export default function WalletButton() {
  return (
    <a
      href={OPENSEA_MINT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="border-2 border-black bg-pink-500 px-4 py-2 text-xs font-black uppercase text-white shadow-[3px_3px_0_#000] transition hover:-translate-y-0.5 sm:px-5 sm:py-3"
    >
      Mint on OpenSea
    </a>
  );
}
