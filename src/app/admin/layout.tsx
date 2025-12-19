import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "lucide-react"; // Import Sidebar Icon if needed, but we'll use a simple layout first

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

  // TODO: Check if user.role === 'admin' later. 
  // For now, we allow any logged-in user to see it for development, 
  // or you can implement the restrict logic immediately if 'role' column exists.

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <div className="border-b border-white/5 bg-[#0b1121]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="font-bold text-xl text-white flex items-center gap-2">
                <span className="bg-indigo-600/20 text-indigo-400 p-1 rounded-md border border-indigo-500/30 text-xs px-2">ADMIN</span>
                대시보드
            </h1>
            <div className="text-sm text-slate-400">
                관리자: <span className="text-white">{user.email}</span>
            </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
