"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/25 bg-[#3b0764]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="block" aria-label="ASCCI INK Punks">
          <img src="/ascci-logo-v2.gif" alt="ASCCI INK Punks" className="h-12 w-auto object-contain sm:h-14" />
        </Link>

        <nav className="hidden items-center gap-7 text-[9px] md:flex">
          <a href="#about">ABOUT</a>
          <a href="#collection">COLLECTION</a>
          <Link href="/apply">APPLY</Link>
          <a href="https://x.com/GlowPunkNFT" target="_blank" rel="noreferrer">X</a>
        </nav>

        <Link href="/apply" className="pixel-button !px-3 !py-2 !text-[8px]">
          APPLY
        </Link>
      </div>
    </header>
  );
}
