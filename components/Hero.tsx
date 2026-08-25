import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 pixel-grid opacity-50" />
      <div className="pointer-events-none absolute inset-0 pixel-noise opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-fuchsia-400/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl flex-col items-center justify-center px-5 py-14 text-center">
        <p className="pixel mb-7 text-[9px] text-fuchsia-200 sm:text-[11px]">
          WELCOME TO THE INK
        </p>

        <h1 className="max-w-5xl text-3xl leading-[1.7] tracking-wide text-white sm:text-5xl sm:leading-[1.6] lg:text-6xl">
          ASCCI
          <br />
          <span className="text-fuchsia-200">INK PUNKS</span>
        </h1>

        <p className="mt-7 max-w-xl text-2xl leading-7 text-purple-100 sm:text-3xl">
          Pixel punks born on Ink.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href="#collection" className="pixel-button">
            VIEW PUNKS
          </Link>
          <Link href="/apply" className="pixel-button dark">
            APPLY FOR WL
          </Link>
        </div>

        <div className="mt-14 w-full max-w-[520px]">
          <div className="pixel-border mx-auto w-fit bg-purple-950/40 p-3">
            <img
              src="/ascci-hero-v2.gif"
              alt="ASCCI INK Punk"
              className="h-auto w-[260px] sm:w-[360px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
