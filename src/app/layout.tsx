"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    // Log de visita a través de la API route
    fetch("/api/log-visita", {
      method: "POST",
      body: JSON.stringify({
        url: pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        language: navigator.language,
        ip: (window as any).ip || undefined
      }),
      headers: { "Content-Type": "application/json" },
    });
  }, [pathname]);

  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
