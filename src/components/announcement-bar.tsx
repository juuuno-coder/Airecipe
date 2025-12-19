import { createClient } from "@/utils/supabase/server";
import { Megaphone, X } from "lucide-react";

export async function AnnouncementBar() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (!settings || !settings.is_announcement_visible || !settings.announcement_text) {
    return null;
  }

  return (
    <div className="relative z-[60] bg-indigo-600">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center flex-wrap gap-2">
          <div className="flex items-center">
            <span className="flex p-1 rounded-lg bg-indigo-800">
              <Megaphone className="h-4 w-4 text-white" aria-hidden="true" />
            </span>
            <p className="ml-3 font-medium text-white truncate text-xs sm:text-sm">
              <span className="inline">{settings.announcement_text}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
