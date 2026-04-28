export type ReadingMode = "beginner" | "scholar" | "roam" | "notes";

export interface Painting {
  id: string;
  title: string;
  alt_titles?: string[];
  series: string | null;
  series_part?: string | null;
  image_path: string;
  thumbnail_path?: string;
  medium: string;
  dimensions: string;
  format: string;
  collection: string;
  approximate_date?: string;
  dated?: boolean;
  subject_class: string[];
  visible_elements: string;
  composition_notes: string;
  brushwork_notes: string;
  inscription?: string;
  seals_visible?: string;
  reading_lenses: string[];
  emotional_field: string[];
  research_notes?: string;
}

export interface SkeletonPainting {
  id: string;
  title: string;
  image: string;
  collection: string;
  dated?: string;
}

export interface Artist {
  id: string;
  name: string;
  given_name: string;
  alt_names: string[];
  dates: string;
  origin: string;
  background: string;
  stylistic_lineage: {
    landscape: string[];
    flower_bird: string[];
    calligraphy: string[];
  };
  key_motifs: string[];
  key_concepts: string[];
  key_periods: { year_range: string; phase: string; note: string }[];
}

export interface PaintingsCorpus {
  schema_version: number;
  source: {
    title: string;
    publisher: string;
    year: number;
    isbn: string;
    editor_preface: string;
  };
  artist: Artist;
  default_seal_legend: Record<string, string>;
  paintings: Painting[];
  skeleton_paintings_to_add_later?: SkeletonPainting[];
}

export interface InterpretationResult {
  first_glance: string;
  viewing_path: string;
  brushwork_and_space: string;
  inscriptions_and_seals: string;
  symbol_and_context: string;
  emotional_field: string;
  follow_up_questions: string[];
}

export interface ResearchNotesResult {
  markdown: string;
}

export interface RoamResult {
  entry_point: string;
  walk_through: string;
  visual_anchor_back: string;
}
