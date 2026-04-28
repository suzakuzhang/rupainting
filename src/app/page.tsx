export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">入画</h1>
        <p className="text-[var(--muted)] leading-relaxed text-base">
          一个陪你读画的系统。它不告诉你画的是什么，它带你看见画家如何观察世界、笔墨如何承载精神、
          题跋印章如何记录千百年的观看史。
        </p>
        <p className="text-[var(--muted)] leading-relaxed text-sm">
          方法论底座来自何慕文《如何读中国画 · 大都会艺术博物馆藏中国书画精品导览》。
          画作锚点：八大山人册页（明末清初遗民艺术家）。
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="/gallery"
          className="block border border-[var(--border)] rounded-lg p-6 hover:border-[var(--accent)] transition-colors"
        >
          <h2 className="font-semibold mb-2">读一幅画</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            从画库选择一幅作品，按你想要的深度解读
          </p>
        </a>

        <a
          href="/learn"
          className="block border border-[var(--border)] rounded-lg p-6 hover:border-[var(--accent)] transition-colors"
        >
          <h2 className="font-semibold mb-2">学怎么看</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            系统挑一幅作品，带你一步步进入画面
          </p>
          <p className="text-xs text-[var(--muted)] mt-2 italic">即将上线</p>
        </a>

        <a
          href="/roam"
          className="block border border-[var(--border)] rounded-lg p-6 hover:border-[var(--accent)] transition-colors"
        >
          <h2 className="font-semibold mb-2">画中漫游</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            让你的视线进入画面，从某个具体入口走起
          </p>
          <p className="text-xs text-[var(--muted)] mt-2 italic">即将上线</p>
        </a>
      </div>

      <section className="space-y-3 pt-4 border-t border-[var(--border)]">
        <h3 className="text-sm font-semibold">四种模式</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--muted)]">
          <div><strong className="text-[var(--foreground)]">初见</strong>：像美术馆导览员，亲切，不堆术语</div>
          <div><strong className="text-[var(--foreground)]">深读</strong>：博雅的学术细读，引用画论与史料</div>
          <div><strong className="text-[var(--foreground)]">画中漫游</strong>：第二人称引导，进入画面空间</div>
          <div><strong className="text-[var(--foreground)]">研究笔记</strong>：可保存的 Markdown，给写文章用</div>
        </div>
      </section>

      <section className="text-xs text-[var(--muted)] space-y-1 pt-4 border-t border-[var(--border)]">
        <p>本项目是视觉文化解释的研究原型，不构成任何占卜、命运或心理咨询服务。</p>
        <p>所有解读都基于画面证据与何慕文方法论框架。当 AI 越界时请反馈给我们。</p>
        <p className="pt-2">
          <a href="/admin" className="underline hover:text-[var(--foreground)]">管理后台</a>
        </p>
      </section>
    </div>
  );
}
