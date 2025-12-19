"use client";

import { useState } from "react";
import { updateUserRole } from "@/app/admin/users/actions";
import { toast } from "sonner";
import { Shield, ShieldAlert, User, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserRoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (role: 'admin' | 'user' | 'banned') => {
    setLoading(true);
    const result = await updateUserRole(userId, role);
    setLoading(false);

    if (result.success) {
      toast.success(`권한이 '${role}'(으)로 변경되었습니다.`);
    } else {
      toast.error("권한 변경 실패");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
        case 'admin': return <ShieldAlert className="w-4 h-4 text-red-400" />;
        case 'banned': return <Ban className="w-4 h-4 text-slate-500" />;
        default: return <User className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading} className="h-8 border-white/10 bg-slate-900 text-slate-300">
           {getRoleIcon(currentRole)}
           <span className="ml-2 text-xs capitalize">{currentRole || 'User'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#0f172a] border-white/10 text-slate-200">
        <DropdownMenuItem onClick={() => handleRoleChange('user')} className="text-xs hover:bg-white/5 cursor-pointer">
            <User className="mr-2 h-3 w-3 text-indigo-400" /> 일반 유저 (User)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange('admin')} className="text-xs hover:bg-white/5 cursor-pointer text-red-300">
            <Shield className="mr-2 h-3 w-3" /> 관리자 (Admin)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange('banned')} className="text-xs hover:bg-white/5 cursor-pointer text-slate-400">
            <Ban className="mr-2 h-3 w-3" /> 차단 (Ban)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
