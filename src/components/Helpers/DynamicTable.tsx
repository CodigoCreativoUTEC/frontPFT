"use client";
import React, { useEffect, useState } from "react";
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
   * Opciones: "text", "date", "image", "number", "phone", "dropdown", "email"
   */
  type?: "text" | "date" | "image" | "number" | "phone" | "dropdown" | "email";
  /**
   * Indica si este campo es filtrable.
   * Solo funciona con accesores de tipo string (clave del objeto).
   * Los filtros se aplican localmente en los datos cargados.
   */
  filterable?: boolean;
  /**
   * Opciones para dropdown (solo cuando type es "dropdown")
   */
  options?: Array<{ value: string; label: string }>;
  /**
   * Clave específica para el filtro en la URL.
   * Si se proporciona, se usa en lugar del accessor para generar los parámetros de filtro.
   */
  filterKey?: string;
  /**
   * Configuración de imagen (solo cuando type es "image")
   */
  imageConfig?: {
    /** Ancho de la imagen en píxeles */
    width?: number;
    /** Alto de la imagen en píxeles */
    height?: number;
    /** Clases CSS adicionales para la imagen */
    className?: string;
    /** Si true, la imagen mantiene su proporción */
    objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  };
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
  /** Callback personalizado para recargar datos desde el backend. Si se proporciona, se usa en el botón de refrescar en lugar de la lógica interna. */
  readonly onReload?: () => Promise<void>;
  /** Si true, incluye la opción "Sin validar" en el filtro de estado */
  readonly includeSinValidar?: boolean;
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
  onReload,
  includeSinValidar = false,
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
   * Recarga los datos actuales
   */
  const reloadData = async () => {
    // Pequeño delay para evitar problemas de timing
    await new Promise(resolve => setTimeout(resolve, 100));
    
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
        console.error("Error al recargar datos:", error);
        // No mostrar error al usuario, solo log
      }
    } else if (onSearch) {
      // Comportamiento original con callback
      try {
        onSearch(filters);
      } catch (error: any) {
        console.error("Error al recargar datos con onSearch:", error);
      }
    }
  };

  /**
   * Limpia todos los filtros y notifica al componente padre
   */
  const handleClearFilters = async () => {
    const cleared: Record<string, string> = {};
    columns.forEach((col, idx) => {
      if (col.filterable) {
        const key = col.filterKey || (typeof col.accessor === "string" ? col.accessor : `filter_${idx}`);
        cleared[key] = "";
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
   * Prepara el body y URL para la eliminación
   */
  const prepareDeleteRequest = async (id: number): Promise<{ url: string; body?: any }> => {
    let body = undefined;
    let url = deleteUrl!;

    if (sendOnlyId) {
      if (selectUrl) {
        body = { id };
      } else {
        url = `${deleteUrl}?id=${id}`;
      }
    } else if (selectUrl) {
      body = await fetcher<T>(`${selectUrl}?id=${id}`, { method: "GET" });
    } else {
      // Buscar el objeto en los datos locales
      const row = data.find((item) => item.id === id);
      if (row) {
        body = row;
      } else {
        // Si no se encuentra en los datos locales, intentar obtenerlo del servidor
        try {
          const selectUrl = deleteUrl!.replace('/inactivar', '/seleccionar');
          body = await fetcher<T>(`${selectUrl}?id=${id}`, { method: "GET" });
        } catch (error) {
          console.error("Error al obtener objeto para eliminación:", error);
          throw new Error("No se pudo obtener el objeto para eliminar");
        }
      }
    }

    return { url, body };
  };

  /** Callback para manejar la respuesta de eliminación */
  const handleDeleteResponse = (response: { message?: string; error?: string }) => {
    if (response.message) {
      setSuccessMessage(response.message);
      setShowSuccessModal(true);
      if (onReload) {
        onReload();
      } else {
        reloadData();
      }
    } else {
      setDeletionError(response.error || "Error al eliminar.");
      setShowDeletionErrorModal(true);
    }
  };

  /**
   * Maneja errores de eliminación
   */
  const handleDeleteError = (error: any) => {
    const errorMsg =
      error?.response?.error || error?.response?.message || error.message || "Error al eliminar.";
    setDeletionError(errorMsg);
    setShowDeletionErrorModal(true);
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
        response = await onDelete(id, row);
      } else if (deleteUrl) {
        const { url, body } = await prepareDeleteRequest(id);
        response = await fetcher<{ message?: string; error?: string }>(url, {
          method: "PUT",
          ...(body ? { body } : {}),
        });
      } else {
        throw new Error("No se definió una lógica de eliminación.");
      }

      await handleDeleteResponse(response);
    } catch (error: any) {
      handleDeleteError(error);
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
    if (!col.filterable) return null;
    
    // Para accessors que son funciones, usar filterKey o un nombre por defecto
    const key = col.filterKey || (typeof col.accessor === "string" ? col.accessor : `filter_${idx}`);
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
            {includeSinValidar && <option value="SIN_VALIDAR">⛔Sin validar</option>}
            <option value="INACTIVO">❌Eliminados</option>
          </select>
        </div>
      );
    }

    // Filtro de dropdown personalizado
    if (col.type === "dropdown" && col.options) {
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
            {col.options.map((option, optionIdx) => (
              <option key={`${option.value}-${optionIdx}`} value={option.value}>
                {option.label}
              </option>
            ))}
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
   * Renderiza contenido basado en el tipo de columna
   */
  const renderByType = (col: Column<T>, value: any): React.ReactNode => {
    switch (col.type) {
      case "date":
        return value ? formatDate(value as string) : "";
      case "image":
        return value ? (
          <img
            src={value as string}
            alt={col.header}
            className={`rounded ${col.imageConfig?.className || "max-w-xs"}`}
            style={{
              width: col.imageConfig?.width ? `${col.imageConfig.width}px` : undefined,
              height: col.imageConfig?.height ? `${col.imageConfig.height}px` : undefined,
              objectFit: col.imageConfig?.objectFit || "contain"
            }}
          />
        ) : "";
      case "phone":
        return Array.isArray(value)
          ? (value
              .map((tel) => tel.numero || tel)
              .join(", ")) as React.ReactNode
          : (value as React.ReactNode);
      default:
        return value as React.ReactNode;
    }
  };

  /**
   * Renderiza el estado con formato especial
   */
  const renderEstado = (value: any): React.ReactNode => {
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
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
        {label}
      </span>
    );
  };

  /**
   * Renderiza el contenido de una celda según su tipo
   */
  const renderCellContent = (col: Column<T>, row: T) => {
    if (typeof col.accessor === "function") {
      return col.accessor(row);
    }
    
    const value = row[col.accessor];
    
    // Formateo especial para campo estado
    if (typeof col.accessor === "string" && col.accessor === "estado") {
      return renderEstado(value);
    }
    
    return renderByType(col, value);
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

      {/* Botones de exportar y refrescar */}
      <div className="flex justify-end mb-2 gap-2">
        <button
          onClick={async () => {
            if (onReload) {
              console.log('Recargando con onReload personalizado');
              await onReload();
            } else {
              console.log('Recargando con reloadData interno');
              reloadData();
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-2"
          title="Refrescar datos"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refrescar
        </button>
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center gap-2"
          title="Exportar a Excel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar a Excel
        </button>
      </div>

      {/* Tabla principal */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 dark:bg-boxdark-2">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={`header-${col.header}-${idx}`}
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
              key={`row-${row.id}-${rowIndex}`}
              className={
                rowIndex % 2 === 0
                  ? "bg-gray-50 dark:bg-boxdark-2"
                  : "bg-white dark:bg-boxdark"
              }
            >
              {/* Celdas de datos */}
              {columns.map((col, colIndex) => (
                  <td key={`cell-${row.id}-${col.header}-${colIndex}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
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
