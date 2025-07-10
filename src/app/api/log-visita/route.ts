import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, userAgent, timestamp, referrer, language, ip } = body;
    const log = `[${timestamp}] Visita a ${url} - IP: ${ip || "unknown"} - UserAgent: ${userAgent} - Referrer: ${referrer} - Language: ${language}\n`;
    const logPath = path.join(process.cwd(), "visitas-api.log");
    
    try {
      fs.appendFileSync(logPath, log);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.warn("Error al escribir log de visita:", errorMsg);
      // Retornar éxito aunque falle el logging para no interrumpir la aplicación
      return NextResponse.json({ ok: true, warning: "Log no guardado" });
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.warn("Error al procesar log de visita:", error);
    // Retornar éxito para no interrumpir la aplicación
    return NextResponse.json({ ok: true, warning: "Error procesando log" });
  }
} 