"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Settings, RefreshCw, Check, Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ProfileEditor({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user.user_metadata?.avatar_url || `https://avatar.vercel.sh/${user.email}`);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate some random avatar options
  const avatarOptions = [
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`,
    `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`,
    // Chef / Foodie Concepts
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Chef${user.email}&top=hat&clothing=overalls&clothesColor=white`, 
    `https://api.dicebear.com/7.x/notionists/svg?seed=Cook${user.email}&beard=variant05`,
    `https://api.dicebear.com/7.x/micah/svg?seed=Kitchen${user.email}&baseColor=apricot`,
    `https://api.dicebear.com/7.x/shapes/svg?seed=${user.email}`,
  ];

  const updateUserProfile = async (url: string) => {
    setLoading(true);
    const supabase = createClient();
    
    const { error } = await supabase.auth.updateUser({
      data: { avatar_url: url }
    });

    if (error) {
      toast.error("프로필 변경 실패", { description: error.message });
    } else {
      setCurrentAvatar(url);
      toast.success("프로필 이미지가 변경되었습니다!");
      setIsOpen(false);
      window.location.reload(); 
    }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        toast.error("이미지 크기는 2MB 이하여야 합니다.");
        return;
    }

    setUploading(true);
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        await updateUserProfile(publicUrl);

    } catch (error) {
        console.error("Avatar upload error:", error);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error("이미지 업로드에 실패했습니다.", { description: (error as any).message });
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group cursor-pointer" onClick={() => setIsOpen(true)}>
        <Avatar className="h-24 w-24 border-2 border-white/10 shadow-lg group-hover:border-indigo-500 transition-colors">
            <AvatarImage src={currentAvatar} className="object-cover" />
            <AvatarFallback className="text-2xl bg-slate-800 text-white">
                {user.email?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Settings className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-1">{user.user_metadata?.username || user.email?.split("@")[0]}</h2>
        <p className="text-sm text-slate-400">{user.email}</p>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button variant="outline" className="mt-2 border-white/10 hover:bg-white/5 text-slate-300">
                <RefreshCw className="w-3 h-3 mr-2" /> 프로필 이미지 변경
            </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-md">
            <DialogHeader>
                <DialogTitle>프로필 이미지 선택</DialogTitle>
                <DialogDescription className="text-slate-400">
                    이미지를 업로드하거나 프로필 아이콘을 선택하세요.
                </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
                {/* Upload Section */}
                <div>
                    <Button 
                        variant="secondary" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 업로드 중...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" /> 내 사진 업로드
                            </>
                        )}
                    </Button>
                    <Input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                    />
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-slate-900 px-2 text-slate-500">또는 프리셋 선택</span>
                    </div>
                </div>

                {/* Presets Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {avatarOptions.map((url, i) => (
                        <button
                            key={i}
                            onClick={() => updateUserProfile(url)}
                            className={`relative rounded-full overflow-hidden aspect-square border-2 transition-all ${currentAvatar === url ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-white/10 hover:border-white/30'}`}
                            disabled={loading || uploading}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                            {currentAvatar === url && (
                                <div className="absolute inset-0 bg-indigo-500/50 flex items-center justify-center">
                                    <Check className="w-6 h-6 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="text-xs text-center text-slate-500">
                Powered by Supabase Storage & DiceBear API
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
