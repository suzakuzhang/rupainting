import { NextResponse } from "next/server";
import { getPainting, getArtist, getCorpus } from "@/lib/data/paintings";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const painting = getPainting(params.id);
  if (!painting) {
    return NextResponse.json({ error: "画作未找到" }, { status: 404 });
  }
  return NextResponse.json({
    painting,
    artist: getArtist(),
    source: getCorpus().source,
  });
}
