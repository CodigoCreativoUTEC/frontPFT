"use client";
import React, { useEffect, useState, ReactElement } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import * as XLSX from "xlsx";

/**
 * Configuración de una columna en la tabla dinámica
 */
export interface Column<T> {
  /** Título que se mostrará en el encabezado de la columna */
  header: string;
  /**
   * Acceso a los datos de la columna.
   * Puede ser:
   * - Una propiedad del objeto (keyof T)
   * - Una función que reciba el objeto y devuelva el contenido (permitiendo formatos personalizados)
   */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /**
   * Tipo de dato para formateo automático.
   * Opciones: "text", "date", "image", "number", "phone"
   */
  type?: "text" | "date" | "image" | "number" | "phone";
  /**
   * Indica si este campo es filtrable.
   * Solo funciona con accesores de tipo string (clave del objeto).
   * Los filtros se aplican localmente en los datos cargados.
   */
  filterable?: boolean;
}

/**
 * Props del componente DynamicTable
 */
interface DynamicTableProps<T extends { id: number }> {
  /** Configuración de las columnas de la tabla */
  readonly columns: ReadonlyArray<Column<T>>;
  /** Datos a mostrar en la tabla */
  readonly data: ReadonlyArray<T>;
  /** Si true, muestra la interfaz de filtros encima de la tabla */
  readonly withFilters?: boolean;
  /**
   * Callback opcional que se ejecuta al hacer búsqueda con filtros.
   * Útil para hacer llamadas a la API con filtros específicos.
   */
  readonly onSearch?: (filters: Record<string, string>) => void;
  /**
   * URL del endpoint para filtrado automático.
   * Si se proporciona, DynamicTable manejará automáticamente las llamadas a la API.
   * Ejemplo: "/paises/filtrar" - se llamará con query params como "/paises/filtrar?estado=ACTIVO"
   */
  readonly filterUrl?: string;
  /** Filtros iniciales precargados */
  readonly initialFilters?: Record<string, string>;
  /** Si true, agrega columna de acciones (Ver, Editar, Eliminar) */
  readonly withActions?: boolean;
  /**
   * URL para la operación de eliminación.
   * Se llamará con método PUT enviando el objeto completo.
   */
  readonly deleteUrl?: string;
  /**
   * Base path para generar enlaces de "Ver" y "Editar".
   * Ejemplo: "/usuarios" genera "/usuarios/ver/123" y "/usuarios/editar/123"
   */
  readonly basePath?: string;
  /**
   * Callback personalizado para eliminación.
   * Si se define, se usa en lugar de la lógica por defecto.
   * Debe retornar una promesa con objeto que contenga al menos "message".
   */
  readonly onDelete?: (id: number, row: T) => Promise<{ message: string }>;
  /**
   * Endpoint para obtener objeto completo antes de eliminar.
   * Se usa cuando necesitas datos específicos para la eliminación.
   */
  readonly selectUrl?: string;
  /**
   * Si true, envía solo el ID en lugar del objeto completo al eliminar.
   * Útil cuando el backend espera solo el ID en la URL o en el body.
   */
  readonly sendOnlyId?: boolean;
  /**
   * Callback para actualizar los datos cuando se aplican filtros.
   * Se llama con los nuevos datos obtenidos del endpoint de filtrado.
   */
  readonly onDataUpdate?: (data: T[]) => void;
  /**
   * Mensaje de confirmación para eliminación.
   * Si se proporciona, se mostrará un modal de confirmación antes de eliminar.
   */
  readonly confirmDeleteMessage?: string;
}

/**
 * Componente de tabla dinámica con funcionalidades avanzadas
 * 
 * Características:
 * - Filtrado local y remoto de datos
 * - Exportación a Excel
 * - Acciones automáticas (Ver, Editar, Eliminar)
 * - Formateo automático por tipo de dato
 * - Modales de confirmación y error
 * - Soporte para filtros personalizados
 * - Filtrado automático con endpoints (filterUrl)
 * 
 * @template T - Tipo de objeto que representa cada fila (debe tener propiedad 'id')
 */
