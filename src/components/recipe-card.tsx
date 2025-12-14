
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Terminal, Zap, Eye, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cooking_time_minutes: number;
  created_at: string;
  user_id?: string;
  view_count?: number;
  profiles?: {
    username?: string;
    avatar_url?: string;
  } | null; // profiles could be single object or array depending on query, mostly single
  likes?: { count: number }[]; // result of count query
  ingredients?: any;
  instructions?: any;
  is_anonymous?: boolean;
}

export function RecipeCard({ recipe, hideAuthor = false }: { recipe: Recipe; hideAuthor?: boolean }) {
  
  return (
    <Link href={`/recipe/${recipe.id}`} className="group flex flex-col h-full bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300">
      {/* Thumbnail */}
      <div className="aspect-video bg-slate-800/50 relative overflow-hidden border-b border-white/5">
        {recipe.image_url ? (
          <Image 
            src={recipe.image_url} 
            alt={recipe.title} 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-950">
            <Terminal className="h-6 w-6 text-slate-700" />
          </div>
        )}
      </div>
      
      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1 gap-2">
            <h3 className="font-semibold text-slate-200 line-clamp-1 group-hover:text-indigo-400 transition-colors">
              {recipe.title}
            </h3>
            {/* Blind Chef Badge on Card */}
            {recipe.is_anonymous && (
                <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Blind</span>
            )}
            <span className="flex-none flex items-center text-[10px] text-yellow-500/80 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">
                <Zap className="h-3 w-3 mr-0.5" />{recipe.cooking_time_minutes}분
            </span>
        </div>
        
        <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-grow font-light">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          {/* Author Info */}
          {!hideAuthor && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 border border-white/10">
                  <AvatarImage src={recipe.is_anonymous ? undefined : recipe.profiles?.avatar_url} />
                  <AvatarFallback className="text-[9px] bg-slate-800 text-slate-400">
                    {recipe.is_anonymous ? "?" : (recipe.profiles?.username?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-slate-500 truncate max-w-[100px]">
                    {recipe.is_anonymous ? "Blind Chef" : (recipe.profiles?.username || (recipe.user_id ? recipe.user_id.slice(0, 8) : "익명"))}
                </span>
              </div>
          )}
          {hideAuthor && <div />} {/* Spacer if hidden */}

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center" title="조회수">
                <Eye className="h-3 w-3 mr-1" /> {recipe.view_count || 0}
            </span>
            <span className="flex items-center text-pink-500/70" title="좋아요">
                <Heart className="h-3 w-3 mr-1" /> {Array.isArray(recipe.likes) && recipe.likes[0]?.count ? recipe.likes[0].count : 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
