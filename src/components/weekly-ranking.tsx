"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Crown, Trophy, TrendingUp, Star, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface RankingItem {
    recipe_id: string;
    title: string;
    image_url: string | null;
    username: string;
    avatar_url: string | null;
    score: number;
    weekly_likes: number;
    weekly_votes: number;
}

export function WeeklyRanking() {
    const [rankings, setRankings] = useState<RankingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            const supabase = createClient();
            // Try fetching from the view. If view doesn't exist, this might fail gracefully or return empty.
            const { data, error } = await supabase
                .from('weekly_rankings_view')
                .select('*')
                .limit(3);
            
            if (!error && data) {
                setRankings(data);
            } else {
                console.log("Ranking fetch fallback/error", error);
            }
            setLoading(false);
        };

        fetchRankings();
    }, []);

    if (loading) return null; // Or a skeleton

    if (rankings.length === 0) {
        // Fallback UI when no data (Start of week)
        return (
            <div className="w-full bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-3xl border border-white/10 p-8 text-center">
                 <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4 opacity-50" />
                 <h3 className="text-2xl font-bold text-slate-200">이번 주 랭킹이 시작되었습니다!</h3>
                 <p className="text-slate-400 mt-2">첫 번째 주인공이 되어보세요.</p>
            </div>
        );
    }

    const [first, second, third] = rankings;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* 2nd Place */}
            {second && (
                <Link href={`/recipe/${second.recipe_id}`} className="group relative order-2 md:order-1">
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex flex-col items-center hover:border-slate-500/50 transition-all">
                        <Badge className="absolute -top-3 bg-slate-400 text-slate-900 font-bold border-0 px-3">2nd</Badge>
                        <div className="relative w-20 h-20 rounded-full border-2 border-slate-400 overflow-hidden mb-3">
                             {second.image_url ? (
                                <Image src={second.image_url} alt={second.title} fill className="object-cover" />
                             ) : <div className="w-full h-full bg-slate-800" />}
                        </div>
                        <h4 className="font-semibold text-slate-200 text-center line-clamp-1 text-sm">{second.title}</h4>
                        <div className="flex items-center gap-1 mt-2 text-xs text-yellow-500 font-mono">
                            <Star className="h-3 w-3 fill-yellow-500" /> {second.score} pts
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                             <Avatar className="h-4 w-4">
                                <AvatarImage src={second.username ? (second.avatar_url || "/anonymous-chef.png") : "/anonymous-chef.png"} />
                                <AvatarFallback>U</AvatarFallback>
                             </Avatar>
                             {second.username || "익명 쉐프"}
                        </div>
                    </div>
                </Link>
            )}

            {/* 1st Place */}
            <Link href={`/recipe/${first.recipe_id}`} className="group relative order-1 md:order-2 -mt-10 md:-mt-0">
                <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900/40 border border-yellow-500/30 rounded-2xl p-6 flex flex-col items-center shadow-[0_0_30px_rgba(234,179,8,0.1)] hover:shadow-[0_0_50px_rgba(234,179,8,0.2)] transition-all">
                    <div className="absolute -top-6">
                        <Crown className="h-8 w-8 text-yellow-500 animate-bounce" />
                    </div>
                    <Badge className="absolute -top-3 bg-yellow-500 text-yellow-950 font-bold border-0 px-4 py-0.5 text-base">1st</Badge>
                    
                    <div className="relative w-32 h-32 rounded-full border-4 border-yellow-500 overflow-hidden mb-4 shadow-xl">
                            {first.image_url ? (
                            <Image src={first.image_url} alt={first.title} fill className="object-cover" />
                            ) : <div className="w-full h-full bg-slate-800" />}
                    </div>
                    
                    <h3 className="font-bold text-white text-center line-clamp-2 text-lg mb-1">{first.title}</h3>
                    
                    <div className="flex items-center gap-2 mt-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-yellow-400 font-mono font-bold">{first.score} pts</span>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-sm text-slate-400 bg-black/20 px-3 py-1.5 rounded-full">
                            <Avatar className="h-5 w-5">
                            <AvatarImage src={first.username ? (first.avatar_url || "/anonymous-chef.png") : "/anonymous-chef.png"} />
                            <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            {first.username || "익명 쉐프"}
                    </div>
                </div>
            </Link>

            {/* 3rd Place */}
            {third && (
                <Link href={`/recipe/${third.recipe_id}`} className="group relative order-3">
                     <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex flex-col items-center hover:border-amber-700/50 transition-all">
                        <Badge className="absolute -top-3 bg-amber-700 text-amber-100 font-bold border-0 px-3">3rd</Badge>
                        <div className="relative w-20 h-20 rounded-full border-2 border-amber-700 overflow-hidden mb-3">
                             {third.image_url ? (
                                <Image src={third.image_url} alt={third.title} fill className="object-cover" />
                             ) : <div className="w-full h-full bg-slate-800" />}
                        </div>
                        <h4 className="font-semibold text-slate-200 text-center line-clamp-1 text-sm">{third.title}</h4>
                        <div className="flex items-center gap-1 mt-2 text-xs text-yellow-500 font-mono">
                            <Star className="h-3 w-3 fill-yellow-500" /> {third.score} pts
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                             <Avatar className="h-4 w-4">
                                <AvatarImage src={third.username ? (third.avatar_url || "/anonymous-chef.png") : "/anonymous-chef.png"} />
                                <AvatarFallback>U</AvatarFallback>
                             </Avatar>
                             {third.username || "익명 쉐프"}
                        </div>
                    </div>
                </Link>
            )}
        </div>
    );
}
