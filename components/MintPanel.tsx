"use client";

import ComicButton from "@/components/ui/ComicButton";
import ComicCard from "@/components/ui/ComicCard";
import { MINT_PRICE_LABEL, OPENSEA_MINT_URL } from "@/lib/contract";

export default function MintPanel() {
  return (
    <ComicCard className="w-full max-w-xl bg-white p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase text-gray-500">Genesis Mint</p>
          <h3 className="mt-1 text-3xl font-black uppercase">Get Your Player</h3>
        </div>
        <div className="border-2 border-black bg-lime-300 px-3 py-2 text-xs font-black uppercase shadow-[3px_3px_0_#000]">
          {MINT_PRICE_LABEL}
        </div>
      </div>

      <div className="mt-6 border-2 border-black bg-[#F8D43A] p-4 text-center">
        <p className="text-3xl font-black uppercase">0.0002 ETH MINT</p>
        <p className="mt-1 text-xs font-bold uppercase">Minting takes place on OpenSea</p>
      </div>

      <div className="mt-6">
        <a href={OPENSEA_MINT_URL} target="_blank" rel="noopener noreferrer" className="block">
          <ComicButton variant="pink" className="w-full">
            Mint on OpenSea • 0.0002 ETH
          </ComicButton>
        </a>
      </div>

      <p className="mt-4 text-center text-[10px] font-black uppercase leading-4 text-gray-500">
        Mint price: 0.0002 ETH. OpenSea may still charge applicable network or marketplace fees.
      </p>
    </ComicCard>
  );
}
