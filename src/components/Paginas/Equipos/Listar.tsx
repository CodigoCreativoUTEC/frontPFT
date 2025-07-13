"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";

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

const ListarEquipos: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para el modal de baja
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [equipoAEliminar, setEquipoAEliminar] = useState<Equipo | null>(null);
  const [razon, setRazon] = useState("");
  const [fechaBaja, setFechaBaja] = useState(new Date().toISOString().split("T")[0]);
  const [comentarios, setComentarios] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleSearch = async (filters: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const data = await fetcher<Equipo[]>(`/equipos/filtrar${queryString}`, { method: "GET" });
      setEquipos(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar los equipos");
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearch({});
  }, []);

      const columns: Column<Equipo>[] = [
      { 
        header: "", 
        accessor: "imagen", 
        type: "image", 
        filterable: false,
        imageConfig: {
          width: 60,
          height: 60,
          className: "object-cover",
          objectFit: "cover"
        }
      },
      { header: "ID Interno", accessor: "idInterno", type: "text", filterable: true },
    { header: "Nombre", accessor: "nombre", type: "text", filterable: true },
    { header: "Número de Serie", accessor: "nroSerie", type: "text", filterable: true },
    { 
      header: "Tipo", 
      accessor: (row) => row.idTipo?.nombreTipo || "-",
      type: "text",
      filterable: true,
      filterKey: "tipo"
    },
    { 
      header: "Modelo", 
      accessor: (row) => row.idModelo?.nombre || "-",
      type: "text",
      filterable: true,
      filterKey: "modelo"
    },
    { 
      header: "Marca", 
      accessor: (row) => row.idModelo?.idMarca?.nombre || "-",
      type: "text",
      filterable: true,
      filterKey: "marca"
    },
    { 
      header: "Ubicación", 
      accessor: (row) => row.idUbicacion?.nombre && row.idUbicacion?.sector 
        ? `${row.idUbicacion.nombre} - ${row.idUbicacion.sector}` 
        : "-",
      type: "text",
      filterable: true,
      filterKey: "ubicacion"
    },
    { 
      header: "Estado", 
      accessor: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.estado === "ACTIVO" ? "bg-green-100 text-green-800" : 
          row.estado === "INACTIVO" ? "bg-red-100 text-red-800" : 
          "bg-yellow-100 text-yellow-800"
        }`}>
          {row.estado}
        </span>
      ),
      type: "dropdown",
      filterable: true,
      filterKey: "estado",
      options: [
        { value: "ACTIVO", label: "✅ Activos" },
        { value: "INACTIVO", label: "❌ Inactivos" },
        { value: "SIN_VALIDAR", label: "⛔ Sin validar" }
      ]
    }
  ];

  // onDelete personalizado para DynamicTable
  const handleDeleteWithModal = (id: number, row: Equipo) => {
    setEquipoAEliminar(row);
    setShowDeleteModal(true);
    setRazon("");
    setComentarios("");
    setFechaBaja(new Date().toISOString().split("T")[0]);
    return new Promise<{ message: string }>((resolve, reject) => {
      (window as any).__resolveDelete = resolve;
      (window as any).__rejectDelete = reject;
    });
  };

  const confirmarEliminacion = async () => {
    setLoadingDelete(true);
    try {
      await fetcher("/equipos/inactivar", {
        method: "PUT",
        body: {
          razon,
          fecha: fechaBaja,
          comentarios,
          idEquipo: { id: equipoAEliminar?.id },
          estado: "ACTIVO"
        },
      });
      setShowDeleteModal(false);
      setRazon("");
      setComentarios("");
      setFechaBaja(new Date().toISOString().split("T")[0]);
      (window as any).__resolveDelete({ message: "Equipo dado de baja correctamente" });
    } catch (err: any) {
      (window as any).__rejectDelete({ message: err.message || "Error al dar de baja" });
    }
    setLoadingDelete(false);
  };

  return (
    <>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DynamicTable
          columns={columns}
          data={equipos}
          withFilters={true}
          filterUrl="/equipos/filtrar"
          initialFilters={{ estado: "ACTIVO" }}
          onDataUpdate={setEquipos}
          withActions={true}
          deleteUrl="/equipos/inactivar"
          basePath="/equipos"
          onDelete={handleDeleteWithModal}
        />
      )}
      {/* Modal de baja de equipo */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-red-600">Dar de baja equipo</h3>
            <div className="mb-2">
              <label htmlFor="nombreEquipo" className="block font-medium mb-1">Nombre de equipo</label>
              <input
                id="nombreEquipo"
                type="text"
                value={equipoAEliminar?.nombre || ""}
                readOnly
                className="w-full rounded border border-gray-300 p-2 bg-gray-100"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="fechaBaja" className="block font-medium mb-1">Fecha de baja *</label>
              <input
                id="fechaBaja"
                type="date"
                className="w-full border rounded p-2"
                value={fechaBaja}
                onChange={e => setFechaBaja(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="razonBaja" className="block font-medium mb-1">Razón de la baja *</label>
              <input
                id="razonBaja"
                type="text"
                className="w-full border rounded p-2"
                value={razon}
                onChange={e => setRazon(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="comentarios" className="block font-medium mb-1">Comentarios</label>
              <textarea
                id="comentarios"
                className="w-full border rounded p-2"
                value={comentarios}
                onChange={e => setComentarios(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRazon("");
                  setComentarios("");
                  setFechaBaja(new Date().toISOString().split("T")[0]);
                  (window as any).__rejectDelete({ message: "Eliminación cancelada" });
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                disabled={loadingDelete || !razon}
              >
                {loadingDelete ? "Eliminando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListarEquipos;
