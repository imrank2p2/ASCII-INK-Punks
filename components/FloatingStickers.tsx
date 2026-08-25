"use client";

import ComicSticker from "@/components/ui/ComicSticker";

export default function FloatingStickers() {
  return (
    <>
      <div className="pointer-events-none absolute left-10 top-20 hidden xl:block">
        <ComicSticker color="pink" rotate="-rotate-12">
          🚀 LFG
        </ComicSticker>
      </div>

      <div className="pointer-events-none absolute right-12 top-40 hidden xl:block">
        <ComicSticker color="green" rotate="rotate-6">
          💎 HODL
        </ComicSticker>
      </div>

      <div className="pointer-events-none absolute bottom-24 left-20 hidden xl:block">
        <ComicSticker color="yellow" rotate="-rotate-6">
          📈 BULLISH
        </ComicSticker>
      </div>

      <div className="pointer-events-none absolute bottom-12 right-24 hidden xl:block">
        <ComicSticker color="blue" rotate="rotate-12">
          🤑 0.0002 ETH MINT
        </ComicSticker>
      </div>
    </>
  );
}