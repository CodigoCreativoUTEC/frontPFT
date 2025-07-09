"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DetailView from "@/components/Helpers/DetailView";
import fetcher from "@/components/Helpers/Fetcher";

interface Pais {
  id: number;
  nombre: string;
  estado: string;
}

interface Proveedor {
  id: number;
  nombre: string;
  estado: string;
  pais: Pais;
}

const VerProveedor: React.FC = () => {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const data = await fetcher<Proveedor>(`/proveedores/seleccionar?id=${id}`, { method: "GET" });
        setProveedor(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProveedor();
    }
  }, [id]);

  const columns = [
    { header: "ID", accessor: "id" as keyof Proveedor },
    { header: "Nombre", accessor: "nombre" as keyof Proveedor },
    { header: "País", accessor: (row: Proveedor) => row.pais?.nombre || "-" },
    { header: "Estado", accessor: "estado" as keyof Proveedor }
  ];

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!proveedor) return <p>No se encontró el proveedor</p>;

  return (
    <div className="mx-auto max-w-270 2xl:max-w-screen-2xl">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h2 className="text-xl font-bold mb-4">Ver Proveedor</h2>
              <DetailView
                data={proveedor}
                columns={columns}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerProveedor; 