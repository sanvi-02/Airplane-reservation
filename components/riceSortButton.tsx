"use client";

import { useState } from "react";
import { Flight } from "@/app/search/page";

type SortOrder = "asc" | "desc" | null;

type Props = {
  flights: Flight[];
  onSorted: (sorted: Flight[]) => void;
};

export default function PriceSortButton({ flights, onSorted }: Props) {
  const [order, setOrder] = useState<SortOrder>(null);

  const handleSort = () => {
    // cycle: null → asc → desc → asc → desc ...
    const next: SortOrder = order === "asc" ? "desc" : "asc";
    setOrder(next);

    const sorted = [...flights].sort((a, b) =>
      next === "asc" ? a.price - b.price : b.price - a.price
    );
    onSorted(sorted);
  };

  return (
    <button
      onClick={handleSort}
      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
      <span>Price</span>
      <span className="flex flex-col leading-none text-slate-400">
        <span className={order === "asc" ? "text-blue-400" : ""}>▲</span>
        <span className={order === "desc" ? "text-blue-400" : ""}>▼</span>
      </span>
      <span className="text-slate-400 text-xs">
        {order === "asc"
          ? "Low → High"
          : order === "desc"
          ? "High → Low"
          : "Sort"}
      </span>
    </button>
  );
}
