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
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[rgba(11,10,12,0.88)] px-5 py-3 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center gap-6">
            <a href="/" className="text-base font-semibold tracking-[0.22em] text-[var(--paper)] transition-colors hover:text-[var(--gold)]">
              入画
            </a>
            <a href="/gallery" className="text-xs tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--paper)]">
              画廊
            </a>
            <a href="/about" className="text-xs tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--paper)]">
              关于
            </a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-[var(--border)] px-6 py-5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 text-center text-xs text-[var(--muted)] sm:flex-row sm:gap-4">
            <span>入画 · A research prototype on AI-assisted visual interpretation</span>
            <span className="hidden text-[var(--border)] sm:inline">/</span>
            <span>
              网页与系统设计:{" "}
              <a
                href="https://github.com/suzakuzhang/rupainting"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--paper-dim)] underline underline-offset-4 transition-colors hover:text-[var(--gold)]"
              >
                ShuminZhang
              </a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
