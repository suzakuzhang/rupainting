import { NextRequest, NextResponse } from "next/server";
import { getSpiritSession, endSession } from "@/lib/spirit/session";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sessionId = (body.sessionId ?? "").trim();

  if (!sessionId) {
    return NextResponse.json({ error: "缺少 sessionId" }, { status: 400 });
  }

  const session = getSpiritSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "会话不存在" }, { status: 404 });
  }

  endSession(sessionId);

  return NextResponse.json({
    status: "ended",
    farewell: `《${session.paintingTitle}》的导览到此暂止。下次再看时，画面里也许会有这次没注意到的细节。`,
  });
}
