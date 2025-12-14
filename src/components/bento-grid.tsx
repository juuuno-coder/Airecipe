"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowUpRight } from "lucide-react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  id,
  user,
  time,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  i,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
  time?: number;
  i?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (i || 0) * 0.1 }}
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/5 border bg-white border-transparent justify-between flex flex-col space-y-4",
        className
      )}
    >
      <Link href={`/recipe/${id}`} className="h-full flex flex-col">
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 overflow-hidden relative">
          {header}
          <div className="absolute top-2 right-2 opacity-0 group-hover/bento:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm rounded-full p-1.5 border border-white/10">
              <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="group-hover/bento:translate-x-2 transition duration-200 mt-4">
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <div className="flex items-center gap-2 text-xs text-slate-400">
                 <Avatar className="h-4 w-4 border border-white/10">
                    <AvatarImage src={user?.profiles?.avatar_url} />
                    <AvatarFallback className="text-[8px]">U</AvatarFallback>
                 </Avatar>
                 <span>
                    {user?.profiles?.username || (user?.user_id ? user.user_id.slice(0,8) : "익명")}
                 </span>
            </div>
          </div>
          <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
            {title}
          </div>
          <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300 line-clamp-2">
            {description}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] h-5 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                <Zap className="w-3 h-3 mr-1" /> {time}분
            </Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
