import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd());
const RESEARCH_FILE = path.join(DATA_DIR, "research_data.json");

export interface ResearchInterpretationRecord {
  id: string;
  viewId: string;
  capturedAt: string;
  role: string;
  userId: string;
  paintingId: string;
  paintingTitle: string;
  mode: string;
  question: string;
  roamEntry?: string;
  model: string;
  promptVersion: string;
  systemPrompt: string;
  userPrompt: string;
  result: unknown;
}

interface ResearchStore {
  interpretationRecords: ResearchInterpretationRecord[];
}

function load(): ResearchStore {
  try {
    if (fs.existsSync(RESEARCH_FILE)) {
      const raw = fs.readFileSync(RESEARCH_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        interpretationRecords: parsed.interpretationRecords ?? [],
      };
    }
  } catch {
    // ignore malformed file and fall back to empty store
  }

  return {
    interpretationRecords: [],
  };
}

function save(store: ResearchStore): void {
  fs.writeFileSync(RESEARCH_FILE, JSON.stringify(store, null, 2), "utf-8");
}

function utcNow(): string {
  return new Date().toISOString();
}

export function saveResearchInterpretation(
  record: Omit<ResearchInterpretationRecord, "id" | "capturedAt"> & { capturedAt?: string }
): ResearchInterpretationRecord {
  const viewId = record.viewId.trim();
  if (!viewId) {
    throw new Error("缺少 viewId");
  }

  const store = load();
  const row: ResearchInterpretationRecord = {
    ...record,
    viewId,
    id: `interpret_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    capturedAt: record.capturedAt ?? utcNow(),
  };
  store.interpretationRecords.push(row);
  if (store.interpretationRecords.length > 1000) {
    store.interpretationRecords = store.interpretationRecords.slice(-1000);
  }
  save(store);
  return row;
}

export function exportResearchData(): {
  interpretationRecords: ResearchInterpretationRecord[];
  counts: { interpretationRecords: number };
} {
  const store = load();
  const interpretationRecords = store.interpretationRecords
    .slice()
    .sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));

  return {
    interpretationRecords,
    counts: {
      interpretationRecords: interpretationRecords.length,
    },
  };
}
