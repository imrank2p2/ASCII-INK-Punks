"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 500);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center border-4 border-black bg-pink-500 text-2xl font-black text-white shadow-[6px_6px_0_#000] transition hover:-translate-y-1"
    >
      ↑
    </button>
  );
}