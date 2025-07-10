import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi perfil",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 