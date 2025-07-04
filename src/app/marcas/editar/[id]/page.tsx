"use client";
import EditarMarca from "@/components/Paginas/Marcas/Editar";

export default function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  return <EditarMarca id={id} />;
} 