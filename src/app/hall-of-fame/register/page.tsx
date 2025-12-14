"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Crown, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterHallOfFame() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [selectedRecipeId, setSelectedRecipeId] = useState("");
    const [inductionDate, setInductionDate] = useState("");
    const [awardTitle, setAwardTitle] = useState("Weekly Best");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const supabase = createClient();

    useEffect(() => {
        // Load my recipes
        const fetchMyRecipes = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if(!user) return;

            const { data } = await supabase
                .from('recipes')
                .select('id, title, image_url, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setRecipes(data);
        };
        fetchMyRecipes();
    }, [supabase]);

    const handleInduct = async () => {
        if (!selectedRecipeId || !inductionDate) {
            toast.error("레시피와 날짜를 선택해주세요.");
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.from('hall_of_fame').insert({
            recipe_id: selectedRecipeId,
            induction_date: inductionDate,
            award_title: awardTitle
        });

        setIsLoading(false);

        if (error) {
            if (error.code === '23505') {
                 toast.error("이미 명예의 전당에 있는 레시피입니다.");
            } else {
                 toast.error("등록 실패: " + error.message);
            }
        } else {
            toast.success("명예의 전당 등재 완료! 🏆");
            router.push('/hall-of-fame');
        }
    };

    const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-20 px-4 flex items-center justify-center">
            <Card className="w-full max-w-md bg-slate-900 border-white/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-500">
                        <Crown className="h-5 w-5" /> 명예의 전당 수동 등록
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>내 레시피 선택</Label>
                        <Select value={selectedRecipeId} onValueChange={setSelectedRecipeId}>
                            <SelectTrigger className="bg-slate-800 border-white/10">
                                <SelectValue placeholder="레시피를 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                                {recipes.map(recipe => (
                                    <SelectItem key={recipe.id} value={recipe.id}>
                                        {recipe.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedRecipe && (
                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/10">
                            {selectedRecipe.image_url && (
                                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                    <Image src={selectedRecipe.image_url} alt="" fill className="object-cover" />
                                </div>
                            )}
                            <div className="overflow-hidden">
                                <p className="font-medium text-sm truncate">{selectedRecipe.title}</p>
                                <p className="text-xs text-slate-500">{new Date(selectedRecipe.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                         <Label>수상/등재 타이틀</Label>
                         <Input 
                            value={awardTitle} 
                            onChange={(e) => setAwardTitle(e.target.value)} 
                            className="bg-slate-800 border-white/10" 
                            placeholder="예: 2024년 11월 1주 우승"
                         />
                    </div>

                    <div className="space-y-2">
                         <Label>접수일 (등재 기준일)</Label>
                         <Input 
                            type="date" 
                            value={inductionDate} 
                            onChange={(e) => setInductionDate(e.target.value)} 
                            className="bg-slate-800 border-white/10 text-white" 
                         />
                         <p className="text-xs text-slate-500">이 날짜를 기준으로 정렬되어 보여집니다.</p>
                    </div>

                    <Button 
                        onClick={handleInduct} 
                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "등재하기"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
