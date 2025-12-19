import { createClient } from "@/utils/supabase/server";
import { SiteSettingsForm } from "@/components/admin/settings-form";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div className="space-y-6">
       <div>
            <h2 className="text-2xl font-bold text-white">사이트 설정</h2>
            <p className="text-slate-400 text-sm mt-1">글로벌 공지사항 및 시스템 상태를 제어합니다.</p>
      </div>

      <SiteSettingsForm initialSettings={settings || {}} />
    </div>
  );
}
