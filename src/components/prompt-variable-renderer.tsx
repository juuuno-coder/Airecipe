"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  text: string;
}

export function VariablePromptRenderer({ text }: Props) {
  const [segments, setSegments] = useState<(string | { variable: string; value: string })[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Parse text for [variable] pattern
    const parts = text.split(/(\[.*?\])/g);
    const newSegments = parts.map(part => {
      if (part.startsWith("[") && part.endsWith("]")) {
        return { variable: part.slice(1, -1), value: "" };
      }
      return part;
    });
    setSegments(newSegments);
  }, [text]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (index: number, val: string) => {
    const newSegments = [...segments];
    if (typeof newSegments[index] === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newSegments[index] as any).value = val;
    }
    setSegments(newSegments);
  };

  const generateFinalPrompt = () => {
    return segments.map(s => {
      if (typeof s === 'string') return s;
      return s.value || `[${s.variable}]`; // Use input value or keep original variable if empty
    }).join("");
  };

  const handleCopy = () => {
    const final = generateFinalPrompt();
    navigator.clipboard.writeText(final);
    setCopied(true);
    toast.success("프롬프트가 복사되었습니다!");
    setTimeout(() => setCopied(false), 2000);
  };

  // If no variables found, just render simple text with copy
  if (!segments.some(s => typeof s !== 'string')) {
    return (
        <div className="relative group">
            <p className="whitespace-pre-wrap text-slate-300 leading-relaxed font-mono text-sm bg-slate-950/50 p-4 rounded-lg border border-white/5">
                {text}
            </p>
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-8 w-8 bg-slate-800 hover:bg-slate-700" onClick={() => {
                    navigator.clipboard.writeText(text);
                    toast.success("복사되었습니다");
                }}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-5 space-y-4 shadow-2xl shadow-indigo-500/5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-indigo-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
            Smart Prompt
        </h4>
        <span className="text-xs text-slate-500">빈칸을 채워보세요</span>
      </div>

      <div className="font-mono text-sm leading-8 text-slate-300">
        {segments.map((segment, i) => {
          if (typeof segment === "string") {
            return <span key={i} className="whitespace-pre-wrap">{segment}</span>;
          } else {
            return (
              <span key={i} className="inline-block mx-1">
                <Input 
                    type="text" 
                    placeholder={segment.variable}
                    value={segment.value}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    className="h-7 w-auto min-w-[60px] inline-flex bg-indigo-500/10 border-indigo-500/50 text-indigo-200 placeholder:text-indigo-500/50 text-xs px-2 py-0 focus:ring-1 focus:ring-indigo-500 rounded-md"
                    style={{ width: Math.max(segment.variable.length * 10 + 20, segment.value.length * 10 + 20) + "px" }}
                />
              </span>
            );
          }
        })}
      </div>

      <div className="pt-3 border-t border-white/5 flex justify-end">
        <Button 
            onClick={handleCopy} 
            size="sm" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all font-medium"
        >
          {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
          {copied ? "복사완료" : "완성된 프롬프트 복사"}
        </Button>
      </div>
    </div>
  );
}
