"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  ImageIcon,
  LockKeyhole,
  RefreshCw,
  WalletCards,
} from "lucide-react";
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

function shorten(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

async function rpc(method: string, params: unknown[] = []) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
  });

  const json = await response.json();
  if (json.error) throw new Error(json.error.message || "RPC request failed");
  return json.result;
}

async function readBalance(address: string) {
  const clean = address.toLowerCase().replace(/^0x/, "");
  const data = `0x70a08231${clean.padStart(64, "0")}`;
  const result = await rpc("eth_call", [
    { to: CONTRACT_ADDRESS, data },
    "latest",
  ]);
  return BigInt(result || "0x0");
}

async function readOwner(tokenId: bigint) {
  const hexId = tokenId.toString(16).padStart(64, "0");
  const data = `0x6352211e${hexId}`; // ownerOf(uint256)
  return (await rpc("eth_call", [
    { to: CONTRACT_ADDRESS, data },
    "latest",
  ])) as string;
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
    return [
      `https://arweave.net/${id}`,
      `https://ar-io.net/${id}`,
    ];
  }

  return [value];
}

function decodeAbiString(hex: string) {
  const clean = hex.replace(/^0x/, "");
  if (clean.length < 128) return "";

  const offset = Number(BigInt(`0x${clean.slice(0, 64)}`)) * 2;
  const lengthPos = offset;
  const length = Number(
    BigInt(`0x${clean.slice(lengthPos, lengthPos + 64)}`)
  ) * 2;

  const data = clean.slice(
    lengthPos + 64,
    lengthPos + 64 + length
  );

  try {
    const bytes = new Uint8Array(
      (data.match(/.{1,2}/g) || []).map((b) => parseInt(b, 16))
    );
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

async function readPlayerMetadata(tokenId: bigint) {
  try {
    const response = await fetch(
      `/api/nft-metadata/${tokenId.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return {
        images: [],
        name: `HOOD PLAYER #${tokenId}`,
      };
    }

    const data = await response.json();

    return {
      images: Array.isArray(data.images) ? data.images : [],
      name: data.name || `HOOD PLAYER #${tokenId}`,
    };
  } catch {
    return {
      images: [],
      name: `HOOD PLAYER #${tokenId}`,
    };
  }
}

async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 350
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Request failed");
}

async function discoverOwnedTokenIds(owner: string) {
  const all: { id: bigint; images: string[]; name: string }[] = [];
  let nextToken: string | null = null;

  for (let page = 0; page < 20; page++) {
    const params = new URLSearchParams({ holder_address_hash: owner });
    if (nextToken) params.set("unique_token", nextToken);

    const url =
      `https://robinhoodchain.blockscout.com/api/v2/tokens/${CONTRACT_ADDRESS}/instances?` +
      params.toString();

    const response = await fetch(url, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });

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
        name: item?.metadata?.name || `HOOD PLAYER #${id}`,
      });
    }

    const next = json?.next_page_params?.unique_token;
    if (!next || items.length === 0) break;
    nextToken = String(next);
  }

  const seen = new Set<string>();
  return all
    .filter((player) => {
      const key = player.id.toString();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((x, y) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0));
}

