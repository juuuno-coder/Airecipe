"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteRecipeAction } from "@/app/admin/recipes/actions";
import { toast } from "sonner";
import { useState } from "react";

export function DeleteRecipeButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("정말 이 레시피를 삭제하시겠습니까? (영구 삭제)")) return;
    
    setLoading(true);
    const result = await deleteRecipeAction(id);
    setLoading(false);

    if (result.success) {
      toast.success("레시피가 삭제되었습니다.");
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
