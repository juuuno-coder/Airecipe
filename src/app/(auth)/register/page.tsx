"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Loader2, MessageCircle, PlayCircle } from "lucide-react";
import { signup } from "./actions";
import { signInWithGoogle, signInWithKakao } from "../login/actions";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (isPending) return;

    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsPending(true);
    try {
        const result = await signup(formData);
        if (result?.error) {
            toast.error(result.error);
            setIsPending(false);
        }
    } catch (e) {
        console.error(e);
        toast.error("회원가입 요청 중 오류가 발생했습니다.");
        setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border bg-card">
        {/* Header same as before */}
        <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                    <Terminal className="h-6 w-6" />
                </div>
            </div>
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>
            AI.RECIPE의 워크플로우를 자유롭게 이용해보세요.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* OAuth Buttons (Added) */}
          <div className="grid grid-cols-2 gap-4">
            <form action={signInWithKakao} className="w-full">
                <Button variant="outline" className="w-full border-[#FEE500] bg-[#FEE500] text-black hover:bg-[#FEE500]/90 hover:text-black">
                    <MessageCircle className="mr-2 h-4 w-4 fill-black" /> Kakao
                </Button>
            </form>
            <form action={signInWithGoogle} className="w-full">
                <Button variant="outline" className="w-full border-border bg-secondary/50 hover:bg-secondary">
                    <PlayCircle className="mr-2 h-4 w-4" /> Google
                </Button>
            </form>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or register with email</span>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required className="bg-background" disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">사용자명</Label>
              <Input id="username" name="username" type="text" placeholder="johndoe" required className="bg-background" disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-background"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                required 
                className="bg-background"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPending}
              />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500" disabled={isPending}>
              {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 처리 중...
                </>
              ) : (
                "계정 생성하기"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <div>
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-indigo-400 hover:underline font-medium">
              로그인
            </Link>
          </div>
          <Link href="/" className="text-xs hover:text-foreground">
            홈으로 돌아가기
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
