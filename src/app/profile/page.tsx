import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Heart, BookOpen, Terminal, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProfileEditor } from "./profile-editor";
import { RecipeCard } from "@/components/recipe-card";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();

  // Check Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 1. Parallel Fetching for Speed
  // We fetch Collections, My Recipes, and Liked Recipes concurrently.
  const [
    { data: collectionsData },
    { data: myRecipesData },
    { data: likedRecipesData }
  ] = await Promise.all([
    // A. Collections with item count
    supabase
      .from('collections')
      .select('*, collection_items(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
      
    // B. My Recipes
    supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),

    // C. Liked Recipes (with recipe details and author profile)
    supabase
      .from('likes')
      .select(`
        recipe_id,
        recipes (
          *,
          profiles (username, avatar_url)
        )
      `)
      .eq('user_id', user.id)
      // Note: Ordering by created_at in likes table might be ambiguous if not joined properly, 
      // but usually works. If error, remove order.
      .order('created_at', { ascending: false }) 
  ]);

  // 2. Process Data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collections = collectionsData || [];
  
  // Inject current user profile into recipes for display (since we are on My Page)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myRecipesWithProfile = myRecipesData?.map((recipe: any) => ({
    ...recipe,
    profiles: { 
        username: user.user_metadata?.full_name || user.email?.split('@')[0] || "Me", 
        avatar_url: user.user_metadata?.avatar_url 
    }
  })) || [];

  // Extract recipes from likes data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const likedRecipes = likedRecipesData?.map((item: any) => item.recipes).filter(Boolean) || [];

  return (
    <div className="container max-w-5xl py-20 px-4 mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Profile Sidebar */}
        <Card className="w-full md:w-1/3 border-white/5 bg-slate-900/50 backdrop-blur-sm sticky top-24">
            <CardContent className="pt-8 flex flex-col items-center space-y-6">
                
                {/* Client Component for Avatar Editing */}
                <ProfileEditor user={user} />

                <div className="w-full pt-4 border-t border-white/5 space-y-2">
                    <form action="/auth/signout" method="post">
                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 h-12">
                            <LogOut className="mr-2 h-4 w-4" /> 로그아웃
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="flex-1 w-full min-h-[500px]">
            <Tabs defaultValue="my-recipes" className="w-full">
                <TabsList className="w-full bg-slate-900/80 border border-white/5 p-1 h-auto grid grid-cols-3">
                    <TabsTrigger value="my-recipes" className="py-3 text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-xs md:text-sm">
                        <BookOpen className="mr-2 h-4 w-4" /> 내 레시피 ({myRecipesWithProfile?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="likes" className="py-3 text-slate-400 data-[state=active]:bg-pink-600 data-[state=active]:text-white transition-all text-xs md:text-sm">
                        <Heart className="mr-2 h-4 w-4" /> 좋아요 ({likedRecipes.length})
                    </TabsTrigger>
                    <TabsTrigger value="collections" className="py-3 text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all text-xs md:text-sm">
                        <Terminal className="mr-2 h-4 w-4" /> 컬렉션 ({collections?.length || 0})
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="my-recipes" className="mt-6 space-y-6 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
                    {myRecipesWithProfile && myRecipesWithProfile.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {myRecipesWithProfile.map((recipe: any) => (
                                <RecipeCard key={recipe.id} recipe={recipe} hideAuthor={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-slate-900/20">
                             <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                    <Terminal className="w-6 h-6 text-indigo-500" />
                                </div>
                             </div>
                            <h3 className="text-lg font-medium text-white mb-2">아직 등록한 레시피가 없습니다.</h3>
                            <p className="text-slate-500 mb-6 text-sm">나만의 AI 비법을 공유하고 다른 사람들과 소통해보세요.</p>
                            <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white">
                                <Link href="/create">새 레시피 만들기</Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>
                
                <TabsContent value="likes" className="mt-6 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
                    {likedRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {likedRecipes.map((recipe: any) => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-slate-900/20">
                             <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-red-500" />
                                </div>
                             </div>
                             <h3 className="text-lg font-medium text-white mb-2">좋아요한 항목이 없습니다.</h3>
                             <p className="text-slate-500 text-sm">마음에 드는 레시피를 발견하면 하트를 눌러보세요.</p>
                             <Button asChild variant="outline" className="mt-4 border-white/10">
                                <Link href="/">레시피 둘러보기</Link>
                             </Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="collections" className="mt-6 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
                    {collections && collections.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {collections.map((col: any) => (
                                <Link key={col.id} href={`/collection/${col.id}`} className="block">
                                    <div className="group p-5 bg-slate-900/40 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-950/10 rounded-xl transition-all cursor-pointer flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                                <Terminal className="h-5 w-5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">{col.name}</h3>
                                                <p className="text-xs text-slate-500">{col.collection_items?.[0]?.count || 0}개의 레시피</p>
                                            </div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowLeft className="h-4 w-4 rotate-180" />
                                        </Button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-slate-900/20">
                            <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Terminal className="w-6 h-6 text-emerald-500" />
                            </div>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">생성된 컬렉션이 없습니다.</h3>
                            <p className="text-slate-500 text-sm">레시피 상세 페이지에서 북마크 아이콘을 눌러 컬렉션을 만들어보세요.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}
