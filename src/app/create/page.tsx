"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save, Terminal, Zap, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch"; 
import { ImageUpload } from "@/components/image-upload";

export default function CreateRecipePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
  
  const [content, setContent] = useState(""); // Rich Text Content
  const [isAnonymous, setIsAnonymous] = useState(false); // Blind Chef Mode

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
    newIngredients[index][field] = value;
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

  const handleSubmit = async () => {
    if (!title || !content) {
        toast.error("제목과 본문 내용을 입력해주세요.");
        return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      // Determine main Image URL based on mode
      let finalImageUrl = isComparisonMode ? afterImage : imageUrl;

      // Fallback: If no representative image, try to extract first image from content
      if (!finalImageUrl && content) {
          const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch && imgMatch[1]) {
              finalImageUrl = imgMatch[1];
          }
      }
      
      const { data, error } = await supabase.from("recipes").insert({
        title,
        description,
        cooking_time_minutes: parseInt(cookingTime) || 0,
        difficulty,
        is_anonymous: isAnonymous,
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify([content]),
        user_id: user.id,
        image_url: finalImageUrl, 
        before_image_url: isComparisonMode ? beforeImage : null,
        after_image_url: isComparisonMode ? afterImage : null,
        category,
      }).select().single();

      if (error) throw error;

      toast.success("레시피가 성공적으로 게시되었습니다!");
      router.push(`/recipe/${data.id}`);
    } catch (error) {
      console.error("Error:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error("저장 중 오류가 발생했습니다: " + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-10 px-4 mx-auto">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
            <Terminal className="h-8 w-8 text-foreground" />
            새 레시피 생성
        </h1>
        <p className="text-muted-foreground">
          나만의 최적화된 프롬프트와 AI 모델 설정을 공유하세요.
        </p>
      </div>

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
                placeholder="예: 리액트 컴포넌트 마스터 프롬프트" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background font-bold text-lg"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">설명 (요약)</Label>
                <Textarea 
                id="description" 
                placeholder="이 레시피가 해결하는 문제와 특징을 간단히 요약해주세요." 
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
                    placeholder="5" 
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
                        내용 중에 <code className="bg-black/30 px-1.5 py-0.5 rounded text-yellow-400 font-mono">[변수]</code>처럼 대괄호를 사용하면,
                        나중에 보는 사람이 직접 값을 채워 넣을 수 있는 입력창으로 바뀝니다. <br/>
                        예: "Draw a cat in <code className="bg-black/30 px-1.5 py-0.5 rounded text-yellow-400 font-mono">[style]</code> style"
                    </p>
                </div>
            </div>
                <Textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="## 시작하기&#10;재료를 준비합니다...&#10;&#10;1. 첫 번째 단계&#10;2. 두 번째 단계&#10;3. 프롬프트 예시: Generate a [style] image of..."
                className="min-h-[400px] font-mono text-sm leading-relaxed p-6 bg-slate-900/50 border-white/10 focus:border-indigo-500/50 rounded-xl"
                />
            </div>

            <div className="pt-6">
            <Button onClick={handleSubmit} className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? "게시 중..." : <><Save className="mr-2 h-4 w-4" /> 레시피 게시하기</>}
            </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
