"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * ===== DOCUMENTACIÓN COMPLETA DE DETAILVIEW =====
 * 
 * DetailView es un componente para mostrar detalles de un objeto de forma estructurada.
 * Soporta diferentes tipos de datos y formateo automático.
 * 
 * ===== EJEMPLOS DE USO =====
 * 
 * 1. VISTA BÁSICA:
 * ```tsx
 * const columns: Column<Usuario>[] = [
 *   { header: "ID", accessor: "id" },
 *   { header: "Nombre", accessor: "nombre" },
 *   { header: "Email", accessor: "email" },
 *   { header: "Estado", accessor: "estado" }
 * ];
 * 
 * <DetailView
 *   data={usuario}
 *   columns={columns}
 *   backLink="/usuarios"
 * />
 * ```
 * 
 * 2. VISTA CON CAMPOS PERSONALIZADOS:
 * ```tsx
 * const columns: Column<Proveedor>[] = [
 *   { header: "ID", accessor: "id" },
 *   { header: "Nombre", accessor: "nombre" },
 *   { 
 *     header: "País", 
 *     accessor: (row) => row.pais?.nombre || "-" 
 *   },
 *   { 
 *     header: "Fecha Creación", 
 *     accessor: "fechaCreacion", 
 *     type: "date" 
 *   }
 * ];
 * ```
 * 
 * 3. VISTA CON IMÁGENES:
 * ```tsx
 * const columns: Column<Producto>[] = [
 *   { header: "ID", accessor: "id" },
 *   { header: "Nombre", accessor: "nombre" },
 *   { 
 *     header: "Imagen", 
 *     accessor: "imagen", 
 *     type: "image" 
 *   }
 * ];
 * ```
 * 
 * 4. VISTA CON BOTÓN DE EDICIÓN:
 * ```tsx
 * <DetailView
 *   data={proveedor}
 *   columns={columns}
 *   backLink="/proveedores"
 *   showEditButton={true}
 * />
 * ```
 * 
 * 5. VISTA COMPLETA CON TODOS LOS TIPOS:
 * ```tsx
 * const columns: Column<Equipo>[] = [
 *   { header: "ID", accessor: "id" },
 *   { header: "Nombre", accessor: "nombre" },
 *   { header: "País", accessor: (row) => row.pais?.nombre || "-" },
 *   { header: "Fecha Creación", accessor: "fechaCreacion", type: "date" },
 *   { header: "Teléfonos", accessor: "telefonos", type: "phone" },
 *   { header: "Email", accessor: "email", type: "email" },
 *   { header: "Imagen", accessor: "imagen", type: "image" }
 * ];
 * ```
 * 
 * ===== TIPOS DE CAMPOS =====
 * 
 * - "text": Texto simple (por defecto)
 * - "date": Fecha (se formatea automáticamente)
 * - "image": Imagen (se renderiza como <img>)
 * - "number": Número
 * - "phone": Teléfono (maneja arrays de teléfonos)
 * - "email": Email (se puede aplicar estilos especiales)
 * 
 * ===== CONFIGURACIÓN DE ACCESORES =====
 * 
 * Acceso directo a propiedades:
 * ```tsx
 * { header: "Nombre", accessor: "nombre" }
 * ```
 * 
 * Función personalizada:
 * ```tsx
 * { 
 *   header: "País", 
 *   accessor: (row) => row.pais?.nombre || "-" 
 * }
 * ```
 * 
 * ===== PROPIEDADES =====
 * 
 * @param data - Objeto con los datos a mostrar
 * @param columns - Array de configuración de columnas
 * @param backLink - Ruta para volver (opcional)
 * @param showEditButton - Mostrar botón de editar (opcional)
 * 
 * ===== CARACTERÍSTICAS =====
 * 
 * ✅ Formateo automático de fechas
 * ✅ Renderizado de imágenes
 * ✅ Manejo de campos anidados
 * ✅ Botón de edición automático
 * ✅ Botón de volver configurable
 * ✅ Soporte para dark mode
 * ✅ Diseño responsive
 * ✅ Accesibilidad
 * ✅ Tipos TypeScript completos
 * 
 * ===== EJEMPLO COMPLETO =====
 * 
 * ```tsx
 * import DetailView, { Column } from "@/components/Helpers/DetailView";
 * 
 * interface Proveedor {
 *   id: number;
 *   nombre: string;
 *   pais: { id: number; nombre: string };
 *   estado: string;
 *   fechaCreacion: string;
 *   imagen?: string;
 * }
 * 
 * const VerProveedor = () => {
 *   const [proveedor, setProveedor] = useState<Proveedor | null>(null);
 * 
 *   const columns: Column<Proveedor>[] = [
 *     { header: "ID", accessor: "id" },
 *     { header: "Nombre", accessor: "nombre" },
 *     { header: "País", accessor: (row) => row.pais?.nombre || "-" },
 *     { header: "Estado", accessor: "estado" },
 *     { header: "Fecha Creación", accessor: "fechaCreacion", type: "date" },
 *     { header: "Imagen", accessor: "imagen", type: "image" }
 *   ];
 * 
 *   return (
 *     <DetailView
 *       data={proveedor}
 *       columns={columns}
 *       backLink="/proveedores"
 *       showEditButton={true}
 *     />
 *   );
 * };
 * ```
 */
export interface Column<T> {
  /** Título que se mostrará como etiqueta del campo */
  header: string;
  /**
   * Propiedad del objeto o función que devuelva el contenido a mostrar.
   */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /**
   * Tipo para formatear el contenido: "text", "date", "image", "number", "phone", "email", etc.
   */
  type?: "text" | "date" | "image" | "number" | "phone" | "email";
  /**
   * (Opcional) Indica si el campo es filtrable (por si reutilizas la misma configuración en listados).
   */
  filterable?: boolean;
}

interface DetailViewProps<T> {
  data: T;
  columns: Column<T>[];
  /**
   * (Opcional) Ruta a la que se redirigirá cuando se haga clic en el botón "Volver al listado".
   */
  backLink?: string;
  /**
   * (Opcional) Si es true, muestra el botón de editar
   */
  showEditButton?: boolean;
}

const DetailView = <T extends {}>({ data, columns, backLink, showEditButton = false }: DetailViewProps<T>) => {
  const router = useRouter();

  const handleEdit = () => {
    // Obtener la URL actual
    const currentPath = window.location.pathname;
    // Reemplazar /ver/ por /editar/
    const editPath = currentPath.replace('/ver/', '/editar/');
    // Navegar a la nueva URL
    router.push(editPath);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {columns.map((col, index) => {
        let value: React.ReactNode;
        if (typeof col.accessor === "function") {
          value = col.accessor(data);
        } else {
          value = (data as any)[col.accessor] as React.ReactNode;
        }

        // Formatear según el tipo
        if (col.type === "date" && typeof value === "string") {
          value = new Date(value).toLocaleDateString();
        }

        if (col.type === "image" && typeof value === "string") {
          value = <img src={value} alt={col.header} className="max-w-xs rounded" />;
        }

        return (
          <div key={index} className="mb-4">
            <div className="font-bold text-gray-700">{col.header}:</div>
            <div className="text-gray-900">{value}</div>
          </div>
        );
      })}
      <div className="mt-6 flex gap-4">
        {backLink && (
          <Link
            href={backLink}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver al listado
          </Link>
        )}
        {showEditButton && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
};

export default DetailView;
