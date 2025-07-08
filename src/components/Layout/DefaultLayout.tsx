"use client";
import React from "react";
import DynamicSidebar from "./Sidebar";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DynamicSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout; 