"use client";
import VerMarca from "@/components/Paginas/Marcas/Ver";

export default function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  return <VerMarca id={id} />;
} 