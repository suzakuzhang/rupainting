export default function Home() {
  return (
    <div className="min-h-[calc(100vh-104px)]">
      <section className="relative isolate overflow-hidden border-b border-[var(--border)]">
        <img
          src="/paintings/bada/raw/page-007-006.jpg"
          alt=""
          className="absolute inset-y-0 right-0 -z-10 h-full w-full object-cover opacity-18 blur-[1px] saturate-50 md:w-1/2 md:opacity-35"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_28%,rgba(199,169,104,0.16),transparent_34%),linear-gradient(90deg,var(--ink)_0%,rgba(8,8,6,0.96)_48%,rgba(8,8,6,0.58)_100%)]" />

        <div className="mx-auto grid min-h-[72vh] max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[0.95fr_1.05fr]">
          <div className="ink-rise max-w-2xl space-y-7">
            <p className="text-xs tracking-[0.42em] text-[var(--muted)]">AI-MEDIATED LOOKING</p>
            <h1 className="text-5xl font-medium tracking-[0.24em] text-[var(--paper)] md:text-7xl">入画</h1>
            <p className="max-w-xl text-lg leading-9 text-[var(--paper-dim)]">
              一个陪你读画的系统。它不急着解释画是什么，而是让画面、笔墨、题跋与印章留在眼前，
              带你一步一步训练观看。
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="/gallery" className="btn-ink rounded-full px-6 py-3 text-sm font-medium tracking-[0.12em]">
                进入画廊
              </a>
              <a
                href="/painting/bada-001"
                className="rounded-full border border-[var(--border)] px-6 py-3 text-sm tracking-[0.12em] text-[var(--paper-dim)] transition-colors hover:border-[var(--gold)] hover:text-[var(--paper)]"
              >
                读今日一画
              </a>
            </div>
          </div>

          <div className="surface-ink ink-rise rounded-[6px] p-4 md:p-5">
            <div className="overflow-hidden rounded-[4px] bg-black/30">
              <img
                src="/paintings/bada/raw/page-007-006.jpg"
                alt="八大山人册页"
                className="mx-auto max-h-[64vh] w-full object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-xs text-[var(--muted)]">
              <span>八大山人 · 册页</span>
              <span className="text-[var(--gold)]">画面常驻 · 导览在侧</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-10 md:grid-cols-4">
        {[
          ["初见", "亲切导览，不堆术语"],
          ["深读", "笔墨、题跋、史料细读"],
          ["画中漫游", "从一个视觉入口进入画面"],
          ["研究笔记", "可保存的 Markdown 观察"],
        ].map(([title, body]) => (
          <div key={title} className="border-l border-[var(--border)] py-2 pl-4">
            <h2 className="text-sm font-medium tracking-[0.18em] text-[var(--paper)]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
