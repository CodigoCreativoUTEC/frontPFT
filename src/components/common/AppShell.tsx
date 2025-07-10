"use client";
import React, { useEffect, useState, ReactNode } from "react";
import Loader from "@/components/common/Loader";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Loader solo en el primer render
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Log de visita en cada navegación, pero no afecta el loader
  useEffect(() => {
    fetch("/api/log-visita", {
      method: "POST",
      body: JSON.stringify({
        url: pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        language: navigator.language,
        ip: (window as any).ip || undefined,
      }),
      headers: { "Content-Type": "application/json" },
    }).catch((error) => {
      console.warn("Error al registrar visita:", error.message);
    });
  }, [pathname]);

  return (
    <SessionProvider>
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        {loading ? <Loader /> : children}
      </div>
    </SessionProvider>
  );
} 