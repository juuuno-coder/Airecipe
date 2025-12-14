import React from "react";
import {
  Smartphone,
  Globe,
  Server,
  Layers,
  ArrowRight,
  Code2,
  Package,
  Search,
  Database,
  Layout,
  Monitor,
  Folder,
  FileCode,
  Zap,
  Home as HomeIcon,
  MapPin,
  Building,
  Activity,
  Repeat,
  Lock,
  Image as ImageIcon,
  Mail,
  Radio,
  Play,
  Github,
  Twitter,
  Youtube,
  Terminal,
  ChevronRight,
  Cpu,
  Cloud,
  ShieldCheck,
  PaintBucket,
  FileJson,
  Settings,
  Camera,
  Bell,
  Navigation,
  Bluetooth,
  User,
  ShoppingCart,
  List,
  CreditCard,
  Truck,
  RefreshCw,
  Palette,
} from "lucide-react";

// Mock Data for guide posts (since we haven't set up the table yet)
const GUIDE_POSTS = [
  { id: 1, title: '서버 컴포넌트 이해하기', desc: 'React 18의 핵심 기능인 서버 컴포넌트가 어떻게 동작하는지 알아봅니다.', tag: 'Core' },
  { id: 2, title: '이미지 최적화', desc: 'Next.js Image 컴포넌트를 사용하여 LCP를 개선하는 방법.', tag: 'Performance' },
  { id: 3, title: '미들웨어 활용', desc: '요청이 완료되기 전에 실행되는 코드를 작성합니다.', tag: 'Advanced' },
];

// ----------------------------------------------------------------------
// 1. UI Components
// ----------------------------------------------------------------------

const Badge = ({
  children,
  color = "blue",
}: {
  children: React.ReactNode;
  color?: string;
}) => {
  const styles =
    {
      blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      red: "bg-red-500/10 text-red-400 border-red-500/20",
      green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    }[color] || "bg-gray-500/10 text-gray-400 border-gray-500/20";

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}
    >
      {children}
    </span>
  );
};

const BentoCard = ({
  children,
  className = "",
  title,
  icon: Icon,
  badge,
}: any) => (
  <div
    className={`group relative bg-[#0F172A]/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.01] hover:bg-[#1E293B]/80 hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-900/20 overflow-hidden ${className}`}
  >
    <div className="relative z-10 h-full flex flex-col">
      {(title || Icon) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 group-hover:text-white group-hover:bg-red-500 group-hover:border-red-500 transition-all duration-300">
                <Icon size={20} />
              </div>
            )}
            {title && (
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                {title}
              </h3>
            )}
          </div>
          {badge && <Badge color="red">{badge}</Badge>}
        </div>
      )}
      <div className="flex-1 text-slate-400 group-hover:text-slate-300 transition-colors">
        {children}
      </div>
    </div>
  </div>
);

const CodeWindow = ({
  code,
  title = "Terminal",
}: {
  code: string;
  title?: string;
}) => (
  <div className="rounded-xl overflow-hidden bg-[#020617] border border-slate-800 shadow-xl font-mono text-xs my-3 group transition-all hover:border-slate-600">
    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
      </div>
      <span className="text-slate-500 text-[10px]">{title}</span>
    </div>
    <div className="p-4 overflow-x-auto text-slate-300 leading-relaxed">
      <pre>{code}</pre>
    </div>
  </div>
);

const SectionHeader = ({ num, title }: { num: string; title: string }) => (
  <div className="flex items-baseline gap-3 mb-8 mt-16 group cursor-default">
    <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 group-hover:scale-110 transition-transform duration-300 inline-block">
      {num}
    </span>
    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight group-hover:text-slate-200 transition-colors">
      {title}
    </h2>
  </div>
);

const FlowArrow = () => (
  <div className="hidden md:flex items-center justify-center text-slate-600">
    <ArrowRight size={20} className="animate-pulse text-red-500/50" />
  </div>
);

