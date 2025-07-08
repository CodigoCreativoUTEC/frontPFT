import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { url, userAgent, timestamp, referrer, language, ip } = body;
  const log = `[${timestamp}] Visita a ${url} - IP: ${ip || "unknown"} - UserAgent: ${userAgent} - Referrer: ${referrer} - Language: ${language}\n`;
  const logPath = path.join(process.cwd(), "visitas-api.log");
  try {
    fs.appendFileSync(logPath, log);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: errorMsg }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
} 