"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F8D43A]">

      <div className="text-center">

        <div className="inline-flex h-28 w-28 items-center justify-center rounded-full border-4 border-black bg-pink-500 text-5xl font-black text-white shadow-[10px_10px_0_#000] animate-bounce">

          $

        </div>

        <h2 className="mt-8 text-5xl font-black uppercase">
          HOOD PLAYERS
        </h2>

        <p className="mt-4 font-bold uppercase">
          Loading Collection...
        </p>

        <div className="mx-auto mt-8 h-4 w-72 overflow-hidden border-4 border-black bg-white">

          <div className="h-full w-full origin-left animate-[loading_1.8s_linear_forwards] bg-sky-400" />

        </div>

      </div>

    </div>
  );
}