"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 1. Show Local Preview Immediately (Optimistic UI)
    const previewUrl = URL.createObjectURL(file);
    onChange(previewUrl);

    setIsUploading(true);
    const supabase = createClient();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath);

      // 2. Update with real server URL
      onChange(publicUrl);
      toast.success("이미지가 업로드되었습니다.");
    } catch (error) {
      console.error("Upload error:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error("이미지 업로드 실패", { description: (error as any).message || "알 수 없는 오류" });
      
      // Revert preview on failure
      onChange(null); 
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className={cn("w-full", className)}>
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-slate-900 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Representative" className="h-full w-full object-cover transition-opacity duration-300" />
          
          {/* Loading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}

          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
                onChange(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm flex items-center gap-2">
            {!isUploading ? ( 
                <>대표 이미지</> 
            ) : (
                <>업로드 중...</>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-10 transition-all cursor-pointer relative overflow-hidden",
            isDragging
              ? "border-indigo-500 bg-indigo-500/10 scale-[0.99]"
              : "border-border bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-500"
          )}
        >
          <div className="rounded-full bg-secondary p-4 transition-transform group-hover:scale-110">
            {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="text-center z-10">
            <p className="text-sm font-medium text-slate-200">
              {isUploading ? "업로드 중..." : "대표 이미지 업로드"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              클릭하거나 이미지를 여기로 드래그하세요 (최대 5MB)
            </p>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </div>
      )}
    </div>
  );
}
