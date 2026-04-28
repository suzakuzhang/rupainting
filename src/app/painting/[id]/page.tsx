"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ModeSelector from "@/components/ModeSelector";
import InterpretationPanel from "@/components/InterpretationPanel";
import LoadingOverlay from "@/components/LoadingOverlay";
import SpiritPanel from "@/components/SpiritPanel";
import type { Painting, ReadingMode, Artist } from "@/types/painting";

interface PaintingResponse {
  painting: Painting;
  artist: Artist;
  source: { title: string; publisher: string; year: number };
}

interface InterpretResponse {
  mode: ReadingMode;
  paintingId: string;
  result: unknown;
}

function genViewId(): string {
  return `view_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function PaintingPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<PaintingResponse | null>(null);
  const [mode, setMode] = useState<ReadingMode>("beginner");
  const [question, setQuestion] = useState("");
  const [roamEntry, setRoamEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterpretResponse | null>(null);
  const [error, setError] = useState("");
  const [viewId, setViewId] = useState("");

  useEffect(() => {
    fetch(`/api/paintings/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
        } else {
          setData(d);
        }
      })
      .catch(() => setError("加载失败"));
  }, [params.id]);

  const submit = async () => {
    if (!data) return;
    setLoading(true);
    setError("");
    setResult(null);

    const newViewId = genViewId();
    setViewId(newViewId);

    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paintingId: data.painting.id,
          mode,
          question: question.trim() || undefined,
          roamEntry: mode === "roam" ? (roamEntry.trim() || undefined) : undefined,
          viewId: newViewId,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "解读失败");
      } else {
        setResult(json);
      }
    } catch {
      setError("网络错误");
    }
    setLoading(false);
  };

  const onFollowUp = (q: string) => {
    setQuestion(q);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  if (error && !data) {
    return <p className="text-sm text-red-600">{error}</p>;
  }
  if (!data) {
    return <p className="text-sm text-[var(--muted)]">加载中…</p>;
  }

  const p = data.painting;
  const a = data.artist;
  // For spirit panel context, summarize current interpretation if any (best-effort)
  const interpretationSummary = result
    ? (() => {
        const r = result.result as Record<string, unknown>;
        const fragments: string[] = [];
        for (const k of ["first_glance", "viewing_path", "emotional_field", "entry_point", "walk_through"]) {
          const v = r[k];
          if (typeof v === "string") fragments.push(v.slice(0, 200));
        }
        return fragments.join(" / ").slice(0, 800) || undefined;
      })()
    : undefined;

  return (
    <div className="space-y-8">
      {/* Painting header */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[var(--border)] rounded overflow-hidden bg-gray-50">
          <img src={p.image_path} alt={p.title} className="w-full h-auto" />
        </div>
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-semibold leading-tight">{p.title}</h1>
            {p.alt_titles && p.alt_titles.length > 0 && (
              <p className="text-sm text-[var(--muted)] mt-1">别题：{p.alt_titles.join("、")}</p>
            )}
          </div>
          <dl className="text-sm space-y-1.5 text-[var(--muted)]">
            <div><dt className="inline text-[var(--foreground)]">画家：</dt><dd className="inline">{a.name}（{a.given_name}，{a.dates}）</dd></div>
            <div><dt className="inline text-[var(--foreground)]">材质：</dt><dd className="inline">{p.medium}</dd></div>
            <div><dt className="inline text-[var(--foreground)]">尺寸：</dt><dd className="inline">{p.dimensions}</dd></div>
            <div><dt className="inline text-[var(--foreground)]">形制：</dt><dd className="inline">{p.format}</dd></div>
            <div><dt className="inline text-[var(--foreground)]">收藏：</dt><dd className="inline">{p.collection}</dd></div>
            {p.approximate_date && (
              <div><dt className="inline text-[var(--foreground)]">年代：</dt><dd className="inline">{p.approximate_date}</dd></div>
            )}
          </dl>

          {p.subject_class.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {p.subject_class.map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-[var(--muted)]">{s}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mode selector */}
      <section className="space-y-3 border-t border-[var(--border)] pt-6">
        <h2 className="text-base font-semibold">选一种读法</h2>
        <ModeSelector value={mode} onChange={setMode} />
      </section>

      {/* Question / Roam entry */}
      <section className="space-y-3">
        {mode === "roam" ? (
          <>
            <label className="block text-sm font-medium">从哪里进入画面？</label>
            <input
              type="text"
              value={roamEntry}
              onChange={(e) => setRoamEntry(e.target.value)}
              placeholder="例如：从右下角的鸟眼进入 / 从这方乾隆印进入 / 从枝头那滴墨进入（可留空让系统选）"
              className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm"
            />
          </>
        ) : (
          <>
            <label className="block text-sm font-medium">你想带着什么问题来看这幅画？（可留空）</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="例如：八大山人的鸟为什么要翻白眼？/ 这幅画的留白比墨色更让我紧张——为什么？"
              className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm resize-none"
            />
          </>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="px-6 py-2.5 bg-[#1a1a1a] text-white rounded text-sm font-medium disabled:opacity-50 hover:bg-[#000] transition-colors"
        >
          {loading ? "正在读画…" : "开始读画"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </section>

      {/* Loading */}
      {loading && (
        <section className="border-t border-[var(--border)] pt-6">
          <LoadingOverlay visible={loading} paintingTitle={p.title} />
        </section>
      )}

      {/* Result */}
      {result && !loading && (
        <section className="space-y-6 border-t border-[var(--border)] pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">解读 · {modeLabel(result.mode)}</h2>
            <button
              onClick={() => {
                setResult(null);
                setQuestion("");
                setRoamEntry("");
              }}
              className="text-xs text-[var(--muted)] underline hover:text-[var(--foreground)]"
            >
              换一种读法
            </button>
          </div>
          <InterpretationPanel
            mode={result.mode}
            result={result.result as never}
            onFollowUp={onFollowUp}
          />

          {/* Spirit panel — only after a successful interpretation */}
          <div className="pt-6 border-t border-[var(--border)]">
            <SpiritPanel
              viewId={viewId}
              paintingId={p.id}
              paintingTitle={p.title}
              question={question}
              initialInterpretation={interpretationSummary}
            />
          </div>
        </section>
      )}
    </div>
  );
}

function modeLabel(mode: ReadingMode): string {
  switch (mode) {
    case "beginner": return "初见";
    case "scholar": return "深读";
    case "roam": return "画中漫游";
    case "notes": return "研究笔记";
  }
}
