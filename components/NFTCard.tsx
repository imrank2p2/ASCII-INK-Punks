"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";

export default function NFTCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-200, 200], [15, -15]);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);

  function move(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function leave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={move}
      onMouseLeave={leave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: .25 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative z-20 w-[520px]"
    >
      {/* Outer Glow */}

      <div className="absolute inset-0 rounded-[42px] bg-gradient-to-br from-lime-400/20 via-transparent to-cyan-400/20 blur-3xl" />

      {/* Card */}

      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-3xl">

        {/* Shine */}

        <div className="absolute left-[-40%] top-0 h-full w-[120px] rotate-12 bg-white/10 blur-2xl" />

        {/* Image */}

        <div
          style={{ transform: "translateZ(70px)" }}
          className="overflow-hidden rounded-[28px]"
        >
          <img
  src="/ascci-hero-v2.gif"
  alt="NFT"
  className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
/>
        </div>

        {/* Content */}

        <div
          style={{ transform: "translateZ(80px)" }}
          className="mt-6"
        >
          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-3xl font-black">
                Robinhood Boi
              </h2>

              <p className="mt-2 text-white/55">
                Genesis #0001
              </p>

            </div>

            <div className="rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-sm font-semibold text-lime-300">
              LIVE
            </div>

          </div>

          <div className="mt-7 grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-white/5 p-4">

              <p className="text-xs text-white/45">
                Supply
              </p>

              <h3 className="mt-2 text-xl font-bold">
                2,600
              </h3>

            </div>

            <div className="rounded-2xl bg-white/5 p-4">

              <p className="text-xs text-white/45">
                Price
              </p>

              <h3 className="mt-2 text-xl font-bold">
                0.0002 ETH
              </h3>

            </div>

          </div>

          <button className="mt-7 h-14 w-full rounded-full bg-white text-lg font-bold text-black transition hover:scale-[1.02]">
            Mint Now
          </button>

        </div>

      </div>
    </motion.div>
  );
}
