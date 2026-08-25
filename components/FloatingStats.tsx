"use client";

import { motion } from "framer-motion";

export default function FloatingStats() {
  return (
    <>
      {/* Top Card */}

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{
          opacity: 1,
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-10 top-10 z-30 w-[210px] rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
      >
        <p className="text-sm text-white/60">
          Total Supply
        </p>

        <h2 className="mt-2 text-3xl font-black">
          2,600
        </h2>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[68%] rounded-full bg-lime-400" />
        </div>

        <p className="mt-3 text-sm text-lime-300">
          68% Minted
        </p>
      </motion.div>

      {/* Bottom Card */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: 1,
          y: [0, 12, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-8 bottom-12 z-30 w-[230px] rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
      >
        <p className="text-sm text-white/60">
          Floor Price
        </p>

        <h2 className="mt-2 text-3xl font-black">
          0.15 ETH
        </h2>

        <div className="mt-5 flex items-center justify-between">

          <div>
            <p className="text-xs text-white/50">
              Holders
            </p>

            <h3 className="mt-1 font-bold">
              1,472
            </h3>
          </div>

          <div>
            <p className="text-xs text-white/50">
              Volume
            </p>

            <h3 className="mt-1 font-bold text-lime-300">
              412 ETH
            </h3>
          </div>

        </div>
      </motion.div>

      {/* Small Badge */}

      <motion.div
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-36 top-28 z-40 rounded-full border border-lime-400/20 bg-lime-400/10 px-5 py-3 backdrop-blur-xl"
      >
        <span className="text-sm font-semibold text-lime-300">
          ● LIVE MINT
        </span>
      </motion.div>
    </>
  );
}