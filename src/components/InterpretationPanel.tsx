"use client";

import type { ReadingMode } from "@/types/painting";

interface SevenLayerOutput {
  first_glance: string;
  viewing_path: string;
  brushwork_and_space: string;
  inscriptions_and_seals: string;
  symbol_and_context: string;
  emotional_field: string;
  follow_up_questions: string[];
}

interface RoamOutput {
  entry_point: string;
  walk_through: string;
  visual_anchor_back: string;
}

interface NotesOutput {
  markdown: string;
}

interface InterpretationPanelProps {
  mode: ReadingMode;
  result: SevenLayerOutput | RoamOutput | NotesOutput;
  onFollowUp?: (question: string) => void;
}

const LAYER_LABELS: { key: keyof SevenLayerOutput; label: string }[] = [
  { key: "first_glance", label: "第一眼看见什么" },
  { key: "viewing_path", label: "观看路线" },
  { key: "brushwork_and_space", label: "笔墨与空间" },
  { key: "inscriptions_and_seals", label: "题跋、印章与观看史" },
  { key: "symbol_and_context", label: "象征与文化语境" },
  { key: "emotional_field", label: "这幅画的情绪" },
];

export default function InterpretationPanel({ mode, result, onFollowUp }: InterpretationPanelProps) {
  if (mode === "roam") {
    const r = result as RoamOutput;
    return (
      <article className="space-y-6">
        <Section label="入口" body={r.entry_point} />
        <Section label="沿路所见" body={r.walk_through} />
        <Section label="回到画面" body={r.visual_anchor_back} />
      </article>
    );
  }

  if (mode === "notes") {
    const r = result as NotesOutput;
    return (
      <article className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--muted)]">研究笔记 (Markdown)</h3>
          <button
            onClick={() => navigator.clipboard.writeText(r.markdown)}
            className="text-xs text-[var(--muted)] underline hover:text-[var(--foreground)]"
          >
            复制全文
          </button>
        </div>
        <pre className="text-sm leading-7 whitespace-pre-wrap bg-gray-50 p-4 rounded border border-[var(--border)] font-mono overflow-x-auto">
          {r.markdown}
        </pre>
      </article>
    );
  }

  // beginner / scholar — 7-layer
  const r = result as SevenLayerOutput;
  return (
    <article className="space-y-6">
      {LAYER_LABELS.map(({ key, label }) => {
        const text = r[key];
        if (!text || typeof text !== "string") return null;
        return <Section key={key} label={label} body={text} />;
      })}

      {Array.isArray(r.follow_up_questions) && r.follow_up_questions.length > 0 && (
        <section className="space-y-2 pt-3 border-t border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--muted)]">你可以继续问</h3>
          <div className="space-y-2">
            {r.follow_up_questions.map((q, i) => (
              <button
                key={i}
                onClick={() => onFollowUp?.(q)}
                disabled={!onFollowUp}
                className="block w-full text-left text-sm leading-relaxed border border-[var(--border)] rounded px-3 py-2 hover:border-[var(--foreground)] hover:bg-gray-50 disabled:cursor-default disabled:hover:border-[var(--border)] disabled:hover:bg-transparent transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Section({ label, body }: { label: string; body: string }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold text-[var(--muted)]">{label}</h3>
      <p className="text-base leading-8 whitespace-pre-wrap">{body}</p>
    </section>
  );
}
