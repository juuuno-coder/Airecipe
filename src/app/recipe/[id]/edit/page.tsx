"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Plus, Trash2, Save, Terminal, Bot, Zap, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch"; 
import { ImageUpload } from "@/components/image-upload";
import Image from "next/image";

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true); // Initial loading true
  const [activeTab, setActiveTab] = useState("manual"); // Default logic manual

  // --- Manual Entry State ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [ingredients, setIngredients] = useState([{ item: "", quantity: "" }]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [category, setCategory] = useState("기타");
  
  // New States for Comparison
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [content, setContent] = useState(""); // Rick Text Content (Markdown)
  const supabase = createClient();

  // --- Load Recipe Data ---
  useEffect(() => {
    const fetchRecipe = async () => {
        if (!recipeId) return;

        const { data: recipe, error } = await supabase
            .from('recipes')
            .select('*')
            .eq('id', recipeId)
            .single();

        if (error) {
            toast.error("레시피를 불러오는데 실패했습니다.");
            router.push('/');
            return;
        }

        // Check ownership
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.id !== recipe.user_id) {
            toast.error("수정 권한이 없습니다.");
            router.push(`/recipe/${recipeId}`);
            return;
        }
        
        // Populate State
        setTitle(recipe.title);
        setDescription(recipe.description);
        setCookingTime(String(recipe.cooking_time_minutes));
        setDifficulty(recipe.difficulty);
        setCategory(recipe.category || "기타");
        setIngredients(typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients);
        
        const instArray = typeof recipe.instructions === 'string' ? JSON.parse(recipe.instructions) : recipe.instructions;
        setContent(Array.isArray(instArray) ? instArray[0] : instArray || "");

        // Image Logic
        setImageUrl(recipe.image_url);
        if (recipe.before_image_url && recipe.after_image_url) {
            setIsComparisonMode(true);
            setBeforeImage(recipe.before_image_url);
            setAfterImage(recipe.after_image_url);
        }

        setIsLoading(false);
    };

    fetchRecipe();
  }, [recipeId, router, supabase]);


  // --- Handlers ---
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { item: "", quantity: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index: number, field: "item" | "quantity", value: string) => {
    const newIngredients = [...ingredients];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newIngredients[index] as any)[field] = value;
    setIngredients(newIngredients);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
         const result = reader.result as string;
         if (type === 'before') setBeforeImage(result);
         if (type === 'after') setAfterImage(result);
    };
    reader.readAsDataURL(file);
  };


  const handleUpdate = async () => {
    if (!title || !content) {
        toast.error("제목과 본문 내용을 입력해주세요.");
        return;
    }

    setIsLoading(true);
    try {
      // Determine main Image URL based on mode
      let finalImageUrl = isComparisonMode ? afterImage : imageUrl;

      // Fallback: If no representative image, try to extract first image from content
      if (!finalImageUrl && content) {
          const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch && imgMatch[1]) {
              finalImageUrl = imgMatch[1];
          }
      }
      
      const { error } = await supabase.from("recipes").update({
        title,
        description,
        cooking_time_minutes: parseInt(cookingTime) || 0,
        difficulty,
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify([content]),
        image_url: finalImageUrl, 
        before_image_url: isComparisonMode ? beforeImage : null,
        after_image_url: isComparisonMode ? afterImage : null,
        category,
      }).eq('id', recipeId);

      if (error) throw error;

      toast.success("레시피가 수정되었습니다!");
      router.push(`/recipe/${recipeId}`);
    } catch (error) {
      console.error("Error:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error("수정 중 오류가 발생했습니다: " + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
      if(!confirm("정말로 이 레시피를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
      
      setIsLoading(true);
      const { error } = await supabase.from('recipes').delete().eq('id', recipeId);
      
      if (error) {
          toast.error("삭제 실패: " + error.message);
          setIsLoading(false);
      } else {
          toast.success("레시피가 삭제되었습니다.");
          router.push('/');
      }
  };

  if (isLoading) {
      return <div className="flex h-screen items-center justify-center text-slate-500">레시피 불러오는 중...</div>;
  }

  return (
    <div className="container max-w-4xl py-10 px-4 mx-auto">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
            <Terminal className="h-8 w-8 text-foreground" />
            레시피 수정
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 mb-8 bg-secondary/50">
          <TabsTrigger value="manual" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Bot className="mr-2 h-4 w-4" /> 내용 수정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <Card className="border-border bg-card">
            <CardContent className="p-6 space-y-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-border pb-2">기본 정보</h3>
                
                {/* Image Upload Area with Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <div className="space-y-0.5">
                        <Label className="text-base text-white font-medium">비포/애프터 비교 모드</Label>
                        <p className="text-xs text-slate-400">AI 보정 전후나 스타일 변화를 비교해서 보여줍니다.</p>
                    </div>
                    <Switch
                        checked={isComparisonMode}
                        onCheckedChange={setIsComparisonMode}
                    />
                 </div>

                 {!isComparisonMode ? (
                     // Original Single Image Upload
                     <div className="space-y-2">
                        <Label>대표 이미지</Label>
                        <ImageUpload value={imageUrl} onChange={setImageUrl} />
                     </div>
                 ) : (
                     // Comparison Mode Uploads (Side by Side)
                     <div className="grid grid-cols-2 gap-4">
                        {/* Before Image */}
                        <div className="relative border-2 border-dashed border-border hover:border-indigo-500/50 rounded-xl h-[240px] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-secondary/5 transition-colors">
                            <input type="file" onChange={(e) => handleImageUpload(e, 'before')} className="absolute inset-0 z-10 opacity-0 cursor-pointer" accept="image/*" />
                            {beforeImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-slate-500">
                                    <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <span className="block text-sm font-bold mb-1">Before</span>
                                    <span className="text-xs opacity-50">원본 이미지</span>
                                </div>
                            )}
                            {beforeImage && (
                                <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded z-20">Before Check</div>
                            )}
                        </div>

                        {/* After Image */}
                         <div className="relative border-2 border-dashed border-border hover:border-indigo-500/50 rounded-xl h-[240px] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-secondary/5 transition-colors">
                            <input type="file" onChange={(e) => handleImageUpload(e, 'after')} className="absolute inset-0 z-10 opacity-0 cursor-pointer" accept="image/*" />
                            {afterImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-slate-500">
                                    <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <span className="block text-sm font-bold mb-1">After</span>
                                    <span className="text-xs opacity-50">결과 이미지</span>
                                </div>
                            )}
                             {afterImage && (
                                <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded z-20">After Result</div>
                            )}
                        </div>
                     </div>
                 )}

                <div className="space-y-2">
                  <Label htmlFor="title">레시피 제목</Label>
                  <Input 
                    id="title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-background font-bold text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">설명 (요약)</Label>
                  <Textarea 
                    id="description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-background min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">예상 소요 시간 (분)</Label>
                    <Input 
                      id="time" 
                      type="number" 
                      value={cookingTime}
                      onChange={(e) => setCookingTime(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>난이도</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">입문 (Easy)</SelectItem>
                        <SelectItem value="Medium">중급 (Medium)</SelectItem>
                        <SelectItem value="Hard">전문가 (Expert)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                    <Label>카테고리</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="개발">개발 (Development)</SelectItem>
                        <SelectItem value="디자인">디자인 (Design)</SelectItem>
                        <SelectItem value="이미지">이미지 (Image)</SelectItem>
                        <SelectItem value="영상">영상 (Video)</SelectItem>
                        <SelectItem value="글쓰기">글쓰기 (Writing)</SelectItem>
                        <SelectItem value="생산성">생산성 (Productivity)</SelectItem>
                        <SelectItem value="마케팅">마케팅 (Marketing)</SelectItem>
                        <SelectItem value="기타">기타 (Other)</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </div>

              {/* Tools & Models */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-lg font-semibold">사용 도구 및 모델</h3>
                    <Button variant="outline" size="sm" onClick={handleAddIngredient} className="h-8">
                        <Plus className="h-4 w-4 mr-1" /> 추가
                    </Button>
                </div>
                <div className="space-y-3">
                  {ingredients.map((ing, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        placeholder="도구/모델명 (예: GPT-4)" 
                        value={ing.item} 
                        onChange={(e) => handleIngredientChange(index, "item", e.target.value)}
                        className="flex-1 bg-background"
                      />
                      <Input 
                        placeholder="활용도 (예: 메인 생성)" 
                        value={ing.quantity} 
                        onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                        className="w-1/3 bg-background"
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveIngredient(index)} className="hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps (Prompt) */}
              <div className="space-y-4">
                 <div className="border-b border-border pb-2">
                    <h3 className="text-lg font-semibold">상세 내용 (프롬프트/가이드)</h3>
                 </div>
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl mb-4 text-sm text-indigo-300 flex items-start gap-3">
                    <Zap className="h-4 w-4 text-indigo-400 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-medium text-white">꿀팁: 스마트 프롬프트 만들기</p>
                        <p>
                            내용 중에 <code className="bg-black/30 px-1.5 py-0.5 rounded text-yellow-400 font-mono">[변수]</code> 대괄호를 그대로 사용하세요.
                        </p>
                    </div>
                </div>
                 <Textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    className="min-h-[400px] font-mono text-sm leading-relaxed p-6 bg-slate-900/50 border-white/10 focus:border-indigo-500/50 rounded-xl"
                 />
              </div>

              <div className="pt-6 space-y-4">
                <Button onClick={handleUpdate} className="w-full h-12 text-lg" disabled={isLoading}>
                  {isLoading ? "처리 중..." : <><Save className="mr-2 h-4 w-4" /> 수정 사항 저장하기</>}
                </Button>
                
                <div className="border-t border-white/5 pt-4 mt-6">
                    <h4 className="text-sm font-semibold text-red-500 mb-2">위험 구역</h4>
                    <Button onClick={handleDelete} variant="destructive" className="w-full h-10 hover:bg-red-700" disabled={isLoading}>
                        <Trash2 className="mr-2 h-4 w-4" /> 레시피 영구 삭제
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
