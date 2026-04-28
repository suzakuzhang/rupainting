import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "入画 — 中国画导览式解读系统",
  description: "基于何慕文《如何读中国画》方法论的视觉文化导览原型。不预言、不算命——训练观看路径，进入作品。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <header className="border-b border-[var(--border)] px-6 py-4">
          <nav className="max-w-5xl mx-auto flex items-center gap-6">
            <a href="/" className="text-lg font-semibold tracking-wide">
              入画
            </a>
            <a href="/gallery" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              画廊
            </a>
            <a href="/about" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              关于
            </a>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] px-6 py-4 mt-8">
          <div className="max-w-5xl mx-auto text-center text-xs text-[var(--muted)]">
            <span>入画 · A research prototype on AI-assisted visual interpretation</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
