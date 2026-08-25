"use client";

import { useState } from "react";
import ComicBadge from "@/components/ui/ComicBadge";
import ComicCard from "@/components/ui/ComicCard";

const questions = [
  {
    q: "WHAT IS HOOD PLAYERS?",
    a: "HOOD PLAYERS is a collection of 2,600 pixel players inspired by meme culture, internet communities and financial market energy.",
  },
  {
    q: "HOW MANY PLAYERS ARE THERE?",
    a: "The genesis collection has a total supply of 2,600 unique HOOD PLAYERS.",
  },
  {
    q: "WHAT IS THE MINT PRICE?",
    a: "The current site UI lists the mint price as 0.0002 ETH. The live mint contract should be connected before launch.",
  },
  {
    q: "WHERE CAN I MINT?",
    a: "The mint button will connect to the official mint flow once the contract and wallet integration are enabled.",
  },
  {
    q: "WHAT DO HOLDERS GET?",
    a: "Holders become part of the HOOD PLAYERS community and can access future community activities, perks and utilities announced by the project.",
  },
  {
    q: "WHEN IS THE NEXT PHASE?",
    a: "The roadmap is intentionally community-driven. Follow the official project channels for confirmed announcements and dates.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-y-4 border-black bg-[#F8D43A]">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-center">
          <ComicBadge color="blue">Questions?</ComicBadge>

          <h2 className="mt-5 text-5xl font-black uppercase leading-[0.88] sm:text-6xl lg:text-7xl">
            Frequently
            <br />
            <span className="text-pink-500">Asked</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm font-bold leading-6 sm:text-base">
            Everything you need to know before you join the hood.
          </p>
        </div>

        <div className="mt-10 space-y-4 sm:mt-14">
          {questions.map((item, index) => {
            const isOpen = open === index;

            return (
              <ComicCard
                key={item.q}
                className={`overflow-hidden p-0 transition-transform ${
                  isOpen ? "rotate-0" : index % 2 ? "rotate-[0.2deg]" : "-rotate-[0.2deg]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-5 p-5 text-left sm:p-6"
                >
                  <span className="text-base font-black uppercase sm:text-lg">
                    {item.q}
                  </span>

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black bg-pink-500 text-xl font-black text-white transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-200 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t-2 border-black px-5 pb-6 pt-5 text-sm font-bold leading-6 text-gray-700 sm:px-6 sm:text-base">
                      {item.a}
                    </p>
                  </div>
                </div>
              </ComicCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
