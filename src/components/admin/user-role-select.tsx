"use client";

import { useState } from "react";
import { updateUserRole } from "@/app/admin/users/actions";
import { toast } from "sonner";
import { Shield, ShieldAlert, User, Ban } from "lucide-react";

export function UserRoleSelect({ userId, currentRole }: { userId: string, currentRole: string | null | undefined }) {
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as 'admin' | 'user' | 'banned';
    setLoading(true);
    const result = await updateUserRole(userId, role);
    setLoading(false);

    if (result.success) {
      toast.success(`권한이 '${role}'(으)로 변경되었습니다.`);
    } else {
      toast.error("권한 변경 실패");
    }
  };

  const safeRole = currentRole || 'user';

  return (
    <div className="relative inline-block w-40">
        <select 
            disabled={loading}
            className={`w-full h-8 pl-8 pr-4 text-xs font-medium rounded-lg appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all
                ${safeRole === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                ${safeRole === 'user' ? 'bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700' : ''}
                ${safeRole === 'banned' ? 'bg-slate-700 text-slate-500 border border-slate-600' : ''}
            `}
            value={safeRole}
            onChange={handleRoleChange}
        >
            <option value="user">User (일반)</option>
            <option value="admin">Admin (관리자)</option>
            <option value="banned">Banned (차단)</option>
        </select>
        
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            {safeRole === 'admin' ? <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> : 
             safeRole === 'banned' ? <Ban className="w-3.5 h-3.5 text-slate-400" /> : 
             <User className="w-3.5 h-3.5 text-indigo-400" />}
        </div>
    </div>
  );
}
