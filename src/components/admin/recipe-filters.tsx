"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function CategoryFilter({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("category", e.target.value);
    } else {
      params.delete("category");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={currentCategory}
      onChange={handleCategoryChange}
      className="h-9 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300 px-3 outline-none focus:ring-1 focus:ring-indigo-500"
    >
      <option value="">모든 카테고리</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={handleSortChange}
      className="h-9 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300 px-3 outline-none focus:ring-1 focus:ring-indigo-500"
    >
      <option value="newest">최신순</option>
      <option value="oldest">오래된순</option>
      <option value="views">조회수순</option>
      <option value="popular">인기순 (좋아요)</option>
    </select>
  );
}
