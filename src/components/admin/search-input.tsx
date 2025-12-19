"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export function SearchInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (term: string) => {
    // Clear existing timeout
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }

    // Set new timeout (Debounce 300ms)
    timeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        if (term) {
          params.set("q", term);
        } else {
          params.delete("q");
        }
        replace(`?${params.toString()}`);
    }, 300);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
      <input
        type="text"
        placeholder={placeholder}
        className="pl-9 h-10 w-full md:w-[300px] rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
        onChange={(e) => {
            handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("q")?.toString()}
      />
    </div>
  );
}
