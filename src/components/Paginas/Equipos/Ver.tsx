"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";
import DetailView, { Column } from "@/components/Helpers/DetailView";

interface Equipo {
  id: number;
  idInterno: string;
  nroSerie: string;
  garantia: string | null;
  idTipo: {
    id: number;
    nombreTipo: string;
    estado: string;
  };
  idProveedor: {
    id: number;
    nombre: string;
    estado: string;
    pais: {
      id: number;
      nombre: string;
    };
  };
  idPais: {
    id: number;
    nombre: string;
  };
  idModelo: {
    id: number;
    nombre: string;
    idMarca: {
      id: number;
      nombre: string;
      estado: string;
    };
    estado: string;
  };
  idUbicacion: {
    id: number;
    nombre: string;
    sector: string;
    piso: number;
    numero: number;
    cama: string | null;
    idInstitucion: {
      id: number;
      nombre: string;
    };
    estado: string;
  };
  nombre: string;
  imagen: string;
  fechaAdquisicion: string;
  estado: string;
}

const VerEquipo: React.FC = () => {
  const params = useParams();
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const data = await fetcher<Equipo>(`/equipos/seleccionar?id=${params.id}`);
        if (data) {
          setEquipo(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipo();
  }, [params.id]);

  const columns: Column<Equipo>[] = [
    {
      header: "Imagen",
      accessor: (equipo) => (
        equipo.imagen ? (
          <img
            src={equipo.imagen}
            alt={equipo.nombre}
            className="w-32 h-32 object-contain rounded-lg shadow-lg"
            onError={(e) => {
              if (e.currentTarget.src !== "https://via.placeholder.com/150") {
                e.currentTarget.src = "https://via.placeholder.com/150";
              }
            }}
          />
        ) : (
          <span className="text-gray-400 italic">Sin imagen</span>
        )
      ),
      type: "image"
    },
    {
      header: "ID Interno",
      accessor: "idInterno"
    },
    {
      header: "Nombre",
      accessor: "nombre"
    },
    {
      header: "Número de Serie",
      accessor: "nroSerie"
    },
    {
      header: "Garantía",
      accessor: "garantia",
      type: "date"
    },
    {
      header: "Fecha de Adquisición",
      accessor: "fechaAdquisicion",
      type: "date"
    },
    {
      header: "Tipo",
      accessor: (equipo) => equipo.idTipo?.nombreTipo || "-"
    },
    {
      header: "Modelo",
      accessor: (equipo) => equipo.idModelo?.nombre || "-"
    },
    {
      header: "Marca",
      accessor: (equipo) => equipo.idModelo?.idMarca?.nombre || "-"
    },
    {
      header: "Proveedor",
      accessor: (equipo) => equipo.idProveedor?.nombre || "-"
    },
    {
      header: "País del Proveedor",
      accessor: (equipo) => equipo.idProveedor?.pais?.nombre || "-"
    },
    {
      header: "Ubicación",
      accessor: (equipo) => {
        const ubicacion = equipo.idUbicacion;
        if (!ubicacion) return "-";
        return `${ubicacion.nombre} - ${ubicacion.sector} - Piso ${ubicacion.piso} - Número ${ubicacion.numero}`;
      }
    },
    {
      header: "Institución",
      accessor: (equipo) => equipo.idUbicacion?.idInstitucion?.nombre || "-"
    },
    {
      header: "Estado",
      accessor: (equipo) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          equipo.estado === "ACTIVO" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {equipo.estado}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      {loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded mb-4">
          <p className="text-blue-700">Cargando...</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}
      {!loading && !error && !equipo && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-4">
          <p className="text-yellow-700">No se encontró el equipo.</p>
        </div>
      )}
      {equipo && (
        <DetailView<Equipo>
          data={equipo}
          columns={columns}
          backLink="/equipos"
          showEditButton={true}
        />
      )}
    </div>
  );
};

export default VerEquipo;
