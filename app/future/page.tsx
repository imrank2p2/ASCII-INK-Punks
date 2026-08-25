import Link from "next/link";
import ComicBadge from "@/components/ui/ComicBadge";
import ComicCard from "@/components/ui/ComicCard";
import ComicButton from "@/components/ui/ComicButton";

const phases = [
  {
    number: "01",
    title: "THE TOKEN",
    label: "COMING NEXT",
    color: "pink" as const,
    text: "A future HOOD PLAYERS token designed to connect the collection with the wider ecosystem.",
  },
  {
    number: "02",
    title: "ACTIVATE",
    label: "PLANNED",
    color: "blue" as const,
    text: "Future utility can give holders ways to activate, upgrade and unlock deeper player mechanics.",
  },
  {
    number: "03",
    title: "REWARDS",
    label: "IN DEVELOPMENT",
    color: "green" as const,
    text: "A revenue-based reward system is being explored. Rewards will depend on actual ecosystem activity, not guaranteed returns.",
  },
  {
    number: "04",
    title: "FUSION",
    label: "FUTURE",
    color: "yellow" as const,
    text: "A future fusion mechanic could let players combine NFTs, increase their level and create stronger player states.",
  },
];

const utility = [
  ["TOKEN", "A future token layer for the HOOD PLAYERS ecosystem."],
  ["BURN", "Potential token burns for activation, upgrades and other utilities."],
  ["VAULT", "A possible NFT-linked reward state that stays with the player."],
  ["TIERS", "Progression mechanics that can make every player more unique."],
];

