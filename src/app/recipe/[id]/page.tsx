import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { Clock, Eye, User, Zap, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { ViewCounter } from "@/components/view-counter";
import { RecipeActions } from "@/components/recipe-actions";
import CommentsSection from "@/components/comments-section";

// [긴급 수정] 500 에러 방지를 위해 캐싱 끄기
export const revalidate = 0; 

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*, profiles(username, avatar_url)")
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
            {recipe.image_url && (
                <Image
                    src={recipe.image_url}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 1024px"
                />
            )}
        </div>
      </div>

      {/* 3. 본문 레이아웃 (단일 컬럼 집중형) */}
      <div className="max-w-3xl mx-auto px-4 pb-24">
        
        {/* 설명 섹션 (줄바꿈 적용) */}
        <section className="mb-16">
            <p className="text-xl text-slate-300 leading-relaxed italic border-l-4 border-indigo-500 pl-6 py-2 bg-indigo-500/5 whitespace-pre-wrap">
                "{recipe.description}"
            </p>
        </section>

        {/* 재료/도구 섹션 */}
        <section className="mb-20">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-1 bg-indigo-500 rounded-full" />
                준비물 및 프롬프트
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recipe.ingredients?.map((ing: string, i: number) => (
                    <div key={i} className="flex items-center p-4 rounded-xl bg-slate-900 border border-white/5 hover:border-indigo-500/30 transition-all group">
                        <ChevronRight className="w-4 h-4 text-indigo-500 mr-2 opacity-50 group-hover:translate-x-1 transition-transform" />
                        <span className="text-slate-300">{ing}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* 단계별 가이드 (수직형) */}
        <section className="mb-24">
            <h3 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                <span className="w-8 h-1 bg-indigo-500 rounded-full" />
                제작 가이드
            </h3>
            <div className="space-y-12">
                {recipe.steps?.map((step: string, i: number) => (
                    <div key={i} className="relative">
                        <div className="flex items-start gap-8">
                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-white font-black text-xl shadow-lg">
                                {i + 1}
                            </div>
                            <div className="flex-1 pt-1">
                                {/* 스텝 내용 줄바꿈 적용 */}
                                <div className="text-slate-200 text-lg leading-loose bg-white/[0.02] p-8 rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all whitespace-pre-wrap">
                                    {step}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 액션 (좋아요/저장) 및 댓글 */}
        <div className="mt-32 space-y-20">
            <div className="flex justify-center">
                <Suspense fallback={<div className="h-16 w-64 bg-slate-900 rounded-full animate-pulse" />}>
                    <RecipeActions 
                        recipeId={id} 
                        initialLikeCount={recipe.likes?.[0]?.count || 0}
                        authorId={recipe.user_id}
                    />
                </Suspense>
            </div>
            
            <div className="pt-16 border-t border-white/5">
                <Suspense fallback={<div className="h-40 w-full bg-slate-800 animate-pulse rounded-2xl" />}>
                    <CommentsSection recipeId={id} />
                </Suspense>
            </div>
        </div>

      </div>
    </div>
  );
}