const FlowStep = ({
  num,
  text,
  colorClass,
}: {
  num: string;
  text: string;
  colorClass: string;
}) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
    <div
      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${colorClass}`}
    >
      {num}
    </div>
    <p className="text-slate-300 text-sm pt-1.5 leading-relaxed font-medium">
      {text}
    </p>
  </div>
);

// ----------------------------------------------------------------------
// 3. Main Page
// ----------------------------------------------------------------------

export default function GuidePage() {
  // Use mock data
  const guidePosts = GUIDE_POSTS;

  return (
    <div className="min-h-screen text-slate-300 font-sans selection:bg-red-500 selection:text-white">
      
      <div className="relative z-10">
        {/* --- Hero Section --- */}
        <header className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-red-300 mb-6 hover:bg-white/10 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Architecture Guide v1.0
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Next.js (React) <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
              아키텍처 가이드
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            비개발자도 이해할 수 있는 웹 애플리케이션의 구조와 동작 원리.
          </p>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          {/* 1. 전체 구조 */}
          <section>
            <SectionHeader
              num="01."
              title="전체 구조: 사용자 요청부터 응답까지"
            />

            <div className="grid md:grid-cols-7 gap-4 items-center bg-[#0F172A]/50 border border-white/5 rounded-3xl p-10 backdrop-blur-sm shadow-xl mb-8">
              <div className="md:col-span-1 flex flex-col items-center text-center gap-3 group">
                <div className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <Smartphone size={32} />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">사용자</div>
                  <div className="text-sm text-slate-500">브라우저/앱</div>
                </div>
              </div>

              <FlowArrow />

              <div className="md:col-span-1 flex flex-col items-center text-center gap-3 group">
                <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center border border-green-500/20 group-hover:bg-green-500 group-hover:text-white transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <Globe size={32} />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">인터넷</div>
                  <div className="text-sm text-slate-500">DNS/IP</div>
                </div>
              </div>

              <FlowArrow />

              <div className="md:col-span-1 flex flex-col items-center text-center gap-3 group">
                <div className="w-20 h-20 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <Server size={32} />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">서버</div>
                  <div className="text-sm text-slate-500">Vercel/Docker</div>
                </div>
              </div>

              <FlowArrow />

              <div className="md:col-span-1 flex flex-col items-center text-center gap-3 group">
                <div className="w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <Layers size={32} />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">Next.js</div>
                  <div className="text-sm text-slate-500">Web App</div>
                </div>
              </div>
            </div>

            <div className="bg-[#1E293B]/40 rounded-3xl p-8 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-6 px-4 border-l-4 border-red-500 ml-4">
                요청 흐름 설명
              </h3>
              <div className="grid md:grid-cols-1 gap-2">
                <FlowStep
                  num="1"
                  colorClass="bg-blue-500"
                  text="사용자가 브라우저에서 abc.com 주소를 입력합니다"
                />
                <FlowStep
                  num="2"
                  colorClass="bg-green-500"
                  text="DNS가 도메인을 서버 IP 주소(예: 123.45.67.89)로 변환합니다"
                />
                <FlowStep
                  num="3"
                  colorClass="bg-purple-500"
                  text="서버가 요청을 받아 Docker 컨테이너 안의 Next.js 앱으로 전달합니다"
                />
                <FlowStep
                  num="4"
                  colorClass="bg-red-500"
                  text="Next.js가 요청을 처리하고 HTML 페이지를 만들어 사용자에게 돌려줍니다"
                />
              </div>
            </div>
          </section>

          {/* 2. JavaScript vs Next.js */}
          <section>
            <SectionHeader num="02." title="언어와 프레임워크의 관계" />

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <BentoCard
                title="자바스크립트 (JavaScript)"
                icon={Code2}
                badge="Language"
              >
                <p className="mb-4 text-sm leading-relaxed text-slate-300">
                  <strong>웹의 공용어</strong>입니다. 사람으로 치면 '한국어,
                  영어' 같은 언어 자체입니다. <br />
                  브라우저와 서버 어디서든 실행되며, 웹의 모든 상호작용을
                  담당합니다.
                </p>
                <CodeWindow
                  code={`console.log("안녕하세요!");`}
                  title="JS Example"
                />
              </BentoCard>

              <BentoCard
                title="Next.js (프레임워크)"
                icon={Layers}
                badge="Framework"
              >
                <p className="mb-4 text-sm leading-relaxed text-slate-300">
                  자바스크립트로 만들어진 <strong>풀스택 도구 모음</strong>
                  입니다. <br />
                  언어를 이용해 웹사이트를 빠르게 만들 수 있도록 미리 준비된
                  틀과 규칙을 제공합니다.
                </p>
                <div className="bg-slate-800 p-3 rounded-lg text-xs border border-slate-700">
                  제공 기능: 라우팅, 서버 사이드 렌더링(SSR), 이미지 최적화, API
                  등
                </div>
              </BentoCard>
            </div>

            {/* 쉬운 비유 섹션 */}
            <div className="bg-[#1E293B]/60 p-6 rounded-2xl border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-yellow-400 fill-current" size={20} />
                <span className="text-lg font-bold text-white">
                  쉬운 비유로 이해하기
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-black/20 rounded-xl">
                  <div className="text-3xl">🔤</div>
                  <div>
                    <strong className="text-yellow-400 block mb-1">
                      JavaScript = 언어 (영어)
                    </strong>
                    <span className="text-sm text-slate-400">
                      전 세계 어디서나 통하는 의사소통 수단
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-black/20 rounded-xl">
                  <div className="text-3xl">📝</div>
                  <div>
                    <strong className="text-blue-400 block mb-1">
                      Next.js = 계약서 양식
                    </strong>
                    <span className="text-sm text-slate-400">
                      언어를 사용하여 문서를 빠르게 만들 수 있는 템플릿
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. npm */}
          <section>
            <SectionHeader num="03." title="npm: 레고 블록 라이브러리" />
            <div className="grid md:grid-cols-3 gap-6">
              <BentoCard
                title="패키지 관리자 (npm)"
                icon={Package}
                className="md:col-span-2"
              >
                <p className="mb-4 text-slate-300">
                  전 세계 개발자들이 만들어 놓은{" "}
                  <strong>코드 저장소(앱스토어)</strong>입니다. <br />
                  로그인, 결제, 이메일 같은 복잡한 기능을 직접 짤 필요 없이
                  다운로드해서 씁니다.
                </p>
                <CodeWindow
                  code={`npm install lucide-react`}
                  title="Terminal"
                />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-xs bg-white/5 p-3 rounded-lg">
                    <Lock size={14} className="text-green-400" />{" "}
                    <strong>Auth.js</strong> (로그인)
                  </div>
                  <div className="flex items-center gap-2 text-xs bg-white/5 p-3 rounded-lg">
                    <ImageIcon size={14} className="text-blue-400" />{" "}
                    <strong>sharp</strong> (이미지 처리)
                  </div>
                  <div className="flex items-center gap-2 text-xs bg-white/5 p-3 rounded-lg">
                    <Mail size={14} className="text-orange-400" />{" "}
                    <strong>resend</strong> (이메일 발송)
                  </div>
                  <div className="flex items-center gap-2 text-xs bg-white/5 p-3 rounded-lg">
                    <PaintBucket size={14} className="text-purple-400" />{" "}
                    <strong>framer</strong> (애니메이션)
                  </div>
                </div>
              </BentoCard>

              <BentoCard
                title="설치 목록 (package.json)"
                icon={List}
                className="md:col-span-1"
              >
                <p className="text-sm mb-4 text-slate-300">
                  <strong>쇼핑 영수증</strong>과 같습니다. <br />
                  어떤 라이브러리를 설치했고 버전은 몇인지 기록되어 있습니다.
                </p>
                <CodeWindow
                  code={`{
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.0",
    "tailwindcss": "3.4.0"
  }
}`}
                  title="package.json"
                />
              </BentoCard>
            </div>
          </section>

          {/* 4. Routing */}
          <section>
            <SectionHeader num="04." title="라우팅: 길 찾기 (Routing)" />
            <BentoCard title="앱 라우터 (App Router)" icon={Folder}>
              <p className="mb-6 text-slate-300">
                복잡한 설정 파일 없이{" "}
                <span className="text-red-400 font-bold">
                  폴더를 만들면 곧 URL 주소
                </span>
                가 됩니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 font-mono text-sm text-blue-300">
                    <Folder size={16} /> app/page.tsx
                  </div>
                  <ArrowRight size={16} className="text-slate-600" />
                  <div className="font-mono text-sm text-green-400">
                    / (메인 페이지)
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 font-mono text-sm text-blue-300">
                    <Folder size={16} /> app/courses/page.tsx
                  </div>
                  <ArrowRight size={16} className="text-slate-600" />
                  <div className="font-mono text-sm text-green-400">
                    /courses (강의 목록)
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 font-mono text-sm text-blue-300">
                    <Folder size={16} /> app/courses/[id]/page.tsx
                  </div>
                  <ArrowRight size={16} className="text-slate-600" />
                  <div className="font-mono text-sm text-green-400">
                    /courses/123 (상세)
                  </div>
                </div>
              </div>
            </BentoCard>
          </section>

          {/* 5. React Architecture */}
          <section>
            <SectionHeader num="05." title="핵심 구조 (MVC 대체)" />
            <div className="grid md:grid-cols-3 gap-6">
              <BentoCard
                title="데이터 담당 (Model)"
                icon={Database}
                badge="Fetching"
              >
                <p className="text-sm mb-3 text-slate-300 font-bold">
                  "재료 준비해오기"
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  데이터베이스나 API에서 필요한 정보를 직접 가져오는 역할을
                  합니다. (Server Component)
                </p>
                <CodeWindow code={`const user = await db.user.find(...)`} />
              </BentoCard>
              <BentoCard title="화면 담당 (View)" icon={Monitor} badge="UI">
                <p className="text-sm mb-3 text-slate-300 font-bold">
                  "예쁘게 플레이팅 하기"
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  가져온 데이터를 바탕으로 사용자에게 보여질 화면(HTML)을
                  그립니다. (JSX)
                </p>
                <CodeWindow code={`return <div>{user.name}</div>`} />
              </BentoCard>
              <BentoCard
                title="요청 담당 (Controller)"
                icon={Server}
                badge="Action"
              >
                <p className="text-sm mb-3 text-slate-300 font-bold">
                  "주문 받기"
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  로그인 버튼 클릭, 폼 제출 같은 사용자의 요청을 받아
                  처리합니다. (Server Actions)
                </p>
                <CodeWindow code={`async function login(data) {...}`} />
              </BentoCard>
            </div>
          </section>

          {/* 6. Prisma */}
          <section>
            <SectionHeader num="06." title="데이터 구조 관리 (Prisma)" />
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <BentoCard title="1. 설계도 (Schema)" icon={FileCode}>
                <p className="text-sm text-slate-300 mb-3">
                  데이터베이스의 구조를 정의하는 파일입니다. <br />
                  어떤 테이블에 어떤 데이터가 들어갈지 미리 약속합니다.
                </p>
                <CodeWindow
                  code={`model User {
  id    Int    @id
  email String @unique
}`}
                  title="schema.prisma"
                />
              </BentoCard>
              <BentoCard title="2. 조작 도구 (Client)" icon={Terminal}>
                <p className="text-sm text-slate-300 mb-3">
                  설계도를 바탕으로 만들어진 리모컨입니다. <br />
                  SQL을 몰라도 자바스크립트 코드로 DB를 조작할 수 있습니다.
                </p>
                <CodeWindow
                  code={`await prisma.user.create({
  data: { name: 'James' }
})`}
                  title="TypeScript"
                />
              </BentoCard>
            </div>

            <div className="bg-[#1E293B]/40 p-6 rounded-3xl border border-white/5">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Repeat className="text-blue-400" /> 왜 두 단계로 나누나요?
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-xl">
                  <span className="text-yellow-400 font-bold text-sm block mb-1">
                    버전 관리
                  </span>
                  <p className="text-xs text-slate-400">
                    설계도(Schema)가 코드에 남아있어, DB가 언제 어떻게
                    바뀌었는지 기록(History)을 남길 수 있습니다.
                  </p>
                </div>
                <div className="bg-black/20 p-4 rounded-xl">
                  <span className="text-green-400 font-bold text-sm block mb-1">
                    협업 용이성
                  </span>
                  <p className="text-xs text-slate-400">
                    여러 개발자가 같은 설계도를 공유하면, 각자의 컴퓨터에서도
                    동일한 DB 환경을 쉽게 만들 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Frontend */}
          <section>
            <SectionHeader num="07." title="프론트엔드: 사용자가 보는 화면" />
            <div className="grid md:grid-cols-3 gap-6">
              <BentoCard title="화면 그리기 (JSX)" icon={Code2}>
                <p className="text-sm mb-4 text-slate-300 leading-relaxed">
                  <strong>HTML과 JS의 결합</strong>입니다. <br />
                  마치 '스마트 문서'처럼, HTML 태그 사이에 데이터를 바로 꽂아
                  넣습니다.
                </p>
                <CodeWindow code={`<h1>안녕, {user.name}님!</h1>`} />
                <p className="text-xs text-slate-500 mt-2">
                  → 결과: 안녕, 제임스님!
                </p>
              </BentoCard>

              <BentoCard title="상태 관리 (Hooks)" icon={RefreshCw}>
                <p className="text-sm mb-4 text-slate-300 leading-relaxed">
                  <strong>화면의 자동 업데이트</strong>입니다. <br />
                  데이터(State)가 변하면, 화면에게 "새로 그려!"라고 명령하지
                  않아도 알아서 바뀝니다.
                </p>
                <div className="bg-slate-800 p-3 rounded-lg text-xs border border-slate-700 leading-relaxed">
                  <span className="text-slate-400">
                    좋아요 버튼 클릭 (데이터 +1)
                  </span>{" "}
                  <br />
                  ↓ <br />
                  <span className="text-green-400">
                    화면의 하트 숫자 즉시 변경
                  </span>
                </div>
              </BentoCard>

              <BentoCard title="디자인 (Tailwind)" icon={Palette}>
                <p className="text-sm mb-4 text-slate-300 leading-relaxed">
                  <strong>유틸리티 퍼스트 스타일링</strong>입니다. <br />
                  CSS 파일을 따로 만들지 않고, 미리 정의된 '디자인 블록'을
                  조립해서 씁니다.
                </p>
                <CodeWindow code={`<div className="bg-blue-500 p-4">`} />
                <p className="text-xs text-slate-500 mt-2">
                  → "파란 배경(bg-blue)에 여백(p-4)을 줘라"
                </p>
              </BentoCard>
            </div>
          </section>

          {/* 8. Database (With Actual Data) */}
          <section>
            <SectionHeader num="08." title="데이터베이스: 정보 저장소" />
            <div className="grid md:grid-cols-2 gap-6">
              <BentoCard title="Supabase (PostgreSQL)" icon={Database}>
                <p className="mb-4 text-sm text-slate-300">
                  가장 대중적인 <strong>관계형 데이터베이스</strong>입니다.{" "}
                  <br />
                  엑셀 시트처럼 행과 열로 데이터를 체계적으로 관리합니다.
                </p>
                <div className="space-y-2 text-xs font-mono bg-black/20 p-4 rounded-xl">
                  <div className="text-blue-400">User: id, name, email</div>
                  <div className="text-green-400">Post: id, title, content</div>
                  <div className="text-orange-400">
                    Order: id, userId, productId
                  </div>
                </div>
              </BentoCard>

              {/* ★ 실제 데이터 연동 부분 ★ */}
              <BentoCard
                title="실제 저장된 데이터 (Live)"
                icon={Activity}
                badge="Supabase"
              >
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {(guidePosts || []).length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    guidePosts?.map((post: any) => (
                      <div
                        key={post.id}
                        className="bg-slate-800/50 p-3 rounded-xl border border-white/5 hover:border-red-500/50 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-200">
                            {post.title}
                          </span>
                          <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                            {post.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {post.desc}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-600 border border-dashed border-slate-700 rounded-xl">
                      데이터가 없습니다.
                    </div>
                  )}
                </div>
              </BentoCard>
            </div>
          </section>

          {/* 9. Infra */}
          <section>
            <SectionHeader num="09." title="모던 인프라 (Infrastructure)" />
            <p className="text-slate-400 mb-6">
              최신 웹 앱은 필요한 기능을{" "}
              <strong className="text-white">
                최고의 서비스들로 조립(Composition)
              </strong>
              하여 사용합니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BentoCard title="대기열 (Queue)" icon={Layers} badge="Inngest">
                <p className="text-sm font-bold text-white mb-2">
                  "설거지는 나중에 몰아서 하기"
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  이메일 1만 통 발송처럼 시간이 오래 걸리는 작업은 사용자를
                  기다리게 하지 않고 <strong>백그라운드에서 천천히 처리</strong>
                  합니다.
                </p>
              </BentoCard>
              <BentoCard title="임시 저장 (Cache)" icon={Zap} badge="Redis">
                <p className="text-sm font-bold text-white mb-2">
                  "컨닝 페이퍼 만들기"
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  매번 데이터베이스를 뒤지면 느립니다. <br />한 번 조회한
                  데이터는 <strong>가까운 곳에 복사해두고</strong> 0.1초 만에
                  꺼내줍니다.
                </p>
              </BentoCard>
              <BentoCard
                title="실시간 통신 (Realtime)"
                icon={Radio}
                badge="Pusher"
              >
                <p className="text-sm font-bold text-white mb-2">
                  "전화 통화 하듯이"
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  새로고침을 안 해도 상대방이 보낸 채팅이{" "}
                  <strong>즉시 화면에 뜹니다.</strong> <br />
                  서버와 브라우저가 계속 연결되어 있기 때문입니다.
                </p>
              </BentoCard>
              <BentoCard title="인증/보안 (Auth)" icon={Lock} badge="Auth.js">
                <p className="text-sm font-bold text-white mb-2">
                  "아파트 경비실"
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  입주민(회원)인지 확인하고 문을 열어줍니다. <br />
                  구글/카카오 로그인 기능도 이 친구가 담당합니다.
                </p>
              </BentoCard>
            </div>
          </section>

          {/* 10. Deploy */}
          <section>
            <SectionHeader num="10." title="배포: 코드를 서버에 올리기" />

            {/* 배포 과정 흐름도 */}
            <div className="mb-8 flex flex-col md:flex-row gap-6 justify-between items-center bg-[#1E293B]/40 p-8 rounded-3xl border border-white/5 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center border border-slate-600">
                  <Code2 size={24} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">코드 작성</span>
                <span className="text-xs text-slate-500">로컬 개발</span>
              </div>

              <ArrowRight
                className="hidden md:block text-slate-500"
                size={24}
              />

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-blue-900/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                  <Package size={24} className="text-blue-400" />
                </div>
                <span className="text-sm font-bold text-white">Docker</span>
                <span className="text-xs text-slate-500">이미지 생성</span>
              </div>

              <ArrowRight
                className="hidden md:block text-slate-500"
                size={24}
              />

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-green-900/20 rounded-2xl flex items-center justify-center border border-green-500/30">
                  <Server size={24} className="text-green-400" />
                </div>
                <span className="text-sm font-bold text-white">
                  배포 (Deploy)
                </span>
                <span className="text-xs text-slate-500">서버 실행</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <BentoCard title="자동 배포 (Vercel)" icon={Cloud} badge="Easy">
                <p className="text-sm mb-4 text-slate-300">
                  <strong>가장 쉽고 빠른 방법</strong>입니다. (추천) <br />내
                  컴퓨터에서 저장 버튼만 누르면, 알아서 전 세계 서버에 내
                  사이트가 복사됩니다.
                </p>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="bg-white/5 p-2 rounded border border-white/5">
                    1. 코드 작성 (Local)
                  </div>
                  <div className="bg-white/5 p-2 rounded border border-white/5">
                    2. 저장 및 업로드 (Git Push)
                  </div>
                  <div className="bg-green-500/20 text-green-300 p-2 rounded border border-green-500/30">
                    3. 배포 완료 (URL 생성)
                  </div>
                </div>
              </BentoCard>
              <BentoCard
                title="직접 배포 (Docker)"
                icon={Package}
                badge="Custom"
              >
                <p className="text-sm mb-4 text-slate-300">
                  앱을 <strong>컨테이너 박스</strong>에 포장하는 기술입니다.{" "}
                  <br />
                  이사 갈 때 박스째로 옮기듯, 어떤 서버(AWS 등)로 옮겨도 똑같이
                  작동합니다.
                </p>
                <CodeWindow code={`docker build -t my-app .`} />
              </BentoCard>
            </div>
          </section>

          {/* 11. Domain & IP */}
          <section>
            <SectionHeader num="11." title="주소의 원리 (Domain & IP)" />
            <BentoCard className="bg-[#1E293B]/40 border-none">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="text-yellow-400 fill-current" size={20} />
                <span className="text-lg font-bold text-white">
                  쉬운 비유로 이해하기
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-3">🏠</div>
                  <div className="text-lg font-bold text-slate-200 mb-1">
                    도메인 = 집 주소
                  </div>
                  <div className="text-xs text-slate-500">
                    "서울시 강남구 123번지"
                  </div>
                  <div className="text-sm text-blue-400 mt-1">abc.com</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-3">📍</div>
                  <div className="text-lg font-bold text-slate-200 mb-1">
                    IP = GPS 좌표
                  </div>
                  <div className="text-xs text-slate-500">
                    "37.5665, 126.9780"
                  </div>
                  <div className="text-sm text-blue-400 mt-1">123.45.67.89</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-3">🏢</div>
                  <div className="text-lg font-bold text-slate-200 mb-1">
                    서버 = 실제 건물
                  </div>
                  <div className="text-xs text-slate-500">
                    "데이터센터의 컴퓨터"
                  </div>
                  <div className="text-sm text-blue-400 mt-1">AWS / Vercel</div>
                </div>
              </div>
            </BentoCard>
          </section>

          {/* 12. HTTP */}
          <section>
            <SectionHeader num="12." title="통신 구조 (HTTP)" />
            <div className="grid md:grid-cols-2 gap-6">
              <BentoCard title="요청 (Request)" icon={Activity}>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                    <span className="text-green-400 font-bold">GET</span>{" "}
                    <span>강의 목록 보여줘</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                    <span className="text-yellow-400 font-bold">POST</span>{" "}
                    <span>로그인 시켜줘</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                    <span className="text-blue-400 font-bold">PUT</span>{" "}
                    <span>내 정보 수정해줘</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                    <span className="text-red-400 font-bold">DELETE</span>{" "}
                    <span>댓글 삭제해줘</span>
                  </div>
                </div>
              </BentoCard>
              <BentoCard title="응답 (Response)" icon={ShieldCheck}>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                    <span className="text-green-400 font-bold">200 OK</span>{" "}
                    <span>성공! 여기 데이터 있어</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                    <span className="text-blue-400 font-bold">
                      302 Redirect
                    </span>{" "}
                    <span>이쪽으로 이동해</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                    <span className="text-orange-400 font-bold">
                      404 Not Found
                    </span>{" "}
                    <span>그런 페이지 없는데?</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                    <span className="text-red-400 font-bold">500 Error</span>{" "}
                    <span>서버가 고장났어</span>
                  </div>
                </div>
              </BentoCard>
            </div>
          </section>

          {/* 13. React Native */}
          <section>
            <SectionHeader num="13." title="앱으로 확장 (React Native)" />

            <div className="grid md:grid-cols-2 gap-6">
              {/* 왼쪽: 설명 및 변환 구조 */}
              <div className="bg-[#1E293B]/40 p-8 rounded-3xl border border-white/5 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  하나의 코드로 웹 + 앱
                </h3>
                <p className="text-sm text-slate-400 mb-8">
                  별도의 앱 개발 언어(Swift, Kotlin)를 몰라도 됩니다. <br />웹
                  코드를 재사용하여 <strong>Google Play</strong>와{" "}
                  <strong>App Store</strong>에 출시합니다.
                </p>

                <div className="flex justify-center items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/30">
                      <Layers size={24} className="text-red-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-300">
                      Web
                    </span>
                  </div>

                  <ArrowRight className="text-slate-600" size={20} />

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                      <Zap size={24} className="text-yellow-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-300">
                      Expo
                    </span>
                  </div>

                  <ArrowRight className="text-slate-600" size={20} />

                  <div className="flex gap-2">
                    <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center border border-slate-600">
                      <Smartphone size={20} className="text-white" />
                    </div>
                    <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center border border-green-500/30">
                      <Smartphone size={20} className="text-green-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 네이티브 기능 리스트 */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-slate-400 mb-1 ml-2">
                  네이티브 기능 연동
                </h4>
                <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-red-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                    <Bell size={20} />
                  </div>
                  <div>
                    <strong className="block text-slate-200 text-sm">
                      푸시 알림
                    </strong>
                    <span className="text-xs text-slate-500">
                      앱을 꺼도 알림이 팝업됨 (FCM)
                    </span>
                  </div>
                </div>
                <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-blue-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Bluetooth size={20} />
                  </div>
                  <div>
                    <strong className="block text-slate-200 text-sm">
                      블루투스
                    </strong>
                    <span className="text-xs text-slate-500">
                      스마트 워치나 IoT 기기 연결
                    </span>
                  </div>
                </div>
                <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-yellow-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                    <Camera size={20} />
                  </div>
                  <div>
                    <strong className="block text-slate-200 text-sm">
                      카메라 / 갤러리
                    </strong>
                    <span className="text-xs text-slate-500">
                      사진을 찍어서 바로 업로드
                    </span>
                  </div>
                </div>
                <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-green-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                    <Navigation size={20} />
                  </div>
                  <div>
                    <strong className="block text-slate-200 text-sm">
                      위치 정보 (GPS)
                    </strong>
                    <span className="text-xs text-slate-500">
                      현재 위치 기반 지도 서비스
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 14. Folder Structure */}
          <section>
            <SectionHeader num="14." title="프로젝트 폴더 구조" />
            <div className="bg-[#020617] rounded-3xl p-8 border border-slate-800 font-mono text-sm shadow-2xl overflow-hidden">
              <div className="space-y-4">
                {/* app */}
                <div>
                  <div className="flex items-center gap-2 text-yellow-500 font-bold group cursor-pointer hover:text-yellow-400 transition-colors">
                    <Folder
                      size={18}
                      fill="currentColor"
                      className="fill-yellow-500/20"
                    />
                    app/
                    <span className="text-slate-500 font-normal text-xs ml-2">
                      ← 핵심 코드 (페이지들)
                    </span>
                  </div>
                  <div className="pl-6 border-l border-slate-800 ml-2.5 mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
                      <FileCode size={14} className="text-blue-400" />{" "}
                      layout.tsx{" "}
                      <span className="text-slate-600 text-xs ml-auto md:ml-2">
                        # 공통 레이아웃 (헤더/푸터)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
                      <FileCode size={14} className="text-blue-400" /> page.tsx{" "}
                      <span className="text-slate-600 text-xs ml-auto md:ml-2">
                        # 메인 페이지
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-500">
                      <Folder size={14} /> api/{" "}
                      <span className="text-slate-600 text-xs ml-auto md:ml-2">
                        # 서버 API
                      </span>
                    </div>
                  </div>
                </div>

                {/* components */}
                <div>
                  <div className="flex items-center gap-2 text-yellow-500 font-bold group cursor-pointer hover:text-yellow-400 transition-colors">
                    <Folder
                      size={18}
                      fill="currentColor"
                      className="fill-yellow-500/20"
                    />
                    components/
                    <span className="text-slate-500 font-normal text-xs ml-2">
                      ← UI 조각들
                    </span>
                  </div>
                  <div className="pl-6 border-l border-slate-800 ml-2.5 mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
                      <FileCode size={14} className="text-blue-400" />{" "}
                      Button.tsx{" "}
                      <span className="text-slate-600 text-xs ml-auto md:ml-2">
                        # 버튼 컴포넌트
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
                      <FileCode size={14} className="text-blue-400" />{" "}
                      Navbar.tsx{" "}
                      <span className="text-slate-600 text-xs ml-auto md:ml-2">
                        # 상단 메뉴바
                      </span>
                    </div>
                  </div>
                </div>

                {/* lib */}
                <div>
                  <div className="flex items-center gap-2 text-yellow-500 font-bold group cursor-pointer hover:text-yellow-400 transition-colors">
                    <Folder
                      size={18}
                      fill="currentColor"
                      className="fill-yellow-500/20"
                    />
                    lib/
                    <span className="text-slate-500 font-normal text-xs ml-2">
                      ← 도구 모음
                    </span>
                  </div>
                  <div className="pl-6 border-l border-slate-800 ml-2.5 mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
                      <FileCode size={14} className="text-blue-400" /> prisma.ts{" "}
                      <span className="text-slate-600 text-xs ml-auto md:ml-2">
                        # DB 연결 설정
                      </span>
                    </div>
                  </div>
                </div>

                {/* public */}
                <div>
                  <div className="flex items-center gap-2 text-yellow-500 font-bold group cursor-pointer hover:text-yellow-400 transition-colors">
                    <Folder
                      size={18}
                      fill="currentColor"
                      className="fill-yellow-500/20"
                    />
                    public/
                    <span className="text-slate-500 font-normal text-xs ml-2">
                      ← 이미지/폰트
                    </span>
                  </div>
                  <div className="pl-6 border-l border-slate-800 ml-2.5 mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-yellow-500">
                      <Folder size={14} /> images/{" "}
                      <span className="text-slate-600 text-xs ml-auto md:ml-2">
                        # 이미지 폴더
                      </span>
                    </div>
                  </div>
                </div>

                {/* root files */}
                <div className="pt-2 border-t border-slate-800/50 space-y-2">
                  <div className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors">
                    <FileJson size={14} className="text-purple-400" />{" "}
                    package.json{" "}
                    <span className="text-slate-600 text-xs ml-auto md:ml-2">
                      ← 설치 목록
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
                    <Settings size={14} className="text-blue-400" />{" "}
                    next.config.js{" "}
                    <span className="text-slate-600 text-xs ml-auto md:ml-2">
                      ← 환경 설정
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

      </div>
    </div>
  );
}
