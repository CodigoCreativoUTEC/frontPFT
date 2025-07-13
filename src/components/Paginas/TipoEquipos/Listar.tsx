"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import DynamicTable, { Column } from "@/components/Helpers/DynamicTable";

interface TipoEquipo {
  id: number;
  nombreTipo: string;
  estado: string;
}

const ListarTiposEquipos: React.FC = () => {
  const [tipos, setTipos] = useState<TipoEquipo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para el modal de inactivación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tipoAEliminar, setTipoAEliminar] = useState<TipoEquipo | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleSearch = async (filters: Record<string, string>) => {
    setLoading(true);
    try {
      const data = await fetcher<TipoEquipo[]>("/tipoEquipos/listar", { method: "GET" });
      setTipos(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearch({});
  }, []);

  const columns: Column<TipoEquipo>[] = [
    { header: "ID", accessor: "id", type: "number", filterable: false },
    { header: "Nombre", accessor: "nombreTipo", type: "text", filterable: true },
    { 
      header: "Estado", 
      accessor: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.estado === "ACTIVO" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {row.estado}
        </span>
      ),
      type: "text",
      filterable: true 
    }
  ];

  // onDelete personalizado para DynamicTable
  const handleDeleteWithModal = (id: number, row: TipoEquipo) => {
    setTipoAEliminar(row);
    setShowDeleteModal(true);
    return new Promise<{ message: string }>((resolve, reject) => {
      (window as any).__resolveDelete = resolve;
      (window as any).__rejectDelete = reject;
    });
  };

  const confirmarEliminacion = async () => {
    setLoadingDelete(true);
    try {
      await fetcher(`/tipoEquipos/inactivar?id=${tipoAEliminar?.id}`, {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      (window as any).__resolveDelete({ message: "Tipo de equipo inactivado correctamente" });
      handleSearch({}); // Refresh list
    } catch (err: any) {
      (window as any).__rejectDelete({ message: err.message || "Error al inactivar" });
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
          data={tipos}
          withFilters={true}
          onSearch={handleSearch}
          withActions={true}
          deleteUrl="/tipoEquipos/inactivar"
          basePath="/tipoEquipos"
          onDelete={handleDeleteWithModal}
        />
      )}
      {/* Modal de inactivación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-red-600">Inactivar tipo de equipo</h3>
            <div className="mb-2">
              <label htmlFor="nombreTipo" className="block font-medium mb-1">Nombre</label>
              <input
                id="nombreTipo"
                type="text"
                value={tipoAEliminar?.nombreTipo || ""}
                readOnly
                className="w-full rounded border border-gray-300 p-2 bg-gray-100"
              />
            </div>
            <p className="mb-4">¿Está seguro de que desea inactivar este tipo de equipo?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  (window as any).__rejectDelete({ message: "Inactivación cancelada" });
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                disabled={loadingDelete}
              >
                {loadingDelete ? "Inactivando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListarTiposEquipos;