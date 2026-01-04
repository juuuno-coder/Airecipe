import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { Clock, Eye, User, Zap, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { ViewCounter } from "@/components/view-counter";
import { RecipeActions } from "@/components/recipe-actions";
import { VoteCard } from "@/components/vote-card";
import CommentsSection from "@/components/comments-section";
import { VariablePromptRenderer } from "@/components/prompt-variable-renderer";
import { ImageComparison } from "@/components/image-comparison";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*, profiles(username, avatar_url), likes(count)")
    .eq("id", id)
    .single();

  if (error || !recipe) {
    return <div className="p-20 text-center text-slate-400">레시피를 찾을 수 없습니다.</div>;
  }

  // [안전 장치] 프로필이 없거나 날짜가 이상해도 터지지 않게 기본값 처리
  const author = recipe.profiles || { username: "익명 쉐프", avatar_url: null };
  const formattedDate = recipe.created_at ? new Date(recipe.created_at).toLocaleDateString() : "Unknown Date";

  return (
    <div className="bg-[#020617] min-h-screen text-slate-200">
      <ViewCounter recipeId={id} />

      {/* 1. New Header Layout (Matching Skeleton) */}
      <div className="relative w-full py-12 md:py-20 overflow-hidden border-b border-white/5 bg-[#0a0a0a]">
        {/* Background Gradient Effect (Optional to make it nicer) */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="container max-w-[1400px] px-4 relative z-10 mx-auto">
            {/* Category Badge */}
            <div className="mb-8">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold ring-1 ring-inset ring-indigo-500/20">
                    <Zap className="w-3 h-3" />
                    <span>{recipe.category || "AI WORKFLOW"}</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-end">
                {/* Image Section (Matches Skeleton w-full md:w-[320px]) */}
                <div className="w-full md:w-[320px] shrink-0">
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800">
                         {recipe.before_image_url && recipe.after_image_url ? (
                            <ImageComparison
                            beforeImage={recipe.before_image_url}
                            afterImage={recipe.after_image_url}
                            className="h-full w-full object-cover"
                            />
                        ) : (
                            recipe.image_url && (
                                <Image
                                    src={recipe.image_url}
                                    alt={recipe.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 320px"
                                />
                            )
                        )}
                    </div>
                </div>

                {/* Text Info Section */}
                <div className="flex-1 space-y-6 w-full">
                     <div className="space-y-4">
                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            {recipe.title}
                        </h1>

                         {/* Meta Info Row */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                             <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{recipe.view_count?.toLocaleString() || 0} views</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{author.username}</span>
                            </div>
                        </div>
                     </div>

                     {/* Author Profile (Mini) */}
                     <div className="flex items-center gap-4 pt-2 border-t border-white/5 mt-6">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden shrink-0">
                            {author.avatar_url ? (
                                <Image src={author.avatar_url} alt={author.username || "User"} width={40} height={40} />
                            ) : (author.username?.[0] || "?")}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Created by</p>
                            <p className="text-white font-bold">{author.username}</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. Content Layout (Matching Skeleton 8:4 Grid) */}
      <div className="container max-w-[1400px] px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Main Content (Left, col-span-8) */}
            <div className="lg:col-span-8 space-y-16">
                 {/* Description */}
                 <section className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-indigo-500 rounded-full" />
                        소개
                    </h3>
                    <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {recipe.description}
                    </p>
                 </section>

                 {/* Instructions */}
                 <section className="space-y-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-indigo-500 rounded-full" />
                        제작 가이드
                    </h3>
                    <div className="space-y-12">
                        {(Array.isArray(recipe.instructions) ? recipe.instructions : []).map((step: string, i: number) => (
                            <div key={i} className="relative pl-4 border-l border-white/10 pb-8 last:pb-0 last:border-0">
                                <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-400 font-bold text-lg shadow-lg">
                                    {i + 1}
                                </div>
                                <div className="pt-2 pl-4">
                                    <VariablePromptRenderer text={step} />
                                </div>
                            </div>
                        ))}
                    </div>
                 </section>

                 {/* Comments */}
                 <div className="pt-16 border-t border-white/5">
                    <Suspense fallback={<div className="h-40 w-full bg-slate-800 animate-pulse rounded-2xl" />}>
                        <CommentsSection recipeId={id} />
                    </Suspense>
                 </div>
            </div>

            {/* Sidebar (Right, col-span-4) */}
            <div className="lg:col-span-4 space-y-8">
                 {/* Vote Card */}
                 <Suspense fallback={<div className="h-48 w-full bg-amber-500/10 rounded-3xl animate-pulse" />}>
                    <VoteCard recipeId={id} />
                 </Suspense>

                 {/* Recipe Actions */}
                 <Suspense fallback={<div className="h-64 w-full bg-slate-900 rounded-3xl animate-pulse" />}>
                    <RecipeActions
                        recipeId={id}
                        initialLikeCount={recipe.likes?.[0]?.count || 0}
                        authorId={recipe.user_id}
                    />
                 </Suspense>

                 {/* Ingredients / Tools */}
                 <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-500" />
                        준비물 및 프롬프트
                    </h3>
                    <div className="space-y-3">
                        {(Array.isArray(recipe.ingredients) ? recipe.ingredients : []).map((ing: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-white/5 hover:border-indigo-500/30 transition-all group text-sm">
                                <div className="flex items-center">
                                    <ChevronRight className="w-3 h-3 text-indigo-500 mr-2 opacity-50 group-hover:translate-x-1 transition-transform" />
                                    <span className="text-slate-300 font-medium">{typeof ing === 'string' ? ing : ing.item}</span>
                                </div>
                                {ing.quantity && (
                                    <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">
                                        {ing.quantity}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