export default function VaultPage() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState<bigint | null>(null);
  const [players, setPlayers] = useState<{ id: bigint; images: string[]; name: string }[]>([]);
  const [selectedId, setSelectedId] = useState<bigint | null>(null);
  const [busy, setBusy] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const hasPlayers = useMemo(() => balance !== null && balance > 0n, [balance]);

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
          typeof switchError === "object" &&
          switchError &&
          "code" in switchError
            ? (switchError as { code?: number }).code
            : undefined;

        if (code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: CHAIN_ID,
                chainName: "Robinhood Chain",
                nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: [RPC_URL],
                blockExplorerUrls: [EXPLORER],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }

      const accounts = (await window.ethereum.request({
        method: "eth_accounts",
      })) as string[];

      const next = accounts?.[0] || "";
      setAccount(next);

      if (next) {
        const nextBalance = await readBalance(next);
        setBalance(nextBalance);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet connection failed.");
    } finally {
      setBusy(false);
    }
  }

  async function scanPlayers() {
    if (!account || !balance || balance <= 0n) return;

    setScanning(true);
    setError("");
    setPlayers([]);
    setSelectedId(null);

    try {
      const found = await discoverOwnedTokenIds(account);

      // Show all IDs immediately.
      setPlayers(found);
      if (found.length) setSelectedId(found[0].id);

      // The ownership scan is finished here. Metadata must never keep the
      // main loading state spinning.
      setScanning(false);

      const missing = found.filter((player) => player.images.length === 0);
      const batchSize = 6;

      for (let i = 0; i < missing.length; i += batchSize) {
        const batch = missing.slice(i, i + batchSize);

        const results = await Promise.all(
          batch.map(async (player) => {
            try {
              const metadata = await withRetry(
                () => readPlayerMetadata(player.id),
                2,
                300
              );

              return { id: player.id, metadata };
            } catch {
              return {
                id: player.id,
                metadata: { images: [], name: player.name },
              };
            }
          })
        );

        setPlayers((current) =>
          current.map((item) => {
            const result = results.find((entry) => entry.id === item.id);
            return result && result.metadata.images.length
              ? { ...item, ...result.metadata }
              : item;
          })
        );
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not load your Players from Robinhood Chain."
      );
      setScanning(false);
    }
  }

  async function refresh() {
    if (!account) return;

    setBusy(true);
    setError("");

    try {
      const nextBalance = await readBalance(account);
      setBalance(nextBalance);
      setPlayers([]);
      setSelectedId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read your NFT balance.");
    } finally {
      setBusy(false);
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

      if (next) {
        readBalance(next).then(setBalance).catch(() => setBalance(0n));
      }
    };

    window.ethereum.on("accountsChanged", accountsChanged);
    return () => window.ethereum?.removeListener?.("accountsChanged", accountsChanged);
  }, []);

  async function copyAddress() {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  const selectedNumber = selectedId === null ? null : selectedId.toString();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8D43A] text-black">
      <Navbar />

      <section className="border-b-4 border-black bg-[#F7F1E6]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_.85fr]">
            <div>
              <ComicBadge color="pink">PLAYER VAULT · V3</ComicBadge>
              <h1 className="mt-5 text-6xl font-black uppercase leading-[.84] sm:text-7xl lg:text-8xl">
                PICK
                <br />
                <span className="text-pink-500">YOUR PLAYER.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm font-bold leading-6 text-gray-700 sm:text-base">
                Connect your wallet, verify your HOOD PLAYERS and select the
                Player you want to use for future activation and vault features.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <ComicButton variant="pink" onClick={connect} disabled={busy}>
                  <WalletCards className="mr-2 inline-block" size={18} />
                  {busy ? "Checking..." : account ? "Wallet Connected" : "Connect Wallet"}
                </ComicButton>

                {account && (
                  <ComicButton variant="blue" onClick={refresh} disabled={busy}>
                    <RefreshCw className="mr-2 inline-block" size={17} />
                    Refresh
                  </ComicButton>
                )}
              </div>

              {account && (
                <div className="mt-4 inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-black shadow-[3px_3px_0_#111]">
                  {shorten(account)}
                  <button onClick={() => navigator.clipboard.writeText(account)} aria-label="Copy wallet">
                    <Copy size={14} />
                  </button>
                </div>
              )}

              {error && (
                <p className="mt-4 max-w-2xl text-sm font-black text-red-600">{error}</p>
              )}
            </div>

            <ComicCard className="rotate-1 bg-white p-4 sm:p-6">
              <ComicBadge color="yellow">SELECTED PLAYER</ComicBadge>

              <div className="mt-4 border-4 border-black bg-[#38BDF8] p-3">
                <img
                  src="/ascci-hero-v2.gif"
                  alt="HOOD PLAYER"
                      className="mx-auto w-full max-w-[480px]"
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Stat label="OWNED" value={balance === null ? "--" : balance.toString()} />
                <Stat label="PLAYER" value={selectedNumber ?? "--"} />
                <Stat label="VAULT" value="SOON" />
              </div>
            </ComicCard>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <ComicBadge color="blue">YOUR HOOD PLAYERS</ComicBadge>
              <h2 className="mt-4 text-5xl font-black uppercase leading-[.88] sm:text-6xl">
                SELECT A
                <br />
                <span className="text-pink-500">PLAYER ID.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-bold text-gray-700">
                The list below is discovered directly from the NFT contract.
                Nothing is activated by this screen yet.
              </p>
            </div>

            <ComicButton
              variant="yellow"
              onClick={scanPlayers}
              disabled={!account || !hasPlayers || scanning}
            >
              <RefreshCw className="mr-2 inline-block" size={17} />
              {scanning ? "Scanning..." : "Find My Players"}
            </ComicButton>
          </div>

          {!account && (
            <div className="mt-10 border-4 border-black bg-[#F8D43A] p-6 shadow-[6px_6px_0_#111]">
              <p className="font-black uppercase">
                Connect your wallet to see your Players.
              </p>
            </div>
          )}

          {account && hasPlayers && players.length === 0 && !scanning && (
            <div className="mt-10 border-4 border-black bg-[#F7F1E6] p-6 shadow-[6px_6px_0_#111]">
              <p className="font-black uppercase">
                {balance?.toString()} HOOD PLAYERS found.
              </p>
              <p className="mt-2 text-sm font-bold text-gray-600">
                Click “Find My Players” to discover their token IDs.
              </p>
            </div>
          )}

          {scanning && (
            <div className="mt-10 flex items-center gap-3 border-4 border-black bg-[#38BDF8] p-6 font-black uppercase shadow-[6px_6px_0_#111]">
              <RefreshCw className="animate-spin" size={20} />
              Reading token ownership from Robinhood Chain...
            </div>
          )}

          {players.slice(0, 12).flatMap((player) => player.images).map((src) => (
            <imgPreloader key={src} src={src} />
          ))}

          {players.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {players.map((player, index) => {
                const active = selectedId === player.id;
                return (
                  <button
                    key={player.id.toString()}
                    onClick={() => setSelectedId(player.id)}
                    className={`group border-4 border-black p-3 text-left transition-transform ${
                      active
                        ? "bg-pink-500 text-white shadow-[6px_6px_0_#111] -translate-y-1"
                        : "bg-[#F8D43A] shadow-[4px_4px_0_#111] hover:-translate-y-1"
                    } ${index % 2 ? "rotate-1" : "-rotate-1"}`}
                  >
                    <div className="flex aspect-square items-center justify-center overflow-hidden border-4 border-black bg-[#38BDF8]">
                      <PlayerImage
                        sources={player.images}
                        alt={player.name}
                      />
                    </div>
                    <div className="mt-3 text-xs font-black uppercase opacity-70">
                      HOOD PLAYER
                    </div>
                    <div className="text-3xl font-black">#{player.id.toString()}</div>
                    {active && (
                      <div className="mt-2 flex items-center gap-1 text-xs font-black uppercase">
                        <Check size={13} /> Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="border-b-4 border-black bg-[#38BDF8]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <ComicBadge color="yellow">PLAYER STATE</ComicBadge>
              <h2 className="mt-5 text-5xl font-black uppercase leading-[.86] sm:text-6xl">
                PLAYER
                <br />
                <span className="text-pink-500">#{selectedNumber ?? "----"}</span>
              </h2>
              <p className="mt-5 max-w-md text-sm font-bold leading-6">
                This is the Player selected for the next contract milestone.
                Activation, tier and vault data will be added after the
                smart-contract layer is ready.
              </p>
            </div>

            <div className="border-4 border-black bg-white p-5 shadow-[7px_7px_0_#111] sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <State label="OWNER" value={account ? shorten(account) : "NOT CONNECTED"} />
                <State label="TOKEN ID" value={selectedNumber ?? "NOT SELECTED"} />
                <State label="STATUS" value="INACTIVE" />
                <State label="TIER" value="1 · FUTURE" />
                <State label="VAULT" value="NOT CREATED" />
                <State label="REWARDS" value="COMING LATER" />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <ComicButton variant="pink" disabled>
                  Activate Player <LockKeyhole className="ml-2 inline-block" size={16} />
                </ComicButton>
                <Link href="/future">
                  <ComicButton variant="yellow">
                    See The Plan <ArrowRight className="ml-2 inline-block" size={16} />
                  </ComicButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-[#F7F1E6]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-5 md:grid-cols-3">
            <Info number="01" title="VERIFY" text="Wallet ownership is read from the NFT contract." />
            <Info number="02" title="SELECT" text="Choose the exact Player ID you want to work with." />
            <Info number="03" title="ACTIVATE NEXT" text="The activation transaction comes after this read-only milestone." />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 border-4 border-black bg-white p-5 shadow-[5px_5px_0_#111]">
            <span className="text-xs font-black uppercase text-gray-500">Contract</span>
            <span className="break-all text-xs font-black">{CONTRACT_ADDRESS}</span>
            <button onClick={copyAddress} className="border-2 border-black bg-[#F8D43A] px-3 py-1 text-xs font-black uppercase">
              {copied ? "Copied" : "Copy"}
            </button>
            <a
              href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-2 text-xs font-black uppercase underline"
            >
              Explorer <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="mx-auto max-w-5xl px-5 py-14 text-center sm:px-6 sm:py-20">
          <LockKeyhole className="mx-auto" size={34} />
          <h2 className="mt-5 text-5xl font-black uppercase leading-[.86] sm:text-7xl">
            THE VAULT
            <br />
            <span className="text-pink-500">COMES NEXT.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-bold leading-6 text-white/70">
            This page currently performs read-only ownership checks. No funds
            are moved and no activation transaction is sent.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PlayerImage({
  sources,
  alt,
}: {
  sources: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setIndex(0);
    setRetry(0);
  }, [sources.join("|")]);

  useEffect(() => {
    if (!sources.length || index >= sources.length) return;

    const timer = window.setTimeout(() => {
      setRetry((value) => (value < 2 ? value + 1 : value));
    }, 9000);

    return () => window.clearTimeout(timer);
  }, [index, sources]);

  if (!sources.length || index >= sources.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <imgIcon size={32} />
      </div>
    );
  }

  const separator = sources[index].includes("?") ? "&" : "?";
  const src = `${sources[index]}${separator}hp_retry=${retry}`;

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
      decoding="async"
      onError={() => {
        if (index < sources.length - 1) {
          setIndex((current) => current + 1);
        } else if (retry < 2) {
          setRetry((value) => value + 1);
        }
      }}
    />
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-4 border-black bg-[#F8D43A] p-3 text-center">
      <div className="text-[9px] font-black uppercase">{label}</div>
      <div className="mt-1 truncate text-xl font-black uppercase">{value}</div>
    </div>
  );
}

function State({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-3 border-black bg-[#F7F1E6] p-4">
      <div className="text-[9px] font-black uppercase text-gray-500">{label}</div>
      <div className="mt-1 break-all text-sm font-black uppercase">{value}</div>
    </div>
  );
}

function Info({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <ComicCard className="bg-white p-6">
      <div className="text-5xl font-black text-pink-500">{number}</div>
      <h3 className="mt-4 text-2xl font-black uppercase">{title}</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-gray-700">{text}</p>
    </ComicCard>
  );
}
