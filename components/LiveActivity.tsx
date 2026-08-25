"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ActivityEvent = {
  event_type?: string;
  event_timestamp?: string | null;
  transaction?: string | null;
  token_id?: string;
  from?: string;
  to?: string;
  from_label?: string | null;
  to_label?: string | null;
};

const shorten = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Unknown wallet";

const timeAgo = (value?: string | null) => {
  if (!value) return "recently";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "recently";
  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

function normalize(event: ActivityEvent) {
  const action = event.event_type === "mint" ? "MINTED" : "TRANSFERRED";
  const token = event.token_id ? `HOOD PLAYER #${event.token_id}` : "HOOD PLAYER";
  const from = event.from && event.from !== "0x0000000000000000000000000000000000000000" ? event.from : undefined;
  const to = event.to;
  const explorer = event.transaction
    ? `https://robinhoodchain.blockscout.com/tx/${event.transaction}`
    : "https://robinhoodchain.blockscout.com/";

  return { action, token, from, to, timestamp: event.event_timestamp, explorer };
}

export default function LiveActivity() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [configured, setConfigured] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/activity", { cache: "no-store" });
      const data = await response.json();
      setConfigured(Boolean(data.configured));
      setEvents(Array.isArray(data.events) ? data.events : []);
      setMessage(data.message ?? "");
    } catch {
      setMessage("Activity is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 15000);
    return () => window.clearInterval(timer);
  }, [load]);

  const rows = useMemo(
    () =>
      events
        .map(normalize)
        .sort(
          (a, b) =>
            new Date(b.timestamp ?? 0).getTime() - new Date(a.timestamp ?? 0).getTime()
        )
        .slice(0, 50),
    [events]
  );

  return (
    <section id="activity" className="border-y-4 border-black bg-[#F4EFE4]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="inline-block border-2 border-black bg-lime-300 px-3 py-1 text-[10px] font-black uppercase shadow-[3px_3px_0_#000]">
              Live Feed
            </div>
            <h2 className="mt-4 text-5xl font-black uppercase leading-[0.85] sm:text-6xl">
              Player
              <br />
              Activity
            </h2>
          </div>

          <a
            href="https://robinhoodchain.blockscout.com/address/0x5ae0cde11fb3f5072a0e8a2b802ecf9af0814dd8"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit border-2 border-black bg-pink-500 px-4 py-2 text-xs font-black uppercase text-white shadow-[4px_4px_0_#000]"
          >
            View on Explorer
          </a>
        </div>

        <div className="mt-8 overflow-hidden border-4 border-black bg-white shadow-[7px_7px_0_#000]">
          {!configured ? (
            <div className="p-8 text-center">
              <p className="text-lg font-black uppercase">Connect Blockscout Activity</p>
              <p className="mt-2 text-sm font-bold text-gray-600">
                Add the Blockscout API key in Vercel as BLOCKSCOUT_API_KEY.
              </p>
            </div>
          ) : loading ? (
            <div className="p-8 text-center text-sm font-black uppercase">Loading activity...</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-black uppercase">No activity yet</p>
              {message && <p className="mt-2 text-xs font-bold text-gray-500">{message}</p>}
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {rows.map((row, index) => (
                <a
                  key={`${row.timestamp}-${row.token}-${index}`}
                  href={row.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid gap-3 p-4 transition hover:bg-lime-200 sm:grid-cols-[120px_1fr_auto] sm:items-center"
                >
                  <span
                    className={`w-fit border-2 border-black px-2 py-1 text-[10px] font-black uppercase ${
                      row.action === "MINTED" ? "bg-lime-300" : "bg-sky-400"
                    }`}
                  >
                    {row.action}
                  </span>

                  <div>
                    <p className="text-sm font-black uppercase">{row.token}</p>
                    <p className="mt-1 text-xs font-bold text-gray-600">
                      {row.action === "MINTED"
                        ? `Minted to ${shorten(row.to)}`
                        : `${shorten(row.from)} → ${shorten(row.to)}`}
                    </p>
                  </div>

                  <span className="text-[10px] font-black uppercase text-gray-500">
                    {timeAgo(row.timestamp)}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        <p className="mt-4 text-[10px] font-black uppercase text-gray-500">
          Activity refreshes automatically from Robinhood Chain via Blockscout.
        </p>
      </div>
    </section>
  );
}
