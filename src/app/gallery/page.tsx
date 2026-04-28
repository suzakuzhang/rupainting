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
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">画廊</h1>
        <p className="text-sm text-[var(--muted)]">
          初始画库为八大山人（朱耷，约 1626—1705）册页。点击一幅作品进入解读。
        </p>
      </section>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPaintings(query, activeSubject)}
            placeholder="搜索标题、收藏地、画面元素…"
            className="flex-1 border border-[var(--border)] rounded px-3 py-2 text-sm"
          />
          <button
            onClick={() => fetchPaintings(query, activeSubject)}
            className="px-4 py-2 bg-[#1a1a1a] text-white rounded text-sm"
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
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)]"
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
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)]"
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
              className="group block border border-[var(--border)] rounded overflow-hidden hover:border-[var(--foreground)] transition-colors"
            >
              <div className="aspect-[4/5] bg-gray-50 overflow-hidden">
                <img
                  src={p.image_path}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-medium leading-tight">{p.title}</h3>
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
