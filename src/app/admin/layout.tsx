import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-[#0b1121]/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
            <h1 className="font-semibold text-white">관리자 콘솔</h1>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/30">
                    A
                </div>
                <span className="text-sm text-slate-400">{user.email}</span>
            </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
