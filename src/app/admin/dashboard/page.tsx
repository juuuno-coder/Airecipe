"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, BarChart3, Layout, Trophy, Crown } from "lucide-react";
import { WeeklyRanking } from "@/components/weekly-ranking";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Banner State
  const [banner, setBanner] = useState({
      title: "",
      subtitle: "",
      image_url: "",
      link_url: "",
      button_text: "",
      is_active: true
  });

  // Stats State
  const [stats, setStats] = useState({
      users: 0,
      recipes: 0,
      likes: 0
  });

  const supabase = createClient();

  useEffect(() => {
    checkAdmin();
    fetchBanner();
    fetchStats();
  }, []);

  const checkAdmin = async () => {
    // Basic check - In production, use sturdy Role Based Access Control
    const { data: { user } } = await supabase.auth.getUser();
    // Assuming you (the user) are the admin. You might want to specific ID check here.
    if (user) {
        setIsAdmin(true); 
    } else {
        setIsAdmin(false); 
    }
    setLoading(false);
  };

  const fetchBanner = async () => {
      const { data } = await supabase.from('site_banners').select('*').limit(1).single();
      if (data) setBanner(data);
  };

  const fetchStats = async () => {
      // Approximate counts
      const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: rCount } = await supabase.from('recipes').select('*', { count: 'exact', head: true });
      const { count: lCount } = await supabase.from('likes').select('*', { count: 'exact', head: true });
      
      setStats({
          users: uCount || 0,
          recipes: rCount || 0,
          likes: lCount || 0
      });
  };

  const updateBanner = async () => {
      const { error } = await supabase.from('site_banners').upsert({ 
          // Assuming single banner row 1 logic or specific ID if managed properly
          // For simple MVP, let's update all matching (or add ID to state if needed)
          // Better: upsert with ID if exists.
          ...(banner as any),
          updated_at: new Date().toISOString()
      });

      if (error) toast.error("배너 업데이트 실패: " + error.message);
      else toast.success("배너가 업데이트되었습니다.");
  };

  if (loading) return <div className="p-8 text-center text-white">Loading Admin...</div>;
  if (!isAdmin) return <div className="p-8 text-center text-red-500">Access Denied</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Layout className="h-8 w-8 text-indigo-500" /> 관리자 대시보드
        </h1>

        <Tabs defaultValue="banner" className="w-full">
            <TabsList className="bg-slate-900 border border-white/10 w-full justify-start h-12 p-1">
                <TabsTrigger value="banner" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6">메인 배너 관리</TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6">통계</TabsTrigger>
                <TabsTrigger value="ranking" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6">실시간 랭킹</TabsTrigger>
            </TabsList>

            <TabsContent value="banner" className="space-y-4 mt-6">
                <Card className="bg-slate-900 border-white/10">
                    <CardHeader>
                        <CardTitle>메인 페이지 배너 설정</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>제목 (Title)</Label>
                                <Input value={banner.title} onChange={(e) => setBanner({...banner, title: e.target.value})} className="bg-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>부제목 (Subtitle)</Label>
                                <Input value={banner.subtitle} onChange={(e) => setBanner({...banner, subtitle: e.target.value})} className="bg-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>이미지 URL</Label>
                                <Input value={banner.image_url} onChange={(e) => setBanner({...banner, image_url: e.target.value})} className="bg-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>링크 URL</Label>
                                <Input value={banner.link_url} onChange={(e) => setBanner({...banner, link_url: e.target.value})} className="bg-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>버튼 텍스트</Label>
                                <Input value={banner.button_text} onChange={(e) => setBanner({...banner, button_text: e.target.value})} className="bg-slate-800" />
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-4 p-4 border border-dashed border-white/20 rounded-xl">
                            <p className="text-sm text-slate-500 mb-2">미리보기:</p>
                            <div className="relative rounded-xl overflow-hidden aspect-video max-w-sm mx-auto">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={banner.image_url} alt="Preview" className="object-cover w-full h-full" />
                                <div className="absolute bottom-4 left-4 text-white drop-shadow-md">
                                    <h3 className="font-bold text-lg">{banner.title}</h3>
                                    <p className="text-xs">{banner.subtitle}</p>
                                </div>
                            </div>
                        </div>

                        <Button onClick={updateBanner} className="w-full bg-indigo-600 hover:bg-indigo-500">
                            <Save className="mr-2 h-4 w-4" /> 저장하기
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-slate-900 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">총 사용자</CardTitle>
                            <BarChart3 className="h-4 w-4 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats.users.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">총 레시피</CardTitle>
                            <Layout className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats.recipes.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">총 좋아요</CardTitle>
                            <Trophy className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats.likes.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="ranking" className="mt-6">
                <Card className="bg-slate-900 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" /> 실시간 랭킹 모니터링
                        </CardTitle>
                        <Button 
                            onClick={async () => {
                                if(!confirm("현재 1위 레시피를 명예의 전당에 등재하시겠습니까?")) return;
                                const { inductWeeklyWinner } = await import("../actions");
                                const res = await inductWeeklyWinner();
                                if(res.error) toast.error(res.error);
                                else toast.success(res.message);
                            }}
                            variant="outline"
                            className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                        >
                            <Crown className="mr-2 h-4 w-4" /> 
                            현재 1위 명예의 전당 등재
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <WeeklyRanking />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
