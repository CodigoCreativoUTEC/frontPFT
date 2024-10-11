"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useSession, signOut } from "next-auth/react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (session && session.accessToken) {
      const token = session.accessToken;
      // Decodificar el token para obtener la fecha de expiración (exp)
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const exp = decodedToken.exp;

      // Verificar si el token ha expirado
      const currentTime = Math.floor(Date.now() / 1000);
      if (exp && exp < currentTime) {
        // Si ha expirado, hacer logout
        signOut();
      }
    }
  }, [session]);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content Area */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main Content */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
              <div className="text-center text-xs text-gray-500 py-4">
                Realizado con ♥ por CodigoCreativo © 2024
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
