"use client";

import ComicBadge from "@/components/ui/ComicBadge";
import ComicCard from "@/components/ui/ComicCard";

const phases = [
  {
    number: "01",
    title: "THE DROP",
    tag: "GENESIS",
    text: "The first 2,600 HOOD PLAYERS enter the game. Mint your player and secure your spot in the community.",
    status: "LIVE",
    color: "pink",
  },
  {
    number: "02",
    title: "THE HOOD",
    tag: "COMMUNITY",
    text: "Holder-only spaces, community events, giveaways and new ways for players to connect.",
    status: "NEXT",
    color: "blue",
  },
  {
    number: "03",
    title: "LEVEL UP",
    tag: "UTILITY",
    text: "More player perks, collaborations and ecosystem utilities built around the HOOD PLAYERS.",
    status: "SOON",
    color: "green",
  },
  {
    number: "04",
    title: "GAME ON",
    tag: "FUTURE",
    text: "The community decides what comes next. New drops, experiences and surprises are unlocked together.",
    status: "TBA",
    color: "yellow",
  },
] as const;

const badgeColors = {
  pink: "pink",
  blue: "blue",
  green: "green",
  yellow: "yellow",
} as const;

export default function Roadmap() {
  return (
    <section id="roadmap" className="border-y-4 border-black bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          <ComicBadge color="pink">The Plan</ComicBadge>

          <h2 className="mt-5 text-5xl font-black uppercase leading-[0.88] sm:text-6xl lg:text-7xl">
            Roadmap
            <br />
            <span className="text-pink-500">For The Hood</span>
          </h2>

          <p className="mt-6 max-w-2xl text-sm font-bold leading-6 sm:text-base sm:leading-7">
            No corporate promises. Just a simple plan to build the HOOD
            PLAYERS universe with the people who join it.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute bottom-0 left-5 top-0 w-1 bg-black sm:left-1/2 sm:-translate-x-1/2" />

          <div className="space-y-8 sm:space-y-10">
            {phases.map((phase, index) => (
              <div
                key={phase.number}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
                }`}
              >
                <div className="absolute left-5 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center border-4 border-black bg-[#F8D43A] text-sm font-black shadow-[3px_3px_0_#000] sm:left-1/2">
                  {phase.number}
                </div>

                <ComicCard
                  className={`ml-12 w-[calc(100%-3rem)] p-5 sm:ml-0 sm:w-[46%] sm:p-6 ${
                    index % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <ComicBadge color={badgeColors[phase.color]}>
                        {phase.tag}
                      </ComicBadge>
                      <h3 className="mt-4 text-2xl font-black uppercase sm:text-3xl">
                        {phase.title}
                      </h3>
                    </div>

                    <span className="shrink-0 border-2 border-black bg-black px-2 py-1 text-[9px] font-black uppercase text-white">
                      {phase.status}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-bold leading-6 text-gray-700">
                    {phase.text}
                  </p>
                </ComicCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