export default function FuturePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8D43A]">
      <header className="sticky top-0 z-50 border-b-4 border-black bg-[#38BDF8]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-black bg-pink-500 text-xl font-black text-white shadow-[4px_4px_0_#000]">
              HP
            </div>
            <div>
              <div className="text-xl font-black uppercase leading-none">HOOD</div>
              <div className="text-xs font-black uppercase">PLAYERS</div>
            </div>
          </Link>

          <Link href="/">
            <ComicButton variant="yellow">Back Home</ComicButton>
          </Link>
        </div>
      </header>

      <section className="border-b-4 border-black bg-[#F7F1E6]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
          <div>
            <ComicBadge color="pink">THE NEXT MOVE</ComicBadge>

            <h1 className="mt-6 max-w-4xl text-6xl font-black uppercase leading-[.84] sm:text-7xl lg:text-8xl">
              HOOD
              <br />
              <span className="text-pink-500">PLAYERS</span>
              <br />
              IS JUST
              <br />
              <span className="text-[#38BDF8]">GETTING STARTED.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base font-bold leading-7 text-gray-700 sm:text-lg">
              The Genesis collection is the beginning. We are building toward
              a bigger player ecosystem with token utility, progression,
              rewards and more ways for holders to play.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/">
                <ComicButton variant="pink">Explore HOOD PLAYERS</ComicButton>
              </Link>
              <a href="#system">
                <ComicButton variant="blue">See The Plan</ComicButton>
              </a>
            </div>

            <p className="mt-5 max-w-xl text-[11px] font-black uppercase leading-5 text-gray-500">
              Planned features are not live yet. Nothing on this page is a
              promise of profit or a guaranteed return.
            </p>
          </div>

          <ComicCard className="relative rotate-2 bg-white p-5 sm:p-7">
            <ComicBadge
              color="yellow"
              className="absolute -top-5 left-7 -rotate-6"
            >
              PLAYER #NEXT
            </ComicBadge>

            <div className="border-4 border-black bg-[#38BDF8] p-3">
              <img
                src="/ascci-hero-v2.gif"
                alt="HOOD PLAYER"
                className="w-full"
                />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="border-4 border-black bg-[#F8D43A] p-3 text-center">
                <div className="text-2xl font-black">01</div>
                <div className="text-[9px] font-black uppercase">Token</div>
              </div>
              <div className="border-4 border-black bg-pink-500 p-3 text-center text-white">
                <div className="text-2xl font-black">02</div>
                <div className="text-[9px] font-black uppercase">Utility</div>
              </div>
              <div className="border-4 border-black bg-[#A3E635] p-3 text-center">
                <div className="text-2xl font-black">03</div>
                <div className="text-[9px] font-black uppercase">Rewards</div>
              </div>
            </div>
          </ComicCard>
        </div>
      </section>

      <section id="system" className="border-b-4 border-black bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <ComicBadge color="blue">THE IDEA</ComicBadge>
            <h2 className="mt-5 text-5xl font-black uppercase leading-[.88] sm:text-6xl lg:text-7xl">
              ONE COLLECTION.
              <br />
              <span className="text-pink-500">MORE TO BUILD.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-sm font-bold leading-6 text-gray-700 sm:text-base sm:leading-7">
              The goal is simple: make your HOOD PLAYER more than a picture.
              Future mechanics are being designed so that ownership can unlock
              progression and utility across the ecosystem.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {utility.map(([title, text], index) => (
              <ComicCard
                key={title}
                className={`p-6 ${
                  index % 2 === 0 ? "-rotate-1" : "rotate-1"
                }`}
              >
                <div className="text-5xl font-black text-pink-500">
                  0{index + 1}
                </div>
                <h3 className="mt-5 text-2xl font-black uppercase">{title}</h3>
                <p className="mt-3 text-sm font-bold leading-6 text-gray-700">
                  {text}
                </p>
              </ComicCard>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-[#F8D43A]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <ComicBadge color="pink">HOW IT COULD WORK</ComicBadge>
              <h2 className="mt-5 text-5xl font-black uppercase leading-[.88] sm:text-6xl">
                FROM
                <br />
                <span className="text-pink-500">ACTIVITY</span>
                <br />
                TO PLAYER.
              </h2>
              <p className="mt-6 max-w-md text-sm font-bold leading-6">
                The long-term idea is to connect real ecosystem revenue with
                useful player mechanics. Any reward system will be based on
                actual activity and available revenue, not guaranteed income.
              </p>
            </div>

            <div className="space-y-4">
              {[
                ["01", "ECOSYSTEM ACTIVITY", "Trading and other ecosystem activity can generate project revenue."],
                ["02", "TREASURY", "A defined portion can be routed into the project's reward treasury."],
                ["03", "PLAYER VAULT", "Future active NFTs can receive an on-chain reward balance or selected assets."],
                ["04", "OWNERSHIP", "The goal is for the relevant player state to remain attached to the NFT when it changes hands."],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="grid gap-4 border-4 border-black bg-white p-5 shadow-[6px_6px_0_#111] sm:grid-cols-[70px_1fr] sm:items-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center border-4 border-black bg-[#38BDF8] text-xl font-black">
                    {number}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase">{title}</h3>
                    <p className="mt-1 text-sm font-bold leading-6 text-gray-700">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-[#F7F1E6]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
          <ComicBadge color="green">THE ROAD AHEAD</ComicBadge>
          <h2 className="mt-5 text-5xl font-black uppercase leading-[.88] sm:text-6xl lg:text-7xl">
            BUILD IT
            <br />
            <span className="text-pink-500">STEP BY STEP.</span>
          </h2>

          <div className="relative mt-12">
            <div className="absolute bottom-0 left-5 top-0 w-1 bg-black sm:left-1/2 sm:-translate-x-1/2" />
            <div className="space-y-8">
              {phases.map((phase, index) => (
                <div
                  key={phase.number}
                  className={`relative flex ${
                    index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
                  }`}
                >
                  <div className="absolute left-5 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center border-4 border-black bg-[#F8D43A] text-sm font-black shadow-[3px_3px_0_#000] sm:left-1/2">
                    {phase.number}
                  </div>

                  <ComicCard
                    className={`ml-12 w-[calc(100%-3rem)] p-5 sm:ml-0 sm:w-[46%] sm:p-6 ${
                      index % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <ComicBadge color={phase.color}>{phase.label}</ComicBadge>
                      <span className="text-3xl font-black text-gray-300">
                        {phase.number}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black uppercase sm:text-3xl">
                      {phase.title}
                    </h3>
                    <p className="mt-3 text-sm font-bold leading-6 text-gray-700">
                      {phase.text}
                    </p>
                  </ComicCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-6 sm:py-20">
          <ComicBadge color="yellow">HOOD PLAYERS</ComicBadge>
          <h2 className="mt-6 text-5xl font-black uppercase leading-[.88] sm:text-7xl">
            THE PICTURE
            <br />
            <span className="text-pink-500">IS ONLY STEP ONE.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm font-bold leading-6 text-gray-300 sm:text-base">
            We are building carefully, one piece at a time. More details will
            be announced when each feature is ready.
          </p>
          <div className="mt-8">
            <Link href="/">
              <ComicButton variant="yellow">Back To HOOD PLAYERS</ComicButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
