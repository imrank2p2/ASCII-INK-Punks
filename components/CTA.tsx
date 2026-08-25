"use client";

import ComicBadge from "@/components/ui/ComicBadge";
import ComicButton from "@/components/ui/ComicButton";
import MintPanel from "@/components/MintPanel";

export default function CTA() {
  return (
    <section id="mint" className="border-b-4 border-black bg-pink-500">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="relative overflow-hidden border-4 border-black bg-[#F8D43A] p-6 shadow-[10px_10px_0_#000] sm:p-10 lg:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <ComicBadge color="pink">Ready Player?</ComicBadge>

              <h2 className="mt-5 text-5xl font-black uppercase leading-[0.85] sm:text-6xl lg:text-8xl">
                Join The
                <br />
                <span className="text-pink-500">Hood.</span>
              </h2>

              <p className="mt-6 max-w-xl text-sm font-bold leading-6 sm:text-base sm:leading-7">
                Grab your HOOD PLAYER, join the community and see what happens
                when the players make the rules.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#mint"><ComicButton variant="pink">Mint on OpenSea</ComicButton></a>
                <ComicButton variant="white">Join Community</ComicButton>
              </div>
            </div>

            <div className="mx-auto flex h-40 w-40 rotate-6 items-center justify-center border-4 border-black bg-lime-300 text-center shadow-[7px_7px_0_#000] sm:h-48 sm:w-48 lg:h-56 lg:w-56">
              <span className="text-3xl font-black uppercase leading-[0.9] sm:text-4xl lg:text-5xl">
                Get
                <br />
                In.
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-10 flex justify-center lg:mt-12">
            <MintPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
