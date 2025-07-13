"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";
import DetailView, { Column } from "@/components/Helpers/DetailView";

interface Perfil {
  id: number;
  nombrePerfil: string;
  estado: string;
}

interface Funcionalidad {
  id: number;
  nombreFuncionalidad: string;
  ruta: string;
  estado: string;
  perfiles: Perfil[];
}

const VerFuncionalidad: React.FC = () => {
  const { id } = useParams();
  const [funcionalidad, setFuncionalidad] = useState<Funcionalidad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFuncionalidad = async () => {
      try {
        const data = await fetcher<Funcionalidad>(`/funcionalidades/seleccionar/${id}`, { method: "GET" });
        setFuncionalidad(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar la funcionalidad");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFuncionalidad();
    }
  }, [id]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "ACTIVO":
        return "bg-green-100 text-green-800";
      case "INACTIVO":
        return "bg-red-100 text-red-800";
      case "SIN_VALIDAR":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "ACTIVO":
        return "Activo";
      case "INACTIVO":
        return "Inactivo";
      case "SIN_VALIDAR":
        return "Sin validar";
      default:
        return estado;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-blue-600">Cargando funcionalidad...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!funcionalidad) {
    return (
      <div className="p-6">
        <p className="text-yellow-600">No se encontró la funcionalidad.</p>
      </div>
    );
  }

  const columns: Column<Funcionalidad>[] = [
    { header: "ID", accessor: "id", type: "number" },
    { header: "Nombre de la Funcionalidad", accessor: "nombreFuncionalidad", type: "text" },
    { 
      header: "Ruta/Endpoint", 
      accessor: "ruta", 
      type: "text" 
    },
    { 
      header: "Estado", 
      accessor: (row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(row.estado)}`}>
          {getEstadoLabel(row.estado)}
        </span>
      ),
      type: "text"
    },
    { 
      header: "Perfiles Asignados", 
      accessor: (row) => {
        if (!row.perfiles || row.perfiles.length === 0) {
          return (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                No hay perfiles asignados a esta funcionalidad.
              </p>
            </div>
          );
        }
        
        return (
          <div className="space-y-2">
            {row.perfiles.map((perfil) => (
              <div
                key={perfil.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-boxdark-2 rounded-lg"
              >
                <div>
                  <p className="font-medium text-black dark:text-white">
                    {perfil.nombrePerfil}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {perfil.id}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(perfil.estado)}`}>
                  {getEstadoLabel(perfil.estado)}
                </span>
              </div>
            ))}
          </div>
        );
      },
      type: "text"
    },
  ];

  return (
    <DetailView
      data={funcionalidad}
      columns={columns}
      backLink="/funcionalidades"
      showEditButton={true}
    />
  );
};

export default VerFuncionalidad;
