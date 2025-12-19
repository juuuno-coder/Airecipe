import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Share2, Info, Eye, Zap, CalendarDays, Bookmark, MessageCircle, Settings, Trash2, Terminal, Cpu, BookOpen, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import Next Image
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/copy-button";
import ReactMarkdown from 'react-markdown';
import { VariablePromptRenderer } from "@/components/prompt-variable-renderer";
import { ImageComparison } from "@/components/image-comparison";
import { revalidatePath } from "next/cache";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentsSection from "@/components/comments-section";
import { Suspense } from "react";
import { RecipeActions } from "@/components/recipe-actions"; // Import Actions
import { Skeleton } from "@/components/ui/skeleton";

import { ViewCounter } from "@/components/view-counter"; // Import ViewCounter

export const revalidate = 60; // Cache for 60 seconds

// Helper to determine model badge
const getModelBadge = (text: string) => {
  const lower = (text || "").toLowerCase();
  if (lower.includes("gpt")) return { label: "GPT-4 Optimization", color: "bg-green-500/10 text-green-500 border-green-500/20" };
  if (lower.includes("claude")) return { label: "Claude 3 Opus", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" };
  if (lower.includes("midjourney")) return { label: "Midjourney v6", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" };
  if (lower.includes("stable")) return { label: "Stable Diffusion", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
  return { label: "AI Workflow", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
};

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch ONLY Recipe (Fastest possible query, public data)
  const { data: recipeWithProfile, error: profileError } = await supabase
    .from("recipes")
    .select("*, profiles(*)")
    .eq("id", id)
    .single();

  let recipe: any = recipeWithProfile;

  if (!recipe) {
    const { data: rawRecipe, error } = await supabase.from("recipes").select("*").eq("id", id).single();
    if (!rawRecipe) {
        console.error("Recipe not found", error);
        notFound();
    }
    recipe = rawRecipe;
  }
  
  // No Auth check here! Auth is deferred to RecipeActions component.

  // Parse JSON fields
  let tools: any[] = [];
  let steps: string[] = [];

  try {
    tools = typeof recipe.ingredients === "string" ? JSON.parse(recipe.ingredients) : recipe.ingredients;
    steps = typeof recipe.instructions === "string" ? JSON.parse(recipe.instructions) : recipe.instructions;
    if (!Array.isArray(tools)) tools = [];
    if (!Array.isArray(steps)) steps = [];
  } catch (e) {
    console.error("JSON Parse Error", e);
  }

  const badgeInfo = getModelBadge(recipe.description + " " + JSON.stringify(tools));
  const isRichText = steps.length === 1 && (steps[0].trim().startsWith('<') || steps[0].length > 200);

  return (
    <div className="min-h-screen bg-[#020617] selection:bg-indigo-500/30 text-slate-200">
      
      {/* 1. Album Art Style Hero Section */}
      <div className="relative w-full py-12 md:py-20 overflow-hidden border-b border-white/5 bg-[#0a0a0a]">
        {/* Blurred Background */}
        <div className="absolute inset-0 z-0">
             {recipe.image_url && (
                <Image 
                    src={recipe.image_url} 
                    alt="" 
                    fill
                    className="object-cover opacity-20 blur-3xl scale-125 select-none pointer-events-none"
                    priority
                />
             )}
             <div className="absolute inset-0 bg-[#0a0a0a]/80" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>

        <div className="container max-w-[1400px] px-4 relative z-10">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> 목록으로 돌아가기
            </Link>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-end">
                {/* 1:1 Album Art Image */}
                <div className="w-full md:w-[320px] shrink-0">
                    <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group">
                        {recipe.image_url ? (
                             <Image 
                                src={recipe.image_url} 
                                alt={recipe.title} 
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority // Critical for LCP
                                sizes="(max-width: 768px) 100vw, 320px"
                             />
                        ) : (
                             <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                 <Terminal className="h-16 w-16 text-slate-700" />
                             </div>
                        )}
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
                
                {/* Text Content */}
                <div className="flex-1 space-y-6 w-full">
                     <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeInfo.color} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>
                                {badgeInfo.label}
                            </span>
                            {recipe.category && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-white/10">
                                    {recipe.category}
                                </span>
                            )}
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-black/20 px-2 py-1 rounded-md border border-white/5">
                                <Clock className="w-3 h-3" /> {recipe.cooking_time_minutes}분 소요
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                            {recipe.title}
                        </h1>
                        
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
                            {recipe.description}
                        </p>
                     </div>

                     <div className="flex items-center gap-4 pt-2">
                        {/* Author Profile */}
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                             <Avatar className="h-8 w-8 border border-white/10">
                                <AvatarImage src={recipe.is_anonymous ? undefined : recipe.profiles?.avatar_url} />
                                <AvatarFallback className={`text-xs text-white ${recipe.is_anonymous ? 'bg-slate-700' : 'bg-indigo-600'}`}>
                                    {recipe.is_anonymous ? "?" : (recipe.profiles?.email?.slice(0, 2).toUpperCase() || "U")}
                                </AvatarFallback>
                             </Avatar>
                             <div className="flex flex-col text-left">
                                 <span className="text-xs text-slate-400">Recipe by</span>
                                 <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                    {recipe.is_anonymous ? "Blind Chef" : (recipe.profiles?.username || "익명 쉐프")}
                                 </span>
                             </div>
                        </div>
                        
                        <div className="flex-1" />

                        {/* Share Button */}
                         <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container max-w-[1400px] px-4 py-16 mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content Area (Larger share: 8/12) */}
            <div className="lg:col-span-8 space-y-16">
                
                {/* 2. Intro & Summary */}
                <section className="space-y-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                         <span className="w-1 h-8 bg-indigo-500 rounded-full inline-block"></span>
                         레시피 요약
                    </h2>
                    <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors duration-1000"></div>
                        <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-light relative z-10">
                            &quot;{recipe.description}&quot;
                        </p>
                    </div>

                {/* Image Showcase (Comparison or Single) */}
                    {(recipe.before_image_url && recipe.after_image_url) ? (
                        <div className="mt-8">
                             <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                                <Eye className="w-5 h-5 text-indigo-400" />
                                결과물 비교
                             </h3>
                            <ImageComparison 
                                beforeImage={recipe.before_image_url}
                                afterImage={recipe.after_image_url}
                                className="w-full aspect-[1/1.6] shadow-2xl border border-indigo-500/20 rounded-2xl overflow-hidden"
                            />
                        </div>
                    ) : recipe.image_url && (
                        <div className="mt-8 rounded-2xl overflow-hidden border border-white/5 shadow-2xl aspect-[1/1.6] relative group">
                             {/* eslint-disable-next/next/no-img-element */}
                             <img src={recipe.image_url} alt="Result" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    )}
                </section>

                {/* 3. Tools & Prompts */}
                <section className="space-y-6">
                     <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
                        <Terminal className="w-6 h-6 text-indigo-400" />
                        사용 도구 & 프롬프트
                     </h2>
                     {tools.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tools.map((tool: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-slate-800/30 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                            <Cpu className="w-5 h-5" />
                                        </div>
                                        <span className="text-lg font-medium text-slate-200">{tool.item}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-xs px-2.5 py-0.5 bg-black/40 border border-white/5 text-slate-400">
                                        {tool.quantity}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                     ) : (
                        <div className="p-6 rounded-2xl bg-white/5 text-center text-slate-500 border border-dashed border-white/10">
                            등록된 도구가 없습니다.
                        </div>
                     )}
                </section>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                {/* 4. Main Guide Content */}
                <section>
                     <h2 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <BookOpen className="w-7 h-7 text-indigo-500" /> 상세 가이드
                    </h2>
                    
                    {isRichText ? (
                        // Rich Text Mode
                        <div 
                            className="prose prose-invert prose-xl max-w-none text-slate-300 leading-9
                                       prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                                       prose-p:my-6 prose-p:font-light
                                       prose-strong:text-indigo-300 prose-strong:font-semibold
                                       prose-code:text-orange-300 prose-code:bg-slate-900 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-white/10 prose-code:text-base prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                                       prose-pre:bg-slate-950 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:shadow-2xl
                                       prose-li:marker:text-indigo-500
                                       prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300 hover:prose-a:underline prose-a:transition-colors
                                       prose-img:rounded-3xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl prose-img:my-10"
                            dangerouslySetInnerHTML={{ __html: steps[0] }} 
                        />
                    ) : (
                        // Step-by-Step Mode
                        <div className="space-y-12">
                            {steps.map((step: string, idx: number) => (
                                <div key={idx} className="relative group">
                                    <div className="flex items-start gap-6 md:gap-8">
                                        <div className="flex-none flex flex-col items-center">
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-xl md:text-2xl font-bold text-slate-600 group-hover:text-indigo-400 group-hover:border-indigo-500/50 shadow-xl transition-all duration-300 z-10">
                                                {idx + 1}
                                            </div>
                                            {idx !== steps.length - 1 && (
                                                <div className="w-0.5 h-full bg-slate-800 group-hover:bg-indigo-900/50 transition-colors absolute top-16 left-6 md:left-8 -ml-px -z-0"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pt-2">

                                            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/20 hover:bg-slate-900/60 transition-all duration-300 relative">
                                                {step.includes("[") && step.includes("]") && !step.includes("](") ? (
                                                    // Smart Variable Mode (if brackets exist and it's not a link)
                                                    <VariablePromptRenderer text={step} />
                                                ) : (
                                                    // Standard Markdown Mode
                                                    <div className="prose prose-invert prose-lg max-w-none text-slate-300/90 leading-8">
                                                        <ReactMarkdown>{step}</ReactMarkdown>
                                                    </div>
                                                )}
                                                
                                                {/* Copy button only for standard markdown mode (Smart renderer has its own) */}
                                                {!(step.includes("[") && step.includes("]") && !step.includes("](")) && (
                                                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                       <CopyButton text={step} className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white" />
                                                   </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Sticky Sidebar (Smaller share: 4/12) */}
            <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-24 space-y-6">
                    
                    {/* Primary Action Card (Streamed!) */}
                    <Suspense fallback={<div className="h-[300px] w-full bg-slate-900/50 rounded-3xl animate-pulse" />}>
                        <RecipeActions 
                            recipeId={recipe.id} 
                            initialLikeCount={recipe.likes?.[0]?.count || 0}
                            authorId={recipe.user_id}
                        />
                    </Suspense>

                    {/* Meta Info Card */}
                    <div className="p-6 rounded-3xl bg-slate-900/20 border border-white/5 backdrop-blur-sm space-y-4">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">기본 정보</h4>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400">난이도</span>
                            <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 bg-indigo-500/5">{recipe.difficulty || "보통"}</Badge>
                        </div>
                         <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400">등록일</span>
                            <span className="text-slate-200">{new Date(recipe.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400">조회수</span>
                            <span className="text-slate-200 font-mono">{recipe.view_count || 0}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        {/* 5. Comments Section (Streamed) */}
        <div className="mt-20 pt-10 border-t border-white/5">
            <Suspense fallback={<div className="h-[200px] w-full bg-slate-900/50 rounded-xl animate-pulse" />}>
                <CommentsSection recipeId={id} />
            </Suspense>
        </div>

        <ViewCounter recipeId={id} />
      </div>
    </div>
  );
}
