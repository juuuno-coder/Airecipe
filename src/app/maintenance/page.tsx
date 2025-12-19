import { Terminal } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-md w-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl text-center relative z-10">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
          <Terminal className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">시스템 점검 중</h1>
        <p className="text-slate-400 mb-8 text-sm">
          더 나은 서비스를 위해 현재 서버를 점검하고 있습니다.<br />
          잠시 후 다시 방문해 주세요. 🛠️
        </p>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 w-1/2 animate-progress" />
        </div>
      </div>
    </div>
  );
}
