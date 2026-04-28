import corpus from "@/data/paintings_data.json";
import type { Painting, PaintingsCorpus } from "@/types/painting";

const data = corpus as PaintingsCorpus;

export function getCorpus(): PaintingsCorpus {
  return data;
}

export function getArtist() {
  return data.artist;
}

export function listPaintings(): Painting[] {
  return data.paintings;
}

export function listPaintingBriefs() {
  return data.paintings.map((p) => ({
    id: p.id,
    title: p.title,
    alt_titles: p.alt_titles,
    series: p.series,
    image_path: p.thumbnail_path ?? p.image_path,
    medium: p.medium,
    dimensions: p.dimensions,
    format: p.format,
    collection: p.collection,
    approximate_date: p.approximate_date,
    subject_class: p.subject_class,
    reading_lenses: p.reading_lenses,
  }));
}

export function getPainting(id: string): Painting | null {
  return data.paintings.find((p) => p.id === id) ?? null;
}

export function listLenses(): { id: string; label: string }[] {
  const lensSet = new Set<string>();
  for (const p of data.paintings) {
    for (const lens of p.reading_lenses) lensSet.add(lens);
  }
  return Array.from(lensSet)
    .sort()
    .map((id) => ({ id, label: id }));
}

export function listSubjectClasses(): string[] {
  const set = new Set<string>();
  for (const p of data.paintings) {
    for (const c of p.subject_class) set.add(c);
  }
  return Array.from(set).sort();
}

export function searchPaintings(query: string): Painting[] {
  const q = query.toLowerCase().trim();
  if (!q) return data.paintings;
  return data.paintings.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      (p.alt_titles ?? []).some((t) => t.toLowerCase().includes(q)) ||
      p.collection.toLowerCase().includes(q) ||
      p.subject_class.some((s) => s.toLowerCase().includes(q)) ||
      p.visible_elements.toLowerCase().includes(q)
  );
}
