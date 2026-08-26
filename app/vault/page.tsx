"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComicBadge from "@/components/ui/ComicBadge";
import ComicButton from "@/components/ui/ComicButton";
import ComicCard from "@/components/ui/ComicCard";
import { CONTRACT_ADDRESS } from "@/lib/contract";

const CHAIN_ID = "0x1237";
const RPC_URL = "https://rpc.mainnet.chain.robinhood.com";
const EXPLORER = "https://robinhoodchain.blockscout.com";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, listener: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
    };
  }
}

type Player = { id: bigint; images: string[]; name: string };

function shorten(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

async function rpc(method: string, params: unknown[] = []) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await response.json();
  if (json.error) throw new Error(json.error.message || "RPC request failed");
  return json.result;
}

async function readBalance(address: string) {
  const clean = address.toLowerCase().replace(/^0x/, "");
  const data = `0x70a08231${clean.padStart(64, "0")}`;
  const result = await rpc("eth_call", [{ to: CONTRACT_ADDRESS, data }, "latest"]);
  return BigInt(result || "0x0");
}

function normalizeAssetUrls(value: string) {
  if (!value) return [];
  if (value.startsWith("ipfs://")) {
    const path = value.slice(7);
    return [
      `https://ipfs.io/ipfs/${path}`,
      `https://nftstorage.link/ipfs/${path}`,
      `https://gateway.pinata.cloud/ipfs/${path}`,
    ];
  }
  if (value.startsWith("ar://")) {
    const id = value.slice(5);
    return [`https://arweave.net/${id}`, `https://ar-io.net/${id}`];
  }
  return [value];
}

