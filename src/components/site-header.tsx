import Link from "next/link";
import { Terminal, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
            {/* Notification Feature Removed for Performance */}

            {user ? (
              // Logged In: Avatar | MyPage | Register
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 group" title="내 프로필">
                    <Avatar className="h-8 w-8 border border-white/10 transition-transform group-hover:scale-105 group-hover:border-indigo-500/50">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-indigo-500 text-[10px] text-white">
                        {(user.email?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                    </Avatar>
                </Link>

                <Link href="/profile" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:block">
                    마이페이지
                </Link>

                <Link href="/create">
                    <Button size="sm" className="h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg shadow-indigo-500/20 px-4">
                        레시피 등록
                    </Button>
                </Link>
              </div>
            ) : (
              // Logged Out: Show Login Button
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5">
                  <User className="mr-2 h-4 w-4" />
                  로그인
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
