
const items = [
  [1, "/ascci-punk-01-v2.gif"],
  [2, "/ascci-punk-02-v2.gif"],
  [3, "/ascci-punk-03-v2.gif"],
  [4, "/ascci-punk-04-v2.gif"],
  [5, "/ascci-punk-05-v2.gif"],
  [6, "/ascci-punk-06-v2.gif"],
];

export default function Collection() {
  return (
    <section id="collection" className="border-t border-white/20">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="text-center">
          <p className="pixel text-[9px] text-fuchsia-200">THE COLLECTION</p>
          <h2 className="mt-6 text-xl leading-8 sm:text-3xl sm:leading-[1.8]">
            INK PUNKS
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {items.map(([id, image]) => (
            <div
              key={id}
              className="pixel-border overflow-hidden bg-purple-950/50 p-2 transition-transform hover:-translate-y-1 sm:p-3"
            >
              <div className="overflow-hidden border border-white/40 bg-fuchsia-300">
               <img
  src={String(image)}
  alt={`ASCCI INK Punk #${id}`}
  className="aspect-square w-full object-cover"
/>
              </div>
              <p className="pixel mt-4 px-1 pb-1 text-[7px] sm:text-[9px]">
                INK PUNK #{String(id).padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
