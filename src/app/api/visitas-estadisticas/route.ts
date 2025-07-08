import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const logPath = path.join(process.cwd(), "visitas-api.log");
  if (!fs.existsSync(logPath)) {
    return NextResponse.json({ total: 0, porRuta: {}, porUserAgent: {}, porDia: {} });
  }
  const lines = fs.readFileSync(logPath, "utf-8").split("\n").filter(Boolean);

  let total = 0;
  const porRuta: Record<string, number> = {};
  const porUserAgent: Record<string, number> = {};
  const porDia: Record<string, number> = {};

  for (const line of lines) {
    // [2024-06-13T12:34:56.789Z] Visita a /ruta - IP: ... - UserAgent: ... - Referrer: ... - Language: ...
    const match = line.match(/^\[(.*?)\] Visita a (.*?) - IP: (.*?) - UserAgent: (.*?) - Referrer: (.*?) - Language: (.*)$/);
    if (match) {
      total++;
      const [, fecha, ruta, , userAgent] = match;
      porRuta[ruta] = (porRuta[ruta] || 0) + 1;
      porUserAgent[userAgent] = (porUserAgent[userAgent] || 0) + 1;
      const dia = fecha.split("T")[0];
      porDia[dia] = (porDia[dia] || 0) + 1;
    }
  }

  return NextResponse.json({ total, porRuta, porUserAgent, porDia });
} 