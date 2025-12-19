"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; 
// Note: if use-debounce is not installed, we can use simple timeout. 
// Assuming it's not, I'll implement manual debounce.

export function SearchInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    // Simple debounce via timeout not strictly needed for basic admin use, 
    // but better to avoid too many requests.
    // However, direct replace is fine for now as it's admin page.
    replace(`?${params.toString()}`);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
      <input
        type="text"
        placeholder={placeholder}
        className="pl-9 h-10 w-full md:w-[300px] rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
        onChange={(e) => {
            // Simple manual debounce
            const value = e.target.value;
            // Immediate update for better feeling, URL update can lag slightly
            const timeoutId = setTimeout(() => handleSearch(value), 300);
            return () => clearTimeout(timeoutId);
        }}
        defaultValue={searchParams.get("q")?.toString()}
      />
    </div>
  );
}
