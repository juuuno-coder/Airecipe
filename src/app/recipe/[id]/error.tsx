"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Recipe Page Error:", error);
  }, [error]);

  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-6 text-center p-4">
      <div className="rounded-full bg-red-500/10 p-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">문제가 발생했습니다</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          페이지를 로딩하는 도중 오류가 발생했습니다.<br/>
          (Error Digest: {error.digest})
        </p>
        <div className="mt-4 p-4 bg-black/50 rounded-lg text-left text-xs font-mono text-red-400 overflow-auto max-w-lg mx-auto border border-red-500/20">
            {error.message}
        </div>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          새로고침
        </Button>
        <Button onClick={() => reset()} variant="default">
          다시 시도
        </Button>
      </div>
    </div>
  );
}
