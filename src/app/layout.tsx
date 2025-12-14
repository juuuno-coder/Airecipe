import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Recipe",
  description: "Share and discover AI workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Global Background Ambience */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-1">
              {children}
            </main>
            <Toaster 
              position="top-center" 
              richColors 
              closeButton 
              expand={true}
              toastOptions={{
                classNames: {
                  error: 'bg-red-600 border-red-500 text-white font-medium shadow-lg shadow-red-900/20',
                  success: 'bg-green-600 border-green-500 text-white font-medium shadow-lg shadow-green-900/20',
                  warning: 'bg-yellow-600 border-yellow-500 text-white font-medium',
                  info: 'bg-blue-600 border-blue-500 text-white font-medium',
                },
                style: {
                    marginTop: '20px',
                    padding: '12px 16px',
                }
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
