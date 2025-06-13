"use client";
import React, { useEffect, useState } from "react";

// Define la interfaz para la configuración de cada columna
export interface Column<T> {
  /** Título que se mostrará en el encabezado de la columna */
  header: string;
  /**
   * Puede ser la propiedad (key) del objeto o una función que reciba
   * el objeto y devuelva el contenido (permitiendo formatos personalizados)
   */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /**
   * Tipo opcional que te ayudará a formatear el contenido.
   * Puedes usarlo para manejar fechas, imágenes, números, teléfonos, etc.
   */
  type?: "text" | "date" | "image" | "number" | "phone";
  /**
   * Indica si este campo es filtrable.
   * Solo se consideran aquellos accesores que sean de tipo string (clave del objeto).
   */
  filterable?: boolean;
}

interface DynamicTableProps<T extends { id: number }> {
  readonly columns: ReadonlyArray<Column<T>>;
  readonly data: ReadonlyArray<T>;
  /** Si true, muestra la interfaz de filtros encima de la tabla */
  readonly withFilters?: boolean;
  /**
   * Callback opcional que se ejecuta al hacer la búsqueda con los filtros.
   * Por ejemplo, para hacer una llamada a la API con los filtros.
   */
  readonly onSearch?: (filters: Record<string, string>) => void;
  /**
   * Filtros iniciales (si se desean precargar algunos valores).
   */
  readonly initialFilters?: Record<string, string>;
  /**
   * Si true, agrega una columna de acciones (Ver, Editar, Eliminar) al final de la tabla.
   */
  readonly withActions?: boolean;
  /**
   * URL base para la operación de eliminación (usada en la lógica por defecto).
   * Se llamará a `${deleteUrl}` enviando el objeto obtenido.
   */
  readonly deleteUrl?: string;
  /**
   * Base path para generar los enlaces de "Ver" y "Editar".
   * Por ejemplo, "/usuarios". Si no se define, se utilizará una cadena vacía.
   */
  readonly basePath?: string;
  /**
   * Callback opcional para la eliminación.
   * Si se define, se usará en lugar de la lógica por defecto.
   * Debe recibir el id y la fila completa, y retornar una promesa que resuelva
   * un objeto con al menos una propiedad "message".
   */
  readonly onDelete?: (id: number, row: T) => Promise<{ message: string }>;
}

// Se asume que fetcher ya está implementado y disponible para llamadas HTTP.
import fetcher from "@/components/Helpers/Fetcher";

function DynamicTable<T extends { id: number }>({
  columns,
  data,
  withFilters = false,
  onSearch,
  initialFilters = {},
  withActions = false,
  deleteUrl,
  basePath = "",
  onDelete,
}: DynamicTableProps<T>) {
  // Estado para almacenar los filtros locales
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
  // Estado interno para la data de la tabla (para actualizarla tras una eliminación)
  const [internalData, setInternalData] = useState<T[]>([...data]);
  // Actualizar data interna si la prop data cambia
  useEffect(() => {
    setInternalData([...data]);
  }, [data]);

  // Estados para el modal de error de eliminación
  const [deletionError, setDeletionError] = useState<string>("");
  const [showDeletionErrorModal, setShowDeletionErrorModal] = useState(false);

  // Maneja cambios en los inputs de filtro
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Ejecuta el callback de búsqueda si se ha definido
  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    }
  };

  // Reinicia los filtros y notifica al padre si se define onSearch
  const handleClearFilters = () => {
    const cleared: Record<string, string> = {};
    columns.forEach((col) => {
      if (typeof col.accessor === "string" && col.filterable) {
        cleared[col.accessor] = "";
      }
    });
    setFilters(cleared);
    if (onSearch) {
      onSearch(cleared);
    }
  };

  // Función para eliminar un registro (lógica dinámica)
  const handleDelete = async (id: number) => {
    const row = internalData.find((item) => item.id === id);
    if (!row) return;
    try {
      let response: { message: string };

      if (onDelete) {
        // Si se proporciona onDelete, úsalo
        response = await onDelete(id, row);
      } else if (deleteUrl) {
        // Lógica por defecto: obtener el objeto usuario y luego enviarlo
        const user = await fetcher<T>(`/usuarios/seleccionar?id=${id}`, { method: "GET" });
        response = await fetcher<{ message: string }>(`${deleteUrl}`, {
          method: "PUT",
          body: user,
        });
      } else {
        throw new Error("No se definió una lógica de eliminación.");
      }

      if (response.message === "Usuario inactivado correctamente") {
        setInternalData((prev) => prev.filter((item) => item.id !== id));
      } else {
        setDeletionError(response.message || "Error al inactivar el usuario.");
        setShowDeletionErrorModal(true);
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.message || error.message || "Error al inactivar el usuario.";
      setDeletionError(errorMsg);
      setShowDeletionErrorModal(true);
    }
  };

  // Función auxiliar para formatear fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Ajustar la fecha para compensar la zona horaria
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto">
      {/* Sección de filtros */}
      {withFilters && (
        <div className="mb-4 p-4 border border-gray-200 rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Filtros</h3>
          <div className="flex flex-wrap gap-4">
            {columns.map((col, idx) => {
              if (col.filterable && typeof col.accessor === "string") {
                const key = col.accessor;
                const currentValue = filters[key] || "";
                if (key === "estado") {
                  return (
                    <div key={idx} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700">{col.header}:</label>
                      <select
                        value={currentValue}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      >
                        <option value="">TODOS</option>
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="SIN_VALIDAR">SIN_VALIDAR</option>
                        <option value="INACTIVO">INACTIVO</option>
                      </select>
                    </div>
                  );
                }
                if (col.type === "date") {
                  return (
                    <div key={idx} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700">{col.header}:</label>
                      <input
                        type="date"
                        value={currentValue}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      />
                    </div>
                  );
                }
                return (
                  <div key={idx} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">{col.header}:</label>
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Buscar
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Borrar Filtros
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {withActions && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {internalData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => {
                let cellContent: React.ReactNode;
                if (typeof col.accessor === "function") {
                  cellContent = col.accessor(row);
                } else {
                  const value = row[col.accessor];
                  switch (col.type) {
                    case "date":
                      cellContent = value ? formatDate(value as string) : "";
                      break;
                    case "image":
                      cellContent = value ? (
                        <img
                          src={value as string}
                          alt={col.header}
                          className="max-w-xs rounded"
                        />
                      ) : (
                        ""
                      );
                      break;
                    case "phone":
                      cellContent = Array.isArray(value)
                        ? ((value as any[])
                            .map((tel) => tel.numero || tel)
                            .join(", ")) as React.ReactNode
                        : (value as React.ReactNode);
                      break;
                    default:
                      cellContent = value as React.ReactNode;
                  }
                }
                return (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cellContent}
                  </td>
                );
              })}
              {withActions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <a
                      href={`${basePath}/ver/${row.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver
                    </a>
                    <a
                      href={`${basePath}/editar/${row.id}`}
                      className="text-green-600 hover:underline"
                    >
                      Editar
                    </a>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showDeletionErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full text-center">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Error al eliminar</h3>
            <p className="text-gray-700 mb-6">{deletionError}</p>
            <button
              onClick={() => setShowDeletionErrorModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DynamicTable;
