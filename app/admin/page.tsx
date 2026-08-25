"use client";

import { useEffect, useMemo, useState } from "react";

type Application = {
  id: string;
  created_at: string;
  twitter: string;
  proof_url: string;
  wallet: string;
  score: number;
  status: "pending" | "approved" | "rejected";
  reviewed_at: string | null;
};

const statusOptions = ["all", "pending", "approved", "rejected"] as const;

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [apps, setApps] = useState<Application[]>([]);
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadApplications() {
    setLoading(true);
    const response = await fetch(`/api/admin/applications?status=${status}&q=${encodeURIComponent(query)}`, { cache: "no-store" });
    if (response.status === 401) { setLoggedIn(false); setLoading(false); return; }
    const data = await response.json();
    if (!response.ok) setError(data.error || "Could not load data");
    else setApps(data);
    setLoading(false);
  }

  useEffect(() => {
    fetch("/api/admin/applications?status=all").then((r) => setLoggedIn(r.ok)).catch(() => setLoggedIn(false));
  }, []);

  useEffect(() => {
    if (loggedIn) loadApplications();
  }, [loggedIn, status]);

  const stats = useMemo(() => ({
    total: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
    avg: apps.length ? Math.round(apps.reduce((sum, a) => sum + Number(a.score || 0), 0) / apps.length) : 0,
  }), [apps]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Login failed"); return; }
    setPassword(""); setLoggedIn(true);
  }

  async function update(id: string, nextStatus: Application["status"]) {
    const response = await fetch("/api/admin/applications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: nextStatus }) });
    if (response.ok) loadApplications();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
  }

  if (loggedIn === null) return <main className="min-h-screen grid place-items-center"><p className="pixel text-xs">LOADING...</p></main>;

  if (!loggedIn) return (
    <main className="min-h-screen grid place-items-center px-5">
      <form onSubmit={login} className="pixel-border w-full max-w-md bg-purple-950/70 p-7">
        <p className="pixel text-[9px] text-fuchsia-200">ASCCI INK PUNKS</p>
        <h1 className="mt-6 text-2xl">ADMIN ACCESS</h1>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ADMIN PASSWORD" className="mt-8 w-full border-2 border-white/70 bg-purple-950 px-4 py-4 text-xl outline-none" />
        {error && <p className="mt-4 text-red-200">{error}</p>}
        <button className="pixel-button mt-6 w-full" type="submit">ENTER</button>
      </form>
    </main>
  );

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="pixel text-[9px] text-fuchsia-200">ASCCI INK PUNKS</p><h1 className="mt-4 text-2xl sm:text-3xl">WL DASHBOARD</h1></div>
          <div className="flex gap-3"><a className="pixel-button !px-3 !py-2 !text-[8px]" href="/api/admin/export">EXPORT CSV</a><button className="pixel-button dark !px-3 !py-2 !text-[8px]" onClick={logout}>LOGOUT</button></div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[['TOTAL', stats.total], ['PENDING', stats.pending], ['APPROVED', stats.approved], ['REJECTED', stats.rejected], ['AVG SCORE', stats.avg]].map(([label, value]) => <div key={String(label)} className="pixel-border bg-purple-950/50 p-4"><p className="pixel text-[7px] text-fuchsia-200">{label}</p><p className="mt-4 text-3xl">{value}</p></div>)}
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') loadApplications(); }} placeholder="SEARCH X HANDLE OR WALLET" className="w-full border-2 border-white/60 bg-purple-950/70 px-4 py-4 outline-none md:flex-1" />
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="border-2 border-white/60 bg-purple-950 px-4 py-4"><option value="all">ALL</option><option value="pending">PENDING</option><option value="approved">APPROVED</option><option value="rejected">REJECTED</option></select>
          <button onClick={loadApplications} className="pixel-button !px-4 !py-3 !text-[8px]">REFRESH</button>
        </div>

        {error && <p className="mt-4 text-red-200">{error}</p>}
        <div className="mt-6 overflow-x-auto pixel-border bg-purple-950/50">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead><tr className="border-b border-white/20"><th className="p-4">DATE</th><th className="p-4">X</th><th className="p-4">WALLET</th><th className="p-4">SCORE</th><th className="p-4">STATUS</th><th className="p-4">ACTIONS</th></tr></thead>
            <tbody>{apps.map((app) => <tr key={app.id} className="border-b border-white/10 align-top"><td className="p-4">{new Date(app.created_at).toLocaleString()}</td><td className="p-4"><div>{app.twitter}</div><a className="text-fuchsia-200 underline" href={app.proof_url} target="_blank" rel="noreferrer">PROOF</a></td><td className="p-4 font-mono text-xs">{app.wallet}</td><td className="p-4 text-xl">{app.score}</td><td className="p-4"><span className="pixel text-[7px]">{app.status.toUpperCase()}</span></td><td className="p-4"><div className="flex flex-wrap gap-2">{app.status !== 'approved' && <button className="pixel-button !px-2 !py-2 !text-[7px]" onClick={() => update(app.id, 'approved')}>APPROVE</button>}{app.status !== 'rejected' && <button className="pixel-button dark !px-2 !py-2 !text-[7px]" onClick={() => update(app.id, 'rejected')}>REJECT</button>}{app.status !== 'pending' && <button className="border-2 border-white px-2 py-2 font-mono text-xs" onClick={() => update(app.id, 'pending')}>PENDING</button>}</div></td></tr>)}</tbody>
          </table>
          {!loading && apps.length === 0 && <div className="p-10 text-center">NO APPLICATIONS FOUND.</div>}
          {loading && <div className="p-10 text-center">LOADING...</div>}
        </div>
      </div>
    </main>
  );
}
