import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Terminal, MessageCircle } from "lucide-react";
import { login, signInWithGoogle, signInWithKakao } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border bg-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 bg-foreground text-background rounded-md flex items-center justify-center">
                <Terminal className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <CardDescription>
            이메일로 계속하거나 소셜 계정을 사용하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OAuth Buttons */}
          <div className="grid grid-cols-1 gap-4">
            {/* Kakao Hidden */}
            {/* <form action={signInWithKakao} className="w-full">
                <Button variant="outline" className="w-full border-[#FEE500] bg-[#FEE500] text-black hover:bg-[#FEE500]/90 hover:text-black">
                    <MessageCircle className="mr-2 h-4 w-4 fill-black" /> Kakao
                </Button>
            </form> */}
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
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" required className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" name="password" type="password" required className="bg-background" />
              </div>
              <Button formAction={login} className="w-full">로그인</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <div>
            계정이 없으신가요?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              회원가입
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