function DynamicTable<T extends { id: number }>({
  columns,
  data,
  withFilters = false,
  onSearch,
  filterUrl,
  initialFilters = {},
  withActions = false,
  deleteUrl,
  basePath = "",
  onDelete,
  selectUrl,
  sendOnlyId = false,
  onDataUpdate,
  confirmDeleteMessage,
}: DynamicTableProps<T>) {
  // ===== ESTADOS INTERNOS =====
  // Estados para UI (errores, modales, etc)
  /** Error durante eliminación */
  const [deletionError, setDeletionError] = useState<string>("");
  const [showDeletionErrorModal, setShowDeletionErrorModal] = useState(false);
  /** Modal de confirmación de eliminación */
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [rowIdToDelete, setRowIdToDelete] = useState<number | null>(null);
  /** Modal de éxito */
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  
  // Estados para filtros (sin sincronización automática)
  /** Filtros aplicados actualmente */
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);

  // ===== EFECTOS =====
  
  /** Carga inicial de datos si se proporciona filterUrl */
  useEffect(() => {
    if (filterUrl) {
      const loadInitialData = async () => {
        try {
          // Aplicar filtros iniciales si existen
          let url = filterUrl;
          if (Object.keys(initialFilters).length > 0) {
            const params = new URLSearchParams();
            Object.entries(initialFilters).forEach(([key, value]) => {
              if (value) params.append(key, value);
            });
            const queryString = params.toString() ? `?${params.toString()}` : "";
            url = `${filterUrl}${queryString}`;
          }
          
          const initialData = await fetcher<T[]>(url, { method: "GET" });
          if (onDataUpdate) {
            onDataUpdate(initialData);
          }
        } catch (error: any) {
          console.error("Error al cargar datos iniciales:", error);
        }
      };
      loadInitialData();
    }
  }, [filterUrl]); // Solo se ejecuta cuando cambia filterUrl

  // ===== MANEJADORES DE FILTROS =====
  
  /**
   * Actualiza el valor de un filtro específico
   */
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Ejecuta la búsqueda con filtros actuales
   */
  const handleSearch = async () => {
    if (filterUrl) {
      // Manejo automático con filterUrl
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        const queryString = params.toString() ? `?${params.toString()}` : "";
        const filteredData = await fetcher<T[]>(`${filterUrl}${queryString}`, { method: "GET" });
        if (onDataUpdate) {
          onDataUpdate(filteredData);
        }
      } catch (error: any) {
        console.error("Error al filtrar:", error);
      }
    } else if (onSearch) {
      // Comportamiento original con callback
      onSearch(filters);
    }
  };

  /**
   * Limpia todos los filtros y notifica al componente padre
   */
  const handleClearFilters = async () => {
    const cleared: Record<string, string> = {};
    columns.forEach((col) => {
      if (typeof col.accessor === "string" && col.filterable) {
        cleared[col.accessor] = "";
      }
    });
    setFilters(cleared);
    
    if (filterUrl) {
      // Manejo automático con filterUrl
      try {
        const filteredData = await fetcher<T[]>(filterUrl, { method: "GET" });
        if (onDataUpdate) {
          onDataUpdate(filteredData);
        }
      } catch (error: any) {
        console.error("Error al limpiar filtros:", error);
      }
    } else if (onSearch) {
      // Comportamiento original con callback
      onSearch(cleared);
    }
  };

  // ===== MANEJADORES DE ELIMINACIÓN =====
  
  /**
   * Prepara la eliminación de un registro
   * @param id - ID del registro a eliminar
   */
  const handleDeleteClick = (id: number) => {
    setRowIdToDelete(id);
    setShowConfirmDeleteModal(true);
  };

  /**
   * Elimina un registro usando la lógica configurada
   * @param id - ID del registro a eliminar
   */
  const handleDelete = async (id: number) => {
    const row = data.find((item) => item.id === id);
    if (!row) return;
    
    try {
      let response: { message?: string; error?: string };

      if (onDelete) {
        // Usar callback personalizado
        response = await onDelete(id, row);
      } else if (deleteUrl) {
        // Usar lógica por defecto
        let body = undefined;
        let url = deleteUrl;

        if (sendOnlyId) {
          // Enviar solo el ID
        if (selectUrl) {
            // Solo ID en el body
            body = { id };
          } else {
            // Solo ID en la URL
            url = `${deleteUrl}?id=${id}`;
          }
        } else if (selectUrl) {
          // Obtener objeto completo antes de eliminar
          body = await fetcher<T>(`${selectUrl}?id=${id}`, { method: "GET" });
        } else {
          // Solo usar ID en la URL
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
        // Eliminación exitosa
        // Ya no se actualiza internalData, el padre debe actualizar data
      } else {
        // Error en la respuesta
        setDeletionError(response.error || "Error al eliminar.");
        setShowDeletionErrorModal(true);
      }
    } catch (error: any) {
      // Error de red o excepción
      const errorMsg =
        error?.response?.error || error?.response?.message || error.message || "Error al eliminar.";
      setDeletionError(errorMsg);
      setShowDeletionErrorModal(true);
    }
  };

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * Formatea una fecha string a formato local
   */
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Ajustar zona horaria
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString();
  };

  /**
   * Exporta los datos de la tabla a Excel
   */
  const handleExportExcel = () => {
    // Preparar datos para exportación
    const exportData = data.map((row) => {
      const rowData: Record<string, any> = {};
      columns.forEach((col) => {
        let value;
        
        if (typeof col.accessor === "function") {
          // Extraer valor de función personalizada
          const rendered = col.accessor(row);
          if (
            typeof rendered === "string" ||
            typeof rendered === "number" ||
            typeof rendered === "boolean"
          ) {
            value = rendered;
          } else if (React.isValidElement(rendered)) {
            // Extraer texto de elementos React
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
          // Extraer valor directo del objeto
          value = row[col.accessor];
        }
        rowData[col.header] = value;
      });
      return rowData;
    });

    // Crear y descargar archivo Excel
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    XLSX.writeFile(workbook, "exportacion_tabla.xlsx");
  };

  // ===== RENDERIZADO DE FILTROS =====
  
  /**
   * Renderiza un campo de filtro según su tipo
   */
  const renderFilterField = (col: Column<T>, idx: number) => {
    if (!col.filterable || typeof col.accessor !== "string") return null;
    
                const key = col.accessor;
                const currentValue = filters[key] || "";

    // Filtro de estado con opciones predefinidas
                if (key === "estado") {
                  return (
                    <div key={idx} className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {col.header}:
          </label>
                      <select
                        value={currentValue}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-boxdark dark:border-boxdark-2 dark:text-white"
                      >
                        <option value="">Todos</option>
                        <option value="ACTIVO">✅Activos</option>
                        <option value="SIN_VALIDAR">⛔Sin validar</option>
                        <option value="INACTIVO">❌Eliminados</option>
                      </select>
                    </div>
                  );
                }

    // Filtro de fecha
                if (col.type === "date") {
                  return (
                    <div key={idx} className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {col.header}:
          </label>
                      <input
                        type="date"
                        value={currentValue}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-boxdark dark:border-boxdark-2 dark:text-white"
                      />
                    </div>
                  );
                }

    // Filtro de texto (por defecto)
                return (
                  <div key={idx} className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {col.header}:
        </label>
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-boxdark dark:border-boxdark-2 dark:text-white"
                    />
                  </div>
                );
  };

  // ===== RENDERIZADO DE CELDAS =====
  
  /**
   * Renderiza el contenido de una celda según su tipo
   */
  const renderCellContent = (col: Column<T>, row: T) => {
    let cellContent: React.ReactNode;
    
    if (typeof col.accessor === "function") {
      // Usar función personalizada
      cellContent = col.accessor(row);
    } else {
      // Usar acceso directo al objeto
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
          ) : "";
          break;
        case "phone":
          cellContent = Array.isArray(value)
            ? ((value as any[])
                .map((tel) => tel.numero || tel)
                .join(", ")) as React.ReactNode
            : (value as React.ReactNode);
          break;
        default:
          // Formateo especial para campo estado
          if (typeof col.accessor === "string" && col.accessor === "estado") {
            let colorClass = "";
            let label: string = String(value);
            if (value === "ACTIVO") {
              colorClass = "bg-green-100 text-green-800";
              label = "Activo";
            } else if (value === "INACTIVO") {
              colorClass = "bg-red-100 text-red-800";
              label = "Inactivo";
            } else if (value === "SIN_VALIDAR") {
              colorClass = "bg-yellow-100 text-yellow-800";
              label = "Sin validar";
            }
            cellContent = (
              <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
                {label}
              </span>
            );
          } else {
            cellContent = value as React.ReactNode;
          }
      }
    }
    
    return cellContent;
  };

  // ===== RENDERIZADO PRINCIPAL =====
  
  return (
    <div className="overflow-x-auto bg-white dark:bg-boxdark p-4 rounded shadow">
      {/* Sección de filtros */}
      {withFilters && (
        <div className="mb-4 p-4 border border-gray-200 rounded bg-gray-50 dark:bg-boxdark-2 dark:border-boxdark-2">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Filtros</h3>
          <div className="flex flex-wrap gap-4">
            {columns.map((col, idx) => renderFilterField(col, idx))}
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

      {/* Tabla principal */}
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
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex % 2 === 0
                  ? "bg-gray-50 dark:bg-boxdark-2"
                  : "bg-white dark:bg-boxdark"
              }
            >
              {/* Celdas de datos */}
              {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  {renderCellContent(col, row)}
                  </td>
              ))}
              
              {/* Columna de acciones */}
              {withActions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  <div className="flex items-center space-x-2">
                    {/* Botón Ver */}
                    <a
                      href={`${basePath}/ver/${row.id}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="sr-only">Ver</span>
                    </a>
                    
                    {/* Botón Editar */}
                    <a
                      href={`${basePath}/editar/${row.id}`}
                      className="text-green-600 hover:underline flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h12M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                      <span className="sr-only">Editar</span>
                    </a>
                    
                    {/* Botón Eliminar */}
                    <button
                      onClick={() => {
                        setRowIdToDelete(row.id);
                        setShowConfirmDeleteModal(true);
                      }}
                      className="text-red-600 hover:underline flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                      <span className="sr-only">Eliminar</span>
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== MODALES ===== */}
      
      {/* Modal de error de eliminación */}
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
      
      {/* Modal de confirmación de eliminación */}
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full text-center">
            <h3 className="text-xl font-semibold mb-4">Confirmar eliminación</h3>
            <p className="text-gray-700 mb-6">{confirmDeleteMessage || "¿Está seguro que desea eliminar este registro?"}</p>
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
      
      {/* Modal de éxito */}
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
