"use client";
import React, { useEffect, useState, ReactElement } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import * as XLSX from "xlsx";

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
  /** Endpoint para obtener el objeto completo antes de eliminar (opcional) */
  readonly selectUrl?: string;
}

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
  selectUrl,
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
  // Estado para el modal de confirmación de eliminación
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [rowIdToDelete, setRowIdToDelete] = useState<number | null>(null);
  // Estado para el modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

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
      let response: { message?: string; error?: string };

      if (onDelete) {
        response = await onDelete(id, row);
      } else if (deleteUrl) {
        let body = undefined;
        let url = deleteUrl;

        if (selectUrl) {
          // Si hay endpoint de selección, obtener el objeto completo
          body = await fetcher<T>(`${selectUrl}?id=${id}`, { method: "GET" });
        } else {
          // Si no, solo usar el id en la URL
          url = `${deleteUrl}?id=${id}`;
        }

        response = await fetcher<{ message?: string; error?: string }>(url, {
          method: "PUT",
          ...(body ? { body } : {}),
        });
      } else {
        throw new Error("No se definió una lógica de eliminación.");
      }

      if (response.message) {
        setInternalData((prev) => prev.filter((item) => item.id !== id));
        setSuccessMessage(response.message);
        setShowSuccessModal(true);
      } else {
        setDeletionError(response.error || "Error al eliminar.");
        setShowDeletionErrorModal(true);
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.error || error?.response?.message || error.message || "Error al eliminar.";
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

  // Función para exportar a Excel
  const handleExportExcel = () => {
    // Filtrar solo las columnas visibles (sin acciones)
    const exportColumns = columns;
    // Generar los datos a exportar
    const exportData = internalData.map((row) => {
      const rowData: Record<string, any> = {};
      exportColumns.forEach((col) => {
        let value;
        if (typeof col.accessor === "function") {
          const rendered = col.accessor(row);
          if (
            typeof rendered === "string" ||
            typeof rendered === "number" ||
            typeof rendered === "boolean"
          ) {
            value = rendered;
          } else if (React.isValidElement(rendered)) {
            const children = (rendered as React.ReactElement<any, any>).props?.children;
            if (
              typeof children === "string" ||
              typeof children === "number" ||
              typeof children === "boolean"
            ) {
              value = children;
            } else {
              value = "";
            }
          } else {
            value = "";
          }
        } else {
          value = row[col.accessor];
        }
        rowData[col.header] = value;
      });
      return rowData;
    });
    // Crear hoja y libro
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    // Descargar
    XLSX.writeFile(workbook, "exportacion_tabla.xlsx");
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-boxdark p-4 rounded shadow">
      {/* Sección de filtros */}
      {withFilters && (
        <div className="mb-4 p-4 border border-gray-200 rounded bg-gray-50 dark:bg-boxdark-2 dark:border-boxdark-2">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Filtros</h3>
          <div className="flex flex-wrap gap-4">
            {columns.map((col, idx) => {
              if (col.filterable && typeof col.accessor === "string") {
                const key = col.accessor;
                const currentValue = filters[key] || "";
                if (key === "estado") {
                  return (
                    <div key={idx} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{col.header}:</label>
                      <select
                        value={currentValue}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-boxdark dark:border-boxdark-2 dark:text-white"
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
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{col.header}:</label>
                      <input
                        type="date"
                        value={currentValue}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-boxdark dark:border-boxdark-2 dark:text-white"
                      />
                    </div>
                  );
                }
                return (
                  <div key={idx} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{col.header}:</label>
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-boxdark dark:border-boxdark-2 dark:text-white"
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

      {/* Botón de exportar a Excel */}
      <div className="flex justify-end mb-2">
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Exportar a Excel
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 dark:bg-boxdark-2">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {withActions && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:divide-boxdark-2">
          {internalData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex % 2 === 0
                  ? "bg-gray-50 dark:bg-boxdark-2"
                  : "bg-white dark:bg-boxdark"
              }
            >
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
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {cellContent}
                  </td>
                );
              })}
              {withActions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  <div className="flex items-center space-x-2">
                    <a
                      href={`${basePath}/ver/${row.id}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {/* Ojo (ver) */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      <span className="sr-only">Ver</span>
                    </a>
                    <a
                      href={`${basePath}/editar/${row.id}`}
                      className="text-green-600 hover:underline flex items-center gap-1"
                    >
                      {/* Lápiz (editar) */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h12M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      <span className="sr-only">Editar</span>
                    </a>
                    <button
                      onClick={() => {
                        setRowIdToDelete(row.id);
                        setShowConfirmDeleteModal(true);
                      }}
                      className="text-red-600 hover:underline flex items-center gap-1"
                    >
                      {/* Tarro de basura (eliminar) */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      <span className="sr-only">Eliminar</span>
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
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full text-center">
            <h3 className="text-xl font-semibold mb-4">Confirmar eliminación</h3>
            <p className="text-gray-700 mb-6">¿Está seguro que desea eliminar este registro?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (rowIdToDelete !== null) {
                    setShowConfirmDeleteModal(false);
                    await handleDelete(rowIdToDelete);
                    setRowIdToDelete(null);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full text-center">
            <h3 className="text-xl font-semibold text-green-600 mb-4">Eliminación exitosa</h3>
            <p className="text-gray-700 mb-6">{successMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
