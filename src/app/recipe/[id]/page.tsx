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
    <div className="bg-[#020617] min-h-screen">
      <ViewCounter recipeId={id} />

      {/* 1. 집중된 헤더 영역 */}
      <div className="max-w-screen-xl mx-auto px-4 pt-12 pb-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold ring-1 ring-inset ring-indigo-500/20">
                <Zap className="w-3 h-3" />
                <span>{recipe.category || "AI WORKFLOW"}</span>
            </div>

            {/* 제목 크기 (2xl/4xl 유지) */}
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-normal sm:leading-tight">
                {recipe.title}
            </h1>

            <div className="flex items-center justify-center gap-6 py-4 border-y border-white/5">
                <div className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden">
                        {author.avatar_url ? (
                            <Image src={author.avatar_url} alt={author.username || "User"} width={40} height={40} />
                        ) : (author.username?.[0] || "?")}
                    </div>
                    <span className="text-slate-300 text-sm font-semibold">{author.username}</span>
                </div>
                <div className="h-4 w-px bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Eye className="w-4 h-4" />
                    <span>{recipe.view_count?.toLocaleString() || 0}</span>
                </div>
            </div>
        </div>
      </div>

      {/* 2. 대형 히어로 이미지 (최적화) */}
      <div className="max-w-screen-lg mx-auto px-4 mb-16">
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)] border border-white/10">
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
                        sizes="(max-width: 1024px) 100vw, 1024px"
                    />
                )
            )}
        </div>
      </div>

      {/* 3. 본문 레이아웃 (2컬럼: 메인 + 사이드바) */}
      <div className="max-w-screen-xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* 메인 컬럼 (좌측) */}
            <div className="lg:col-span-2 space-y-16">
                {/* 설명 섹션 */}
                <section>
                    <p className="text-xl text-slate-300 leading-relaxed italic border-l-4 border-indigo-500 pl-6 py-2 bg-indigo-500/5 whitespace-pre-wrap">
                        "{recipe.description}"
                    </p>
                </section>

                {/* 단계별 가이드 */}
                <section>
                    <h3 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                        <span className="w-8 h-1 bg-indigo-500 rounded-full" />
                        제작 가이드 및 프롬프트
                    </h3>
                    <div className="space-y-12">
                        {(Array.isArray(recipe.instructions) ? recipe.instructions : []).map((step: string, i: number) => (
                            <div key={i} className="relative">
                                <div className="flex items-start gap-8">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-white font-black text-xl shadow-lg">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <VariablePromptRenderer text={step} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 댓글 섹션 (메인 컬럼 하단으로 이동) */}
                <div className="pt-16 border-t border-white/5">
                    <Suspense fallback={<div className="h-40 w-full bg-slate-800 animate-pulse rounded-2xl" />}>
                        <CommentsSection recipeId={id} />
                    </Suspense>
                </div>
            </div>

            {/* 사이드바 (우측) */}
            <div className="space-y-10">
                {/* 액션 카드 (상단 배치) */}
                <div className="sticky top-24 z-10 space-y-6">
                    <Suspense fallback={<div className="h-48 w-full bg-amber-500/10 rounded-3xl animate-pulse" />}>
                        <VoteCard recipeId={id} />
                    </Suspense>

                    <Suspense fallback={<div className="h-64 w-full bg-slate-900 rounded-3xl animate-pulse" />}>
                        <RecipeActions
                            recipeId={id}
                            initialLikeCount={recipe.likes?.[0]?.count || 0}
                            authorId={recipe.user_id}
                        />
                    </Suspense>
                </div>

                {/* 재료/도구 섹션 */}
                <section className="bg-slate-900/50 rounded-3xl p-6 border border-white/5">
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
                </section>

                {/* 작성자 프로필 (간단) */}
                <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white overflow-hidden shrink-0">
                        {author.avatar_url ? (
                            <Image src={author.avatar_url} alt={author.username || "User"} width={48} height={48} />
                        ) : (author.username?.[0] || "?")}
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Created by</p>
                        <p className="text-white font-bold">{author.username}</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
