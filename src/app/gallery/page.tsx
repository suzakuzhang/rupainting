"use client";

import { useEffect, useState } from "react";

interface PaintingBrief {
  id: string;
  title: string;
  alt_titles?: string[];
  series: string | null;
  image_path: string;
  medium: string;
  dimensions: string;
  format: string;
  collection: string;
  approximate_date?: string;
  subject_class: string[];
  reading_lenses: string[];
}

export default function GalleryPage() {
  const [items, setItems] = useState<PaintingBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState<string>("");

  const fetchPaintings = async (q = "", subject = "") => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (subject) params.set("subject", subject);
    const res = await fetch(`/api/paintings?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.items ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPaintings();
  }, []);

  // Aggregate subject classes from current items for filter chips
  const allSubjects = Array.from(
    new Set(items.flatMap((p) => p.subject_class))
  ).sort();

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-6 py-9">
      <section className="flex flex-col gap-3 border-b border-[var(--border)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs tracking-[0.34em] text-[var(--muted)]">GALLERY</p>
          <h1 className="mt-2 text-3xl font-medium tracking-[0.16em] text-[var(--paper)]">画廊</h1>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
          初始画库为八大山人（朱耷，约 1626—1705）册页。选择一幅作品后，画面会常驻在观画室里。
        </p>
      </section>

      {/* Search + Filters */}
      <div className="surface-ink space-y-3 rounded-[6px] p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPaintings(query, activeSubject)}
            placeholder="搜索标题、收藏地、画面元素…"
            className="field-ink flex-1 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={() => fetchPaintings(query, activeSubject)}
            className="btn-ink rounded px-4 py-2 text-sm"
          >
            搜索
          </button>
        </div>

        {allSubjects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveSubject("");
                fetchPaintings(query, "");
              }}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                activeSubject === ""
                  ? "border-[var(--gold)] bg-[rgba(199,169,104,0.16)] text-[var(--paper)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--paper)]"
              }`}
            >
              全部
            </button>
            {allSubjects.map((s) => (
              <button
                key={s}
                onClick={() => {
                  const next = activeSubject === s ? "" : s;
                  setActiveSubject(next);
                  fetchPaintings(query, next);
                }}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  activeSubject === s
                    ? "border-[var(--gold)] bg-[rgba(199,169,104,0.16)] text-[var(--paper)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--paper)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-sm text-[var(--muted)]">加载中…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">没有匹配的画作。</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((p) => (
            <a
              key={p.id}
              href={`/painting/${p.id}`}
              className="group surface-ink block overflow-hidden rounded-[6px] transition-colors hover:border-[var(--gold)]"
            >
              <div className="aspect-[4/5] overflow-hidden bg-black/30">
                <img
                  src={p.image_path}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-medium leading-tight text-[var(--paper)]">{p.title}</h3>
                <p className="text-xs text-[var(--muted)] truncate">{p.collection}</p>
                <p className="text-xs text-[var(--muted)]">{p.medium} · {p.dimensions}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
