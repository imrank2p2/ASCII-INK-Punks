"use client";

import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* Left Orb */}

      <motion.div
        animate={{
          x: [-80, 120, -80],
          y: [-50, 70, -50],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-[-280px] top-[120px] h-[900px] w-[900px] rounded-full bg-lime-400/15 blur-[180px]"
      />

      {/* Right Orb */}

      <motion.div
        animate={{
          x: [100, -120, 100],
          y: [80, -60, 80],
          scale: [1.15, .9, 1.15],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute right-[-280px] top-[40px] h-[800px] w-[800px] rounded-full bg-cyan-500/12 blur-[180px]"
      />

      {/* Center Light */}

      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[170px]" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Noise */}

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Top Gradient */}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />

    </div>
  );
}