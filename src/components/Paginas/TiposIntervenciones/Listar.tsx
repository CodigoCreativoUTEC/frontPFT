"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";

interface TipoIntervencion {
  id: number;
  nombreTipo: string;
  estado: string;
}

const ListarTiposIntervenciones: React.FC = () => {
  const [tiposIntervenciones, setTiposIntervenciones] = useState<TipoIntervencion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (filters: Record<string, string>) => {
    setLoading(true);
    try {
      const data = await fetcher<TipoIntervencion[]>("/tipoIntervenciones/listar", { method: "GET" });
      setTiposIntervenciones(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleInactivar = async (id: number) => {
    if (!confirm("¿Está seguro que desea inactivar este tipo de intervención?")) {
      return;
    }

    try {
      await fetcher(`/tipoIntervenciones/inactivar?id=${id}`, { method: "DELETE" });
      
      // Recargar la lista
      await handleSearch({});
      
      alert("Tipo de intervención inactivado correctamente");
    } catch (err: any) {
      alert("Error al inactivar: " + err.message);
    }
  };

  useEffect(() => {
    handleSearch({});
  }, []);



  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5 flex justify-between items-center">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Tipos de Intervenciones
        </h4>
        <button
          onClick={() => window.location.href = '/tipoIntervenciones/crear'}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
        >
          Crear Nuevo Tipo
        </button>
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
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[80px] px-4 py-4 font-medium text-black dark:text-white">
                    ID
                  </th>
                  <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                    Nombre del Tipo
                  </th>
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                    Estado
                  </th>
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {tiposIntervenciones.map((tipo, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {tipo.id}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {tipo.nombreTipo}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        tipo.estado === "ACTIVO" 
                          ? "bg-success bg-opacity-10 text-success"
                          : "bg-danger bg-opacity-10 text-danger"
                      }`}>
                        {tipo.estado}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        {tipo.estado === "ACTIVO" && (
                          <button
                            onClick={() => handleInactivar(tipo.id)}
                            className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1 text-center text-sm font-medium text-white hover:bg-opacity-90"
                            title="Inactivar tipo de intervención"
                          >
                            Inactivar
                          </button>
                        )}
                        {tipo.estado === "INACTIVO" && (
                          <span className="text-sm text-gray-500">Ya inactivo</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListarTiposIntervenciones; 