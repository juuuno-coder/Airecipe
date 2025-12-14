"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { addComment } from "@/app/recipe/[id]/actions";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending} className="bg-indigo-600 hover:bg-indigo-500 text-white">
      {pending ? "등록 중..." : <><SendHorizontal className="w-4 h-4 mr-2" /> 댓글 등록</>}
    </Button>
  );
}

export default function CommentForm({ recipeId }: { recipeId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  
  // Client-side auth check (optional for better UX)
  // Simply hide form or show login prompt if not logged in?
  // For now, let action handle it or just render.

  const handleSubmit = async (formData: FormData) => {
    const result = await addComment(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("댓글이 등록되었습니다.");
      formRef.current?.reset();
    }
  };

  return (
    <div className="mb-8">
      <form ref={formRef} action={handleSubmit} className="flex gap-4 items-start">
         <input type="hidden" name="recipeId" value={recipeId} />
         <div className="flex-1">
             <Textarea 
                name="content" 
                placeholder="이 레시피에 대한 의견을 남겨주세요..." 
                className="bg-slate-900/50 border-white/10 text-slate-200 min-h-[80px] focus:border-indigo-500/50"
             />
         </div>
         <SubmitButton />
      </form>
    </div>
  );
}
