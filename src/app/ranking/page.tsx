import { WeeklyRanking } from "@/components/weekly-ranking";
import { Sparkles } from "lucide-react";

export const revalidate = 0;

export default function RankingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-20 px-4">
      <div className="container max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-sm font-medium text-yellow-500">
            <Sparkles className="h-4 w-4" /> Weekly Challenge
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            이번 주 명예의 전당
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            매주 치열한 경쟁을 뚫고 올라온 최고의 레시피들을 만나보세요.<br/>
            추천, 좋아요, 저장 수를 종합하여 실시간으로 순위가 결정됩니다.
          </p>
        </div>

        <WeeklyRanking />

        {/* Future: Showing 4th ~ 10th places could go here */}
        
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 text-center space-y-4">
            <h3 className="text-xl font-semibold text-white">랭킹에 도전 하세요!</h3>
            <p className="text-slate-400">
                1위를 차지하면 '명예의 전당'에 영구 등재되며,<br/>
                특별한 뱃지와 혜택이 주어집니다.
            </p>
        </div>
      </div>
    </div>
  );
}
