"use client";

const items = [
  "0.0002 ETH MINT",
  "2600 NFTs",
  "PIXEL ART",
  "GENESIS COLLECTION",
  "COMMUNITY FIRST",
  "HOOD PLAYERS",
];

export default function Marquee() {
  return (
    <section className="overflow-hidden border-y-4 border-black bg-pink-500">

      <div className="animate-[marquee_18s_linear_infinite] whitespace-nowrap py-4">

        {[...items, ...items].map((item, i) => (

          <span
            key={i}
            className="mx-8 text-2xl font-black uppercase text-white"
          >
            ★ {item}
          </span>

        ))}

      </div>

    </section>
  );
}