"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function UserNav() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, []);

  if (loading) {
     return (
        <div className="flex items-center gap-3">
             <Skeleton className="h-8 w-8 rounded-full bg-slate-800" />
             <Skeleton className="hidden md:block h-8 w-20 rounded-full bg-slate-800" />
        </div>
     )
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5">
          <User className="mr-2 h-4 w-4" />
          로그인
        </Button>
      </Link>
    );
  }

  return (
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
  );
}
