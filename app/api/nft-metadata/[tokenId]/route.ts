import { NextRequest } from "next/server";

const CONTRACT =
  "0x5ae0cde11fb3f5072a0e8a2b802ecf9af0814dd8";

const RPC =
  "https://rpc.mainnet.chain.robinhood.com";

function decodeAbiString(hex: string) {
  const clean = hex.replace(/^0x/, "");
  if (clean.length < 128) return "";

  try {
    const offset =
      Number(BigInt(`0x${clean.slice(0, 64)}`)) * 2;
    const lengthPos = offset;
    const length =
      Number(
        BigInt(
          `0x${clean.slice(lengthPos, lengthPos + 64)}`
        )
      ) * 2;

    const data = clean.slice(
      lengthPos + 64,
      lengthPos + 64 + length
    );

    const bytes = new Uint8Array(
      (data.match(/.{1,2}/g) || []).map((b) =>
        parseInt(b, 16)
      )
    );

    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

function imageCandidates(value: string) {
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

function metadataCandidates(uri: string) {
  if (!uri) return [];

  if (uri.startsWith("ipfs://")) {
    const path = uri.slice(7);
    return [
      `https://ipfs.io/ipfs/${path}`,
      `https://nftstorage.link/ipfs/${path}`,
      `https://gateway.pinata.cloud/ipfs/${path}`,
    ];
  }

  if (uri.startsWith("ar://")) {
    const id = uri.slice(5);
    return [
      `https://arweave.net/${id}`,
      `https://ar-io.net/${id}`,
    ];
  }

  return [uri];
}

async function rpcCall(data: string) {
  const response = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [
        { to: CONTRACT, data },
        "latest",
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("RPC failed");

  const json = await response.json();

  if (json.error) {
    throw new Error(json.error.message || "RPC error");
  }

  return json.result as string;
}

async function getTokenUri(tokenId: string) {
  const hexId = BigInt(tokenId)
    .toString(16)
    .padStart(64, "0");

  return decodeAbiString(
    await rpcCall(`0xc87b56dd${hexId}`)
  );
}

async function getJson(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json,text/plain,*/*",
      "User-Agent": "HOOD-PLAYERS/1.0",
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const contentType =
    response.headers.get("content-type") || "";

  const text = await response.text();

  if (
    contentType.includes("application/json") ||
    text.trim().startsWith("{")
  ) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  return null;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await context.params;

    if (!/^\d+$/.test(tokenId)) {
      return Response.json(
        { error: "Invalid token ID" },
        { status: 400 }
      );
    }

    const uri = await getTokenUri(tokenId);

    if (!uri) {
      return Response.json({
        name: `HOOD PLAYER #${tokenId}`,
        images: [],
      });
    }

    if (
      uri.startsWith(
        "data:application/json;base64,"
      )
    ) {
      const metadata = JSON.parse(
        Buffer.from(
          uri.split(",")[1],
          "base64"
        ).toString("utf8")
      );

      return Response.json({
        name:
          metadata.name ||
          `HOOD PLAYER #${tokenId}`,
        images: imageCandidates(
          metadata.image ||
            metadata.image_url ||
            ""
        ),
      });
    }

    if (
      uri.startsWith(
        "data:application/json,"
      )
    ) {
      const metadata = JSON.parse(
        decodeURIComponent(uri.split(",")[1])
      );

      return Response.json({
        name:
          metadata.name ||
          `HOOD PLAYER #${tokenId}`,
        images: imageCandidates(
          metadata.image ||
            metadata.image_url ||
            ""
        ),
      });
    }

    for (const metadataUrl of metadataCandidates(uri)) {
      try {
        const metadata =
          await getJson(metadataUrl);

        if (!metadata) continue;

        const images = imageCandidates(
          metadata.image ||
            metadata.image_url ||
            ""
        );

        if (images.length) {
          return Response.json({
            name:
              metadata.name ||
              `HOOD PLAYER #${tokenId}`,
            images,
          });
        }
      } catch {
        // Try the next metadata gateway.
      }
    }

    return Response.json({
      name: `HOOD PLAYER #${tokenId}`,
      images: [],
    });
  } catch {
    return Response.json(
      {
        name: "HOOD PLAYER",
        images: [],
      },
      { status: 200 }
    );
  }
}
