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
  columns: Column<T>[];
  data: T[];
  /** Si true, muestra la interfaz de filtros encima de la tabla */
  withFilters?: boolean;
  /**
   * Callback opcional que se ejecuta al hacer la búsqueda con los filtros.
   * Por ejemplo, para hacer una llamada a la API con los filtros.
   */
  onSearch?: (filters: Record<string, string>) => void;
  /**
   * Filtros iniciales (si se desean precargar algunos valores).
   */
  initialFilters?: Record<string, string>;
  /**
   * Si true, agrega una columna de acciones (Ver, Editar, Eliminar) al final de la tabla.
   */
  withActions?: boolean;
  /**
   * URL base para la operación de eliminación (usada en la lógica por defecto).
   * Se llamará a `${deleteUrl}` enviando el objeto obtenido.
   */
  deleteUrl?: string;
  /**
   * Base path para generar los enlaces de "Ver" y "Editar".  
   * Por ejemplo, "/usuarios". Si no se define, se utilizará una cadena vacía.
   */
  basePath?: string;
  /**
   * Callback opcional para la eliminación.
   * Si se define, se usará en lugar de la lógica por defecto.
   * Debe recibir el id y la fila completa, y retornar una promesa que resuelva
   * un objeto con al menos una propiedad "message".
   */
  onDelete?: (id: number, row: T) => Promise<{ message: string }>;
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
  const [internalData, setInternalData] = useState<T[]>(data);
  // Actualizar data interna si la prop data cambia
  useEffect(() => {
    setInternalData(data);
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
    // Encuentra la fila correspondiente
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
      const errorMsg = error?.response?.message || error.message || "Error al inactivar el usuario.";
      setDeletionError(errorMsg);
      setShowDeletionErrorModal(true);
    }
  };

  return (
    <div>
      {/* Sección de filtros */}
      {withFilters && (
        <div
          style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          <h3>Filtros</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {columns.map((col, idx) => {
              // Se muestra filtro si la columna es filtrable y su accessor es string
              if (col.filterable && typeof col.accessor === "string") {
                const key = col.accessor;
                const currentValue = filters[key] || "";
                // Si el campo es "estado", renderizamos un dropdown con opciones predefinidas
                if (key === "estado") {
                  return (
                    <div key={idx}>
                      <label>{col.header}:</label>
                      <br />
                      <select
                        value={currentValue}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                      >
                        <option value="">TODOS</option>
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="SIN_VALIDAR">SIN_VALIDAR</option>
                        <option value="INACTIVO">INACTIVO</option>
                      </select>
                    </div>
                  );
                }
                // Si es de tipo "date", usamos el input nativo de tipo date
                if (col.type === "date") {
                  return (
                    <div key={idx}>
                      <label>{col.header}:</label>
                      <br />
                      <input
                        type="date"
                        value={currentValue}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                      />
                    </div>
                  );
                }
                // Para los demás, usar un input de texto
                return (
                  <div key={idx}>
                    <label>{col.header}:</label>
                    <br />
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleSearch} style={{ marginRight: "10px" }}>
              Buscar
            </button>
            <button onClick={handleClearFilters}>Borrar Filtros</button>
          </div>
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}
              >
                {col.header}
              </th>
            ))}
            {withActions && (
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
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
                      cellContent =
                        value && typeof value === "string"
                          ? new Date(value).toLocaleDateString()
                          : "";
                      break;
                    case "image":
                      cellContent = value ? (
                        <img
                          src={value as string}
                          alt={col.header}
                          style={{ maxWidth: "100px" }}
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
                  <td
                    key={colIndex}
                    style={{ border: "1px solid #ccc", padding: "8px" }}
                  >
                    {cellContent}
                  </td>
                );
              })}

              {withActions && (
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <a
                      href={`${basePath}/ver/${row.id}`}
                      style={{ textDecoration: "underline", color: "blue" }}
                    >
                      Ver
                    </a>
                    <a
                      href={`${basePath}/editar/${row.id}`}
                      style={{ textDecoration: "underline", color: "blue" }}
                    >
                      Editar
                    </a>
                    <button
                      onClick={() => handleDelete(row.id)}
                      style={{
                        color: "red",
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                      }}
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

      {/* Modal de error para eliminación */}
      {showDeletionErrorModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "4px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h3>Error al eliminar</h3>
            <p>{deletionError}</p>
            <button onClick={() => setShowDeletionErrorModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DynamicTable;
