import { ReactNode } from "react";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import AppShell from "@/components/common/AppShell";

export const metadata = {
  title: {
    default: "MED-MGT",
    template: "%s | MED-MGT",
  },
  description: "Sistema de gestión de mantenimiento hospitalario",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
