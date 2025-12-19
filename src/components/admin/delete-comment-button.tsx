"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCommentAction } from "@/app/admin/comments/actions";
import { toast } from "sonner";
import { useState } from "react";

export function DeleteCommentButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("정말 이 댓글을 삭제하시겠습니까?")) return;
    
    setLoading(true);
    const result = await deleteCommentAction(id);
    setLoading(false);

    if (result.success) {
      toast.success("댓글이 삭제되었습니다.");
    } else {
      toast.error(`삭제 실패: ${result.error}`);
    }
  };

  return (
    <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleDelete} 
        disabled={loading}
        className="text-slate-400 hover:text-red-400 hover:bg-red-900/10"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
