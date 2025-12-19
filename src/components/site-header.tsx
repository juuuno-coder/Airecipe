"use client";

import Link from "next/link";
import { Terminal, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";
import { UserNav } from "@/components/user-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  
  // Hide header on admin pages
  if (pathname?.startsWith("/admin")) {
      return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="tracking-tight text-slate-100">AI.RECIPE</span>
          </Link>

          {/* Desktop Navbar */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              홈
            </Link>
            <Link href="/ranking" className="hover:text-white transition-colors">
              주간 랭킹
            </Link>
            <Link href="/hall-of-fame" className="hover:text-white transition-colors">
              명예의 전당
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Search Bar (Compact) */}
          <div className="hidden lg:flex relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="검색..."
              className="pl-9 h-9 bg-white/5 border-white/10 focus:bg-white/10 focus:border-indigo-500/50 transition-all text-xs text-slate-200 placeholder:text-slate-600 rounded-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Suspense fallback={
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full bg-slate-800" />
                    <Skeleton className="h-8 w-20 rounded-full bg-slate-800" />
                </div>
            }>
                <UserNav />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
