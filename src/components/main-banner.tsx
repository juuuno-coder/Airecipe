import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";

export async function MainBanner() {
  const supabase = await createClient();
  const { data: banners } = await supabase
    .from('site_banners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(1);

  const banner = banners?.[0] || {
    title: "상상을 현실로 만드는 AI Recipe",
    subtitle: "검증된 프롬프트와 꿀팁을 확인하세요.",
    image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop",
    link_url: "/create",
    button_text: "새로운 레시피 등록"
  };

  return (
    <section className="container px-4 py-8 -mt-20 relative z-30">
        <div className="w-full bg-gradient-to-r from-indigo-900/90 to-purple-900/90 rounded-3xl border border-white/10 p-1 md:p-2 backdrop-blur-xl shadow-2xl overflow-hidden group">
            <div className="bg-[#0c0f1e]/80 rounded-2xl p-6 md:p-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                
                <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 mb-2 py-1.5 px-3">
                        <Sparkles className="mr-2 h-3.5 w-3.5 fill-indigo-300" /> Featured
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                        {banner.title}
                    </h2>
                    <p className="text-slate-300 text-lg md:text-xl max-w-xl font-light">
                        {banner.subtitle}
                    </p>
                    <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                        <Button className="bg-white text-indigo-950 hover:bg-slate-100 font-bold px-8 h-12 text-lg rounded-full transition-transform hover:scale-105" asChild>
                            <Link href={banner.link_url || '/create'}>
                                {banner.button_text || "자세히 보기"} <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
                {/* Visual */}
                <div className="flex-shrink-0 w-full md:w-[480px] aspect-video md:aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:border-white/20 transition-colors">
                     {banner.image_url ? (
                        <Image 
                            src={banner.image_url} 
                            alt="Banner" 
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                     ) : <div className="w-full h-full bg-slate-800" />}
                     <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/50 to-transparent mix-blend-overlay" />
                </div>
            </div>
        </div>
      </section>
  );
}
