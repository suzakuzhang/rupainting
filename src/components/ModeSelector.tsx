"use client";

import type { ReadingMode } from "@/types/painting";

interface ModeSelectorProps {
  value: ReadingMode;
  onChange: (mode: ReadingMode) => void;
}

const MODES: { id: ReadingMode; label: string; description: string }[] = [
  {
    id: "beginner",
    label: "初见",
    description: "像美术馆导览员，亲切，不堆术语。约 600-900 字。",
  },
  {
    id: "scholar",
    label: "深读",
    description: "博雅的学术细读，引用画论与史料。约 1500-2500 字。",
  },
  {
    id: "roam",
    label: "画中漫游",
    description: "第二人称引导，从画面某处入口进入。约 500-800 字。",
  },
  {
    id: "notes",
    label: "研究笔记",
    description: "可保存的 Markdown 模板，给写文章用。",
  },
];

export default function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`text-left p-3 rounded border transition-colors ${
            value === m.id
              ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
              : "border-[var(--border)] hover:border-[var(--foreground)]"
          }`}
        >
          <div className="font-medium text-sm">{m.label}</div>
          <div className={`text-xs mt-1 leading-relaxed ${value === m.id ? "opacity-80" : "text-[var(--muted)]"}`}>
            {m.description}
          </div>
        </button>
      ))}
    </div>
  );
}
