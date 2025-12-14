"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Bookmark, FolderPlus, Folder, Check, Loader2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface CollectionModalProps {
  recipeId: string;
  userId: string;
}

interface Collection {
  id: string;
  name: string;
}

export function CollectionModal({ recipeId, userId }: CollectionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creating, setCreating] = useState(false);
  
  const router = useRouter();
  
  // Track which collections contain this recipe
  const [savedCollectionIds, setSavedCollectionIds] = useState<Set<string>>(new Set());
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const supabase = createClient();

  // Load collections when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen]);

  const fetchCollections = async () => {
    setLoading(true);
    // 1. Fetch user's collections
    const { data: cols, error } = await supabase
      .from("collections")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("컬렉션을 불러오지 못했습니다.");
      setLoading(false);
      return;
    }

    setCollections(cols || []);

    // 2. Check where this recipe is saved
    if (cols && cols.length > 0) {
        const { data: items } = await supabase
            .from("collection_items")
            .select("collection_id")
            .eq("recipe_id", recipeId)
            .in("collection_id", cols.map(c => c.id));
        
        const savedSet = new Set(items?.map(i => i.collection_id) || []);
        setSavedCollectionIds(savedSet);
    }
    
    setLoading(false);
  };

  const createCollection = async () => {
    if (!newFolderName.trim()) return;
    setCreating(true);

    const { data, error } = await supabase
      .from("collections")
      .insert({
        user_id: userId,
        name: newFolderName.trim()
      })
      .select()
      .single();

    if (error) {
      toast.error("폴더 생성 실패: " + error.message);
    } else {
      toast.success("새 폴더가 생성되었습니다.");
      setCollections([data, ...collections]);
      setNewFolderName("");
    }
    setCreating(false);
  };

  const initiateToggle = (collectionId: string) => {
      if (confirmingId === collectionId) {
          setConfirmingId(null); // Cancel
      } else {
          setConfirmingId(collectionId);
      }
  };

  const handleConfirmAction = async (collectionId: string) => {
    const isSaved = savedCollectionIds.has(collectionId);
    setConfirmingId(null); // Close confirm UI
    
    if (isSaved) {
        // Remove
        const { error } = await supabase
            .from("collection_items")
            .delete()
            .eq("collection_id", collectionId)
            .eq("recipe_id", recipeId);
        
        if (!error) {
            const next = new Set(savedCollectionIds);
            next.delete(collectionId);
            setSavedCollectionIds(next);
            toast.success("컬렉션에서 제거되었습니다.");
            router.refresh();
        } else {
            toast.error(`제거 실패: ${error.message}`);
        }
    } else {
        // Add
        const { error } = await supabase
            .from("collection_items")
            .insert({
                collection_id: collectionId,
                recipe_id: recipeId
            });
            
        if (!error) {
            const next = new Set(savedCollectionIds);
            next.add(collectionId);
            setSavedCollectionIds(next);
            toast.success("컬렉션에 저장되었습니다!");
            router.refresh();
        } else {
            toast.error(`저장 실패: ${error.message}`);
        }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
            variant="outline" 
            size="lg" 
            className={`flex-1 h-12 rounded-xl transition-all duration-300 border-white/10 bg-white/5 
                ${savedCollectionIds.size > 0 ? "text-indigo-400 hover:text-indigo-300 border-indigo-500/30 bg-indigo-500/10" : "text-slate-300 hover:text-white hover:bg-white/10"}`}
        >
          <Bookmark className={`mr-2 h-5 w-5 ${savedCollectionIds.size > 0 ? "fill-current" : ""}`} />
          {savedCollectionIds.size > 0 ? "저장됨" : "저장"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0f111a] border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-indigo-500" /> 컬렉션에 저장
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
            {/* 1. Create New Folder */}
            <div className="flex gap-2">
                <Input 
                    placeholder="새 컬렉션 이름 (예: 나만의 맛집)" 
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    onKeyDown={(e) => e.key === 'Enter' && createCollection()}
                />
                <Button onClick={createCollection} disabled={creating || !newFolderName.trim()} className="bg-indigo-600 hover:bg-indigo-500 shrink-0">
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
            </div>

            {/* 2. Collection List */}
            <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">나의 컬렉션</span>
                {collections.length > 0 ? (
                    <ScrollArea className="h-[240px] pr-4">
                        <div className="grid gap-2">
                            {collections.map((col) => {
                                const isSaved = savedCollectionIds.has(col.id);
                                const isConfirming = confirmingId === col.id;

                                return (
                                    <div key={col.id} className="relative">
                                    <button
                                        onClick={() => initiateToggle(col.id)}
                                        className={`group relative flex items-center w-full p-3 rounded-xl border transition-all text-left
                                            ${isSaved 
                                                ? "bg-indigo-500/20 border-indigo-500/50 hover:bg-indigo-500/30" 
                                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        <Folder className={`h-5 w-5 mr-3 ${isSaved ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                                        <div className="flex-1 truncate">
                                            <span className={`font-medium ${isSaved ? "text-indigo-100" : "text-slate-300 group-hover:text-white"}`}>{col.name}</span>
                                        </div>
                                        {isSaved && (
                                            <div className="bg-indigo-500 rounded-full p-1">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                    
                                    {/* Confirmation Overlay/Area */}
                                    {isConfirming && (
                                        <div className="absolute inset-0 z-10 flex items-center justify-between px-4 bg-zinc-900 border border-indigo-500/50 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                                            <span className="text-sm font-medium text-white">
                                                {isSaved ? "삭제하시겠습니까?" : "저장하시겠습니까?"}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="ghost" className="h-7 px-2 text-slate-400 hover:text-white" onClick={() => setConfirmingId(null)}>취소</Button>
                                                <Button size="sm" className="h-7 px-3 bg-indigo-600 hover:bg-indigo-500 text-white" onClick={() => handleConfirmAction(col.id)}>확인</Button>
                                            </div>
                                        </div>
                                    )}
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="h-32 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-xl bg-white/5 gap-2">
                        <FolderPlus className="h-8 w-8 opacity-50" />
                        <span className="text-sm">생성된 폴더가 없습니다.</span>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
