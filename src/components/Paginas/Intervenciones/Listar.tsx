"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";
import { formatDateForDisplay } from "@/components/Helpers/DateUtils";

interface Intervencion {
  id: number;
  motivo: string;
  fechaHora: string;
  comentarios: string;
  idUsuario: {
    id: number;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    email: string;
  };
  idTipo: {
    id: number;
    nombreTipo: string;
    estado: string;
  };
  idEquipo: {
    id: number;
    idInterno: string;
    nombre: string;
    nroSerie: string;
  };
}

const ListarIntervenciones: React.FC = () => {
  const [intervenciones, setIntervenciones] = useState<Intervencion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (filters: Record<string, string>) => {
    setLoading(true);
    try {
      const data = await fetcher<Intervencion[]>("/intervenciones/listar", { method: "GET" });
      setIntervenciones(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearch({});
  }, []);

  const columns: Column<Intervencion>[] = [
    { 
      header: "Fecha y Hora", 
      accessor: (row) => {
        try {
          // Si la fecha es un número (timestamp), convertirlo
          let fechaValue = row.fechaHora;
          if (typeof fechaValue === 'number') {
            fechaValue = new Date(fechaValue).toISOString();
          }
          
          const fecha = new Date(fechaValue);
          if (isNaN(fecha.getTime())) {
            console.warn('Fecha inválida:', row.fechaHora);
            return 'Fecha no válida';
          }
          return formatDateForDisplay(fecha);
        } catch (error) {
          console.error('Error al formatear fecha:', error, row.fechaHora);
          return 'Error al formatear fecha';
        }
      },
      type: "text",
      filterable: false 
    },
    { 
      header: "Motivo", 
      accessor: "motivo", 
      type: "text", 
      filterable: true 
    },
    { 
      header: "Tipo de Intervención", 
      accessor: (row) => row.idTipo?.nombreTipo || "-",
      type: "text",
      filterable: true
    },
    { 
      header: "Equipo", 
      accessor: (row) => row.idEquipo ? `${row.idEquipo.idInterno} - ${row.idEquipo.nombre}` : "-",
      type: "text",
      filterable: true
    },
    { 
      header: "Usuario", 
      accessor: (row) => row.idUsuario ? `${row.idUsuario.nombre} ${row.idUsuario.apellido}` : "-",
      type: "text",
      filterable: true
    },
    { 
      header: "Comentarios", 
      accessor: (row) => row.comentarios ? 
        (row.comentarios.length > 50 ? row.comentarios.substring(0, 50) + "..." : row.comentarios) 
        : "-",
      type: "text",
      filterable: false 
    }
  ];



  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Listado de Intervenciones
        </h4>
      </div>

      {error && (
        <div className="mx-4 mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      <div className="p-4 md:p-6 xl:p-7.5">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-600">Cargando...</div>
          </div>
        ) : (
          <DynamicTable
            columns={columns}
            data={intervenciones}
            withFilters={true}
            onSearch={handleSearch}
            withActions={true}
            basePath="/intervenciones"
            // No hay endpoint de eliminación directa en el backend actual
            // deleteUrl="/intervenciones/eliminar"
          />
        )}
      </div>
    </div>
  );
};

export default ListarIntervenciones; 