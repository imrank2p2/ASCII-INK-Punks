import { NextRequest } from "next/server";

const ALLOWED_HOSTS = new Set([
  "ipfs.io",
  "nftstorage.link",
  "gateway.pinata.cloud",
  "arweave.net",
  "www.arweave.net",
  "ar-io.net",
]);

function isAllowedImageUrl(target: URL) {
  if (target.protocol !== "https:") return false;

  if (ALLOWED_HOSTS.has(target.hostname)) return true;

  // Also permit common IPFS gateway URLs if the path clearly identifies
  // IPFS content. The server never accepts arbitrary non-IPFS hosts.
  return target.pathname.includes("/ipfs/");
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");

  if (!raw) return new Response("Missing image URL", { status: 400 });

  let target: URL;

  try {
    target = new URL(raw);
  } catch {
    return new Response("Invalid image URL", { status: 400 });
  }

  if (!isAllowedImageUrl(target)) {
    return new Response("Image host not allowed", { status: 403 });
  }

  // Retry a transient gateway failure a couple of times.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(target.toString(), {
        headers: {
          Accept:
            "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "User-Agent": "HOOD-PLAYERS/1.0",
        },
        cache: "force-cache",
        next: { revalidate: 86400 },
      });

      if (response.ok && response.body) {
        const headers = new Headers();
        headers.set(
          "Content-Type",
          response.headers.get("content-type") || "image/*"
        );
        headers.set(
          "Cache-Control",
          "public, max-age=86400, stale-while-revalidate=604800"
        );

        return new Response(response.body, {
          status: 200,
          headers,
        });
      }

      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return new Response("Image unavailable", { status: response.status });
      }
    } catch {
      // Retry below.
    }

    await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }

  return new Response("Image fetch failed", { status: 502 });
}
