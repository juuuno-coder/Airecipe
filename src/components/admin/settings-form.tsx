"use client";

import { updateSiteSettings } from "@/app/admin/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { Megaphone, AlertTriangle, Save } from "lucide-react";

export function SiteSettingsForm({ initialSettings }: { initialSettings: any }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await updateSiteSettings(formData);
    setLoading(false);

    if (result.success) {
      toast.success("사이트 설정이 저장되었습니다.");
    } else {
      toast.error(`저장 실패: ${result.error}`);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-8 max-w-2xl">
        
        {/* Announcement Section */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Megaphone className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">상단 공지사항</h3>
                    <p className="text-xs text-slate-400">모든 페이지 상단에 띠배너를 띄웁니다.</p>
                </div>
            </div>
            
            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="is_announcement_visible" 
                        name="is_announcement_visible" 
                        defaultChecked={initialSettings?.is_announcement_visible}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="is_announcement_visible" className="text-slate-300">공지사항 켜기</Label>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="announcement_text">공지 내용</Label>
                    <Input 
                        id="announcement_text" 
                        name="announcement_text" 
                        defaultValue={initialSettings?.announcement_text} 
                        className="bg-slate-950 border-white/10"
                        placeholder="예: 서버 점검 안내 (00:00 ~ 01:00)"
                    />
                </div>
            </div>
        </div>

        {/* Maintenance Mode Section */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-red-500/20 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-red-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">점검 모드 (Maintenance Mode)</h3>
                    <p className="text-xs text-slate-400">관리자를 제외한 모든 유저의 접속을 차단합니다.</p>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2 relative z-10">
                <input 
                    type="checkbox" 
                    id="maintenance_mode" 
                    name="maintenance_mode" 
                    defaultChecked={initialSettings?.maintenance_mode}
                    className="w-4 h-4 rounded border-red-700 bg-red-900/20 text-red-600 focus:ring-red-500"
                />
                <Label htmlFor="maintenance_mode" className="text-red-200">점검 모드 활성화 (주의!)</Label>
            </div>
        </div>

        <div className="pt-4">
             <Button type="submit" disabled={loading} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500">
                <Save className="mr-2 h-4 w-4" />
                설정 저장
             </Button>
        </div>
    </form>
  );
}
