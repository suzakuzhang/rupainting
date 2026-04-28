import { NextRequest, NextResponse } from "next/server";
import {
  registerView,
  getViewContext,
  createSpiritSession,
  addMessage,
} from "@/lib/spirit/session";
import { generateSpiritReply } from "@/lib/llm/spiritLlm";
import { buildSpiritSystemPrompt, buildSpiritOpeningPrompt } from "@/lib/spirit/prompts";
import { getPainting, getArtist } from "@/lib/data/paintings";
import { addUsageLog, getSession } from "@/lib/access/session";
import { ROLE_NORMAL } from "@/lib/access/roles";
import type { Role } from "@/lib/access/roles";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const viewId = (body.viewId ?? "").trim();
  const paintingId = (body.paintingId ?? "").trim();
  const question = (body.question ?? "").trim();
  const initialInterpretation = (body.initialInterpretation ?? "").trim() || undefined;

  if (!viewId || !paintingId) {
    return NextResponse.json({ error: "缺少 viewId 或 paintingId" }, { status: 400 });
  }

  const painting = getPainting(paintingId);
  if (!painting) {
    return NextResponse.json({ error: "画作未找到" }, { status: 404 });
  }
  const artist = getArtist();

  // Register view context (always, in case user re-enters spirit mode after refresh)
  registerView({
    viewId,
    paintingId,
    paintingTitle: painting.title,
    artistName: artist.name,
    artistDates: artist.dates,
    medium: painting.medium,
    dimensions: painting.dimensions,
    format: painting.format,
    collection: painting.collection,
    approximateDate: painting.approximate_date,
    visibleElements: painting.visible_elements,
    compositionNotes: painting.composition_notes,
    brushworkNotes: painting.brushwork_notes,
    inscription: painting.inscription,
    sealsVisible: painting.seals_visible,
    question,
    initialInterpretation,
  });

  const ctx = getViewContext(viewId);
  if (!ctx) {
    return NextResponse.json({ error: "无法初始化导览上下文" }, { status: 500 });
  }

  const session = createSpiritSession(viewId);
  if (!session) {
    return NextResponse.json({ error: "创建导览会话失败" }, { status: 500 });
  }

  const systemPrompt = buildSpiritSystemPrompt();
  const openingPrompt = buildSpiritOpeningPrompt(
    ctx.paintingTitle,
    ctx.artistName,
    ctx.visibleElements,
    ctx.brushworkNotes,
    ctx.inscription || "",
    ctx.question,
    ctx.initialInterpretation
  );

  let openingMessage: string;
  try {
    openingMessage = await generateSpiritReply(systemPrompt, openingPrompt);
  } catch {
    openingMessage = `《${ctx.paintingTitle}》先不急着告诉你它的故事。你可以从画面里随便抓一处停下来——${ctx.visibleElements.slice(0, 60)}……这一处，你愿意先看看吗？`;
  }

  addMessage(session.sessionId, "assistant", openingMessage);

  // Log usage
  const token = (body.access_token as string ?? req.headers.get("x-access-token") ?? "").trim();
  let role: Role = ROLE_NORMAL;
  let userId = "anonymous";
  if (token) {
    const s = getSession(token);
    if (s) {
      role = s.role as Role;
      userId = s.userId;
    }
  }
  addUsageLog({
    action: "spirit_start",
    role,
    userId,
    subjectName: ctx.paintingTitle,
    question,
    ip: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "",
    extra: { paintingId, viewId },
  });

  return NextResponse.json({
    session: {
      sessionId: session.sessionId,
      paintingTitle: session.paintingTitle,
      remainingRounds: session.remainingRounds,
      status: session.status,
      expiresAt: session.expiresAt,
    },
    openingMessage,
  });
}
