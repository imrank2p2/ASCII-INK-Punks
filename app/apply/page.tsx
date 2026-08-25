"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ApplyPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError("");
    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ twitter: form.get("twitter"), proof: form.get("proof"), wallet: form.get("wallet") }) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) { setError(data.error || "Could not submit application."); return; }
    setSent(true);
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 pixel-grid opacity-50" />
      <div className="pointer-events-none fixed inset-0 pixel-noise opacity-15" />
      <header className="relative z-10 border-b border-white/25 bg-[#3b0764]/90 backdrop-blur-md"><div className="mx-auto flex h-20 max-w-3xl items-center justify-between px-5"><Link href="/" className="block" aria-label="ASCCI INK Punks"><img src="/ascci-logo-v2.gif" alt="ASCCI INK Punks" className="h-12 w-auto object-contain" /></Link><Link href="/" className="pixel text-[8px] text-fuchsia-200">HOME</Link></div></header>
      <section className="relative z-10 mx-auto max-w-2xl px-5 py-16 sm:py-24">
        <div className="text-center"><p className="pixel text-[9px] text-fuchsia-200">WHITELIST</p><h1 className="mt-7 text-xl leading-8 sm:text-3xl sm:leading-[1.8]">APPLY FOR INK PUNKS</h1><p className="mt-6 text-2xl leading-8 text-purple-100">Complete the form below to apply for the whitelist.</p></div>
        {sent ? <div className="mt-12 pixel-border bg-purple-950/55 p-10 text-center"><p className="pixel text-[9px] text-fuchsia-100">APPLICATION SENT</p><p className="mt-5 text-2xl">Good luck, Punk.</p><Link href="/" className="pixel-button mt-8">BACK HOME</Link></div> : <form onSubmit={submit} className="mt-12 space-y-6 pixel-border bg-purple-950/55 p-5 sm:p-8">
          <label className="block"><span className="pixel text-[8px]">X HANDLE</span><input name="twitter" required placeholder="@yourhandle" className="mt-3 w-full border-2 border-white/70 bg-purple-950/70 px-4 py-4 text-2xl text-white outline-none placeholder:text-purple-300 focus:border-fuchsia-300" /></label>
          <label className="block"><span className="pixel text-[8px]">COMMENT / QUOTE LINK</span><input name="proof" required type="url" placeholder="https://x.com/..." className="mt-3 w-full border-2 border-white/70 bg-purple-950/70 px-4 py-4 text-2xl text-white outline-none placeholder:text-purple-300 focus:border-fuchsia-300" /></label>
          <label className="block"><span className="pixel text-[8px]">EVM WALLET</span><input name="wallet" required placeholder="0x..." pattern="0x[a-fA-F0-9]{40}" className="mt-3 w-full border-2 border-white/70 bg-purple-950/70 px-4 py-4 text-2xl text-white outline-none placeholder:text-purple-300 focus:border-fuchsia-300" /></label>
          <div className="border border-white/20 bg-white/5 p-4 text-xl leading-7 text-purple-100">Follow the official X account and complete the WL tasks before submitting. Your application will be reviewed in the admin dashboard.</div>
          {error && <div className="border-2 border-red-300/70 bg-red-300/10 p-4 text-red-100">{error}</div>}
          <button disabled={loading} type="submit" className="pixel-button w-full disabled:opacity-60">{loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}</button>
        </form>}
      </section>
    </main>
  );
}
