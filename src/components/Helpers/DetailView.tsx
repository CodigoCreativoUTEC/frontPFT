"use client";
import React from "react";
import Link from "next/link";

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
}

const DetailView = <T extends {}>({ data, columns, backLink }: DetailViewProps<T>) => {
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
      {backLink && (
        <div className="mt-6">
          <Link
            href={backLink}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver al listado
          </Link>
        </div>
      )}
    </div>
  );
};

export default DetailView;
