"use client";

import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">

      {/* Left Glow */}
      <motion.div
        animate={{
          x: [-120, 120, -120],
          y: [-50, 80, -50],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-[-250px] top-[120px] h-[900px] w-[900px] rounded-full bg-lime-400/15 blur-[220px]"
      />

      {/* Right Glow */}
      <motion.div
        animate={{
          x: [120, -120, 120],
          y: [60, -60, 60],
          scale: [1.2, .9, 1.2],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute right-[-300px] top-[80px] h-[800px] w-[800px] rounded-full bg-cyan-500/10 blur-[220px]"
      />

      {/* Center Glow */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[180px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Fade */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_95%)]" />

    </div>
  );
}