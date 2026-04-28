import { NextRequest, NextResponse } from "next/server";
import { buildInterpretSystemPrompt, buildInterpretUserPrompt, PROMPT_VERSION } from "@/lib/llm/prompts";
import { callDeepSeek, DeepSeekError } from "@/lib/llm/deepseek";
import { getSession, addUsageLog } from "@/lib/access/session";
import { ROLE_NORMAL } from "@/lib/access/roles";
import type { Role } from "@/lib/access/roles";
import { getPainting, getArtist } from "@/lib/data/paintings";
import type { ReadingMode } from "@/types/painting";
import { saveResearchInterpretation } from "@/lib/research/store";

const VALID_MODES: ReadingMode[] = ["beginner", "scholar", "roam", "notes"];

export async function POST(req: NextRequest) {
  const body = await req.json();

  const paintingId = String(body.paintingId ?? "").trim();
  const mode = String(body.mode ?? "beginner") as ReadingMode;
  const question: string | undefined = body.question?.toString().trim() || undefined;
  const roamEntry: string | undefined = body.roamEntry?.toString().trim() || undefined;
  const viewId = String(body.viewId ?? "").trim();

  if (!paintingId) {
    return NextResponse.json({ error: "缺少 paintingId" }, { status: 400 });
  }
  if (!VALID_MODES.includes(mode)) {
    return NextResponse.json({ error: "无效的 mode" }, { status: 400 });
  }

  const painting = getPainting(paintingId);
  if (!painting) {
    return NextResponse.json({ error: "画作未找到" }, { status: 404 });
  }
  const artist = getArtist();

  // Resolve role
  const token = (body.access_token as string ?? req.headers.get("x-access-token") ?? "").trim();
  let role: Role = ROLE_NORMAL;
  let userId = "anonymous";
  if (token) {
    const session = getSession(token);
    if (session) {
      role = session.role as Role;
      userId = session.userId;
    }
  }

  const systemPrompt = buildInterpretSystemPrompt(mode);
  const userPrompt = buildInterpretUserPrompt(painting, artist, mode, question, roamEntry);

  // Roam mode is shorter; notes mode is longest
  const maxTokens = mode === "scholar" ? 4500 : mode === "notes" ? 4000 : mode === "roam" ? 2500 : 3000;

  try {
    const result = await callDeepSeek(systemPrompt, userPrompt, { maxTokens });

    addUsageLog({
      action: mode === "roam" ? "roam" : "interpret",
      role,
      userId,
      subjectName: painting.title,
      question: question ?? "",
      ip: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "",
      extra: { paintingId, mode, roamEntry },
    });

    if (viewId) {
      try {
        saveResearchInterpretation({
          viewId,
          role,
          userId,
          paintingId,
          paintingTitle: painting.title,
          mode,
          question: question ?? "",
          roamEntry,
          model: "deepseek-chat",
          promptVersion: PROMPT_VERSION,
          systemPrompt,
          userPrompt,
          result,
        });
      } catch {
        // Research persistence should not block product flow.
      }
    }

    return NextResponse.json({
      mode,
      paintingId,
      result,
    });
  } catch (err) {
    if (err instanceof DeepSeekError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    return NextResponse.json({ error: "解读生成失败" }, { status: 500 });
  }
}
