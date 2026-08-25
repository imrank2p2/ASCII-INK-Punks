export default function Footer() {
  return (
    <footer className="border-t border-white/20 bg-[#26043f]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="pixel text-[9px]">ASCCI INK PUNKS</p>
          <p className="mt-3 text-xl text-purple-200">Made on Ink.</p>
        </div>

        <div className="flex justify-center gap-5 text-[9px]">
          <a href="https://x.com/" target="_blank" rel="noreferrer">X / TWITTER</a>
          <a href="/apply">APPLY</a>
        </div>
      </div>
    </footer>
  );
}