async function discoverOwnedTokenIds(owner: string): Promise<Player[]> {
  const all: Player[] = [];
  let nextToken: string | null = null;

  for (let page = 0; page < 20; page++) {
    const params = new URLSearchParams({ holder_address_hash: owner });
    if (nextToken) params.set("unique_token", nextToken);

    const response = await fetch(
      `https://robinhoodchain.blockscout.com/api/v2/tokens/${CONTRACT_ADDRESS}/instances?${params}`,
      { headers: { accept: "application/json" }, cache: "no-store" }
    );
    if (!response.ok) throw new Error(`NFT indexer returned HTTP ${response.status}`);

    const json = await response.json();
    const items = Array.isArray(json.items) ? json.items : [];

    for (const item of items) {
      if (item?.id == null) continue;
      const id = BigInt(item.id);
      const rawImage = item?.image_url || item?.metadata?.image_url || item?.metadata?.image || "";
      all.push({
        id,
        images: normalizeAssetUrls(rawImage),
        name: item?.metadata?.name || `ASCCI INK PUNK #${id}`,
      });
    }

    const next = json?.next_page_params?.unique_token;
    if (!next || items.length === 0) break;
    nextToken = String(next);
  }

  const seen = new Set<string>();
  return all.filter((p) => {
    const key = p.id.toString();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export default function VaultPage() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState<bigint | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedId, setSelectedId] = useState<bigint | null>(null);
  const [busy, setBusy] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const hasPlayers = useMemo(
    () => balance !== null && balance > BigInt(0),
    [balance]
  );

  async function connect() {
    setError("");
    if (!window.ethereum) {
      setError("No browser wallet detected. Install MetaMask or another EVM wallet.");
      return;
    }

    setBusy(true);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: CHAIN_ID }],
        });
      } catch (switchError: unknown) {
        const code =
          typeof switchError === "object" && switchError && "code" in switchError
            ? (switchError as { code?: number }).code
            : undefined;

        if (code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: CHAIN_ID,
              chainName: "Robinhood Chain",
              nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: [RPC_URL],
              blockExplorerUrls: [EXPLORER],
            }],
          });
        } else {
          throw switchError;
        }
      }

      const accounts = (await window.ethereum.request({ method: "eth_accounts" })) as string[];
      const next = accounts?.[0] || "";
      setAccount(next);
      if (next) setBalance(await readBalance(next));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet connection failed.");
    } finally {
      setBusy(false);
    }
  }

  async function scanPlayers() {
    if (!account || !balance || balance <= BigInt(0)) return;
    setScanning(true);
    setError("");
    setPlayers([]);
    setSelectedId(null);

    try {
      const found = await discoverOwnedTokenIds(account);
      setPlayers(found);
      if (found.length) setSelectedId(found[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your Punks.");
    } finally {
      setScanning(false);
    }
  }

  useEffect(() => {
    if (!window.ethereum?.on) return;

    const accountsChanged = (...args: unknown[]) => {
      const accounts = (args[0] || []) as string[];
      const next = accounts[0] || "";
      setAccount(next);
      setBalance(null);
      setPlayers([]);
      setSelectedId(null);
      if (next) readBalance(next).then(setBalance).catch(() => setBalance(BigInt(0)));
    };

    window.ethereum.on("accountsChanged", accountsChanged);
    return () => window.ethereum?.removeListener?.("accountsChanged", accountsChanged);
  }, []);

  const selectedNumber = selectedId === null ? null : selectedId.toString();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#7C3AED] text-white">
      <Navbar />

      <section className="border-b-4 border-black bg-[#5B21B6]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_.85fr]">
            <div>
              <ComicBadge color="pink">ASCCI INK PUNKS · VAULT</ComicBadge>
              <h1 className="mt-5 text-5xl font-black uppercase leading-[.84] sm:text-7xl lg:text-8xl">
                YOUR<br /><span className="text-pink-300">PUNKS.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm font-bold leading-6 text-white/80 sm:text-base">
                Connect your wallet and discover the ASCCI INK Punks owned by your address.
              </p>
              <div className="mt-7">
                <ComicButton variant="pink" onClick={connect} disabled={busy}>
                  {busy ? "Checking..." : account ? "Wallet Connected" : "Connect Wallet"}
                </ComicButton>
              </div>
              {account && (
                <div className="mt-4 inline-flex border-2 border-black bg-white px-3 py-2 text-xs font-black text-black shadow-[3px_3px_0_#111]">
                  {shorten(account)}
                </div>
              )}
              {error && <p className="mt-4 text-sm font-black text-red-200">{error}</p>}
            </div>

            <ComicCard className="rotate-1 bg-white p-4 sm:p-6">
              <ComicBadge color="yellow">SELECTED PUNK</ComicBadge>
              <div className="mt-4 overflow-hidden border-4 border-black bg-[#EC4899] p-3">
                <img src="/ascci-hero-v2.gif" alt="ASCCI INK Punk" className="mx-auto w-full max-w-[480px]" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Stat label="OWNED" value={balance === null ? "--" : balance.toString()} />
                <Stat label="PUNK" value={selectedNumber ?? "--"} />
                <Stat label="VAULT" value="SOON" />
              </div>
            </ComicCard>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white text-black">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <ComicBadge color="blue">YOUR ASCCI INK PUNKS</ComicBadge>
              <h2 className="mt-4 text-5xl font-black uppercase leading-[.88] sm:text-6xl">
                SELECT A<br /><span className="text-pink-500">PUNK ID.</span>
              </h2>
            </div>
            <ComicButton variant="yellow" onClick={scanPlayers} disabled={!account || !hasPlayers || scanning}>
              {scanning ? "Scanning..." : "Find My Punks"}
            </ComicButton>
          </div>

          {!account && (
            <div className="mt-10 border-4 border-black bg-[#C084FC] p-6 shadow-[6px_6px_0_#111]">
              <p className="font-black uppercase">Connect your wallet to see your Punks.</p>
            </div>
          )}

          {account && hasPlayers && players.length === 0 && !scanning && (
            <div className="mt-10 border-4 border-black bg-[#F7F1E6] p-6 shadow-[6px_6px_0_#111]">
              <p className="font-black uppercase">{balance?.toString()} ASCCI INK PUNKS found.</p>
            </div>
          )}

          {scanning && (
            <div className="mt-10 border-4 border-black bg-[#38BDF8] p-6 font-black uppercase text-black shadow-[6px_6px_0_#111]">
              Reading token ownership from Robinhood Chain...
            </div>
          )}

          {players.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {players.map((player, index) => {
                const active = selectedId === player.id;
                return (
                  <button key={player.id.toString()} onClick={() => setSelectedId(player.id)}
                    className={`group border-4 border-black p-3 text-left transition-transform ${active ? "bg-pink-500 text-white shadow-[6px_6px_0_#111] -translate-y-1" : "bg-[#F8D43A] text-black shadow-[4px_4px_0_#111] hover:-translate-y-1"} ${index % 2 ? "rotate-1" : "-rotate-1"}`}>
                    <div className="flex aspect-square items-center justify-center overflow-hidden border-4 border-black bg-[#38BDF8]">
                      <PlayerImage sources={player.images} alt={player.name} />
                    </div>
                    <div className="mt-3 text-xs font-black uppercase opacity-70">ASCCI INK PUNK</div>
                    <div className="text-3xl font-black">#{player.id.toString()}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="border-b-4 border-black bg-[#C084FC] text-black">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
          <ComicBadge color="yellow">PUNK STATE</ComicBadge>
          <h2 className="mt-5 text-5xl font-black uppercase leading-[.86] sm:text-6xl">
            PUNK<br /><span className="text-pink-600">#{selectedNumber ?? "----"}</span>
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <State label="OWNER" value={account ? shorten(account) : "NOT CONNECTED"} />
            <State label="TOKEN ID" value={selectedNumber ?? "NOT SELECTED"} />
            <State label="STATUS" value="INACTIVE" />
            <State label="TIER" value="FUTURE" />
            <State label="VAULT" value="NOT CREATED" />
            <State label="REWARDS" value="COMING LATER" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PlayerImage({ sources, alt }: { sources: string[]; alt: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [sources.join("|")]);

  if (!sources.length || index >= sources.length) {
    return <div className="flex h-full w-full items-center justify-center"><span className="text-2xl">🖼️</span></div>;
  }

  return (
    <img
      src={sources[index]}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
      onError={() => setIndex((current) => current + 1)}
    />
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="border-4 border-black bg-[#F8D43A] p-3 text-center text-black"><div className="text-[9px] font-black uppercase">{label}</div><div className="mt-1 truncate text-xl font-black uppercase">{value}</div></div>;
}

function State({ label, value }: { label: string; value: string }) {
  return <div className="border-4 border-black bg-white p-4"><div className="text-[9px] font-black uppercase text-gray-500">{label}</div><div className="mt-1 break-all text-sm font-black uppercase">{value}</div></div>;
}
