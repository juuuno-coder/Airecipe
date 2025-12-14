"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Heading1, Heading2, Quote, Undo, Redo, Code, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRef, useState } from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string; // Additional className for styling
}

export function TiptapEditor({ content, onChange, placeholder, className }: TiptapEditorProps) {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm md:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
    immediatelyRender: false, 
  });

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("이미지는 5MB 이하여야 합니다.");
      return;
    }

    setIsImageUploading(true);
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `content_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`; // Upload to same bucket

    try {
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath);

      editor.chain().focus().setImage({ src: publicUrl }).run();
      toast.success("이미지가 삽입되었습니다.");
    } catch (error) {
      console.error("Editor Image Upload Error:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error("이미지 업로드 실패", { description: (error as any).message || "오류 발생" });
    } finally {
      setIsImageUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("border border-border rounded-lg bg-card overflow-hidden w-full", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        
        <div className="w-px h-6 bg-border mx-1" />

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />

        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />
        
        <Toggle
           size="sm"
           pressed={editor.isActive("codeBlock")}
           onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        >
            <Code className="h-4 w-4" />
        </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive("blockquote")}
           onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        >
            <Quote className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />

        <Button variant="ghost" size="sm" onClick={addImage} disabled={isImageUploading}>
            {isImageUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </Button>
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
            }} 
        />
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="bg-background min-h-[300px]" />
    </div>
  );
}
