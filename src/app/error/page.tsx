"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';

function ErrorContent() {
    const searchParams = useSearchParams();
    const errorMsg = searchParams.get('message') || "로그인 또는 회원가입 중 문제가 발생했습니다.";

    return (
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 text-center px-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h1 className="text-2xl font-bold">오류가 발생했습니다</h1>
            <p className="text-muted-foreground bg-secondary/50 p-4 rounded-md font-mono text-sm max-w-md break-all">
                {errorMsg}
            </p>
            <div className="flex flex-col gap-2 min-w-[200px]">
                <Button asChild variant="default">
                    <Link href="/login">다시 로그인하기</Link>
                </Button>
                 <Button asChild variant="outline">
                    <Link href="/">홈으로 돌아가기</Link>
                </Button>
            </div>
        </div>
    );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
