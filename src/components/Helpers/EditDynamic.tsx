"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";
import Link from "next/link";

// Interfaz para definir cada campo del formulario
export interface Field<T> {
  /** Etiqueta a mostrar para el campo */
  label: string;
  /** Propiedad del objeto que se editará */
  accessor: keyof T;
  /** Tipo de control: "text", "date", "number", "dropdown", "email", etc. */
  type: "text" | "date" | "number" | "dropdown" | "email";
  /** Opciones estáticas para dropdown (si se requieren) */
  options?: { [key: string]: any }[];
  /**
   * Si no se proporcionan opciones estáticas, se puede indicar un endpoint para obtenerlas.
   * Se espera que retorne un arreglo de objetos.
   */
  optionsEndpoint?: string;
  /**
   * Clave del objeto opción a usar para el valor (default: "id").
   */
  optionValueKey?: string;
  /**
   * Clave del objeto opción a usar para la etiqueta (default: "label").
   */
  optionLabelKey?: string;
  /**
   * Función de validación para el campo.
   * Debe retornar un string con el mensaje de error si el valor no es válido, o undefined si es válido.
   */
  validate?: (value: any, data?: T) => string | undefined;
  /**
   * Si es true, el campo se muestra pero no se permite editar.
   */
  readOnly?: boolean;
}

interface EditDynamicProps<T extends { id: number }> {
  /**
   * Endpoint para obtener los datos del objeto a editar.
   * Ejemplo: "/usuarios/seleccionar"
   */
  fetchUrl: string;
  /**
   * Endpoint para actualizar el objeto.
   * Ejemplo: "/usuarios/editar"
   */
  updateUrl: string;
  /**
   * Configuración de campos a editar.
   */
  fields: Field<T>[];
  /**
   * (Opcional) Ruta a la que se redirigirá si se cancela la edición.
   */
  backLink?: string;
  /**
   * (Opcional) Ruta a la que se redirigirá luego de una actualización exitosa.
   * Si no se define, se redirige al backLink o se queda en la misma página.
   */
  successRedirect?: string;
}

function EditDynamic<T extends { id: number }>({
  fetchUrl,
  updateUrl,
  fields,
  backLink = "",
  successRedirect = "",
}: EditDynamicProps<T>) {
  const { id } = useParams();
  const router = useRouter();
  const [objectData, setObjectData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Para campos dropdown sin opciones estáticas, almacenamos las opciones en un estado
  const [dropdownOptions, setDropdownOptions] = useState<
    Record<string, { [key: string]: any }[]>
  >({});
  // Estado para almacenar errores de validación por campo
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Cargar el objeto a editar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetcher<T>(`${fetchUrl}?id=${id}`, { method: "GET" });
        setObjectData(data);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };
    if (id) {
      fetchData();
    }
  }, [id, fetchUrl]);

  // Para cada campo de tipo dropdown que tenga optionsEndpoint pero no opciones estáticas, obtenerlas
  useEffect(() => {
    fields.forEach((field) => {
      if (field.type === "dropdown" && field.optionsEndpoint && !field.options) {
        (async () => {
          try {
            const data = await fetcher<{ [key: string]: any }[]>(field.optionsEndpoint, { method: "GET" });
            setDropdownOptions((prev) => ({
              ...prev,
              [field.accessor as string]: data,
            }));
          } catch (err: any) {
            console.error(`Error al cargar opciones para ${field.label}:`, err.message);
          }
        })();
      }
    });
  }, [fields]);

  // Función para validar un campo y actualizar los errores locales
  const validateField = (field: Field<T>, value: any): string | undefined => {
    if (field.validate) {
      return field.validate(value, objectData || undefined);
    }
    return undefined;
  };

  const handleChange = (accessor: keyof T, value: any) => {
    if (!objectData) return;
    // Ejecutar validación para este campo
    const field = fields.find((f) => f.accessor === accessor);
    const errorMessage = field ? validateField(field, value) : undefined;
    setFieldErrors((prev) => ({ ...prev, [accessor as string]: errorMessage || "" }));
    setObjectData({ ...objectData, [accessor]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objectData) return;

    // Validar todos los campos antes de enviar
    let hasError = false;
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const value = objectData[field.accessor];
      const errorMessage = validateField(field, value);
      if (errorMessage) {
        hasError = true;
        newErrors[field.accessor as string] = errorMessage;
      }
    });
    setFieldErrors(newErrors);
    if (hasError) return; // No se envía si hay errores

    setSaving(true);
    try {
      const updated = await fetcher<T>(updateUrl, {
        method: "PUT",
        body: objectData,
      });
      const redirectTo = successRedirect || backLink;
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        alert("Objeto actualizado correctamente");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-blue-600">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error: {error}</p>
        {backLink && (
          <button
            onClick={() => router.push(backLink)}
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Volver
          </button>
        )}
      </div>
    );
  }

  if (!objectData) {
    return (
      <div className="p-6">
        <p className="text-yellow-600">No se encontró el objeto.</p>
        {backLink && (
          <button
            onClick={() => router.push(backLink)}
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Volver
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Editar Objeto</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => {
          const fieldKey = field.accessor as string;
          let value = objectData[field.accessor];
          if (field.type === "date" && value) {
            // Para el input date se espera el formato YYYY-MM-DD
            value = new Date(value as string).toISOString().slice(0, 10);
          }
          return (
            <div key={fieldKey} className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.type === "dropdown" ? (
                <select
                  value={value as string | number | undefined}
                  onChange={(e) => handleChange(field.accessor, e.target.value)}
                  disabled={field.readOnly}
                  className="rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="">Seleccione {field.label}</option>
                  {(field.options || dropdownOptions[fieldKey] || []).map((option) => {
                    const optionValueKey = field.optionValueKey || "id";
                    const optionLabelKey = field.optionLabelKey || "label";
                    return (
                      <option key={option[optionValueKey]} value={option[optionValueKey]}>
                        {option[optionLabelKey]}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  type={
                    field.type === "number"
                      ? "number"
                      : field.type === "date"
                      ? "date"
                      : field.type === "email"
                      ? "email"
                      : "text"
                  }
                  value={value || ""}
                  onChange={(e) => handleChange(field.accessor, e.target.value)}
                  disabled={field.readOnly}
                  className="rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              )}
              {fieldErrors[fieldKey] && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors[fieldKey]}</p>
              )}
            </div>
          );
        })}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => router.push(backLink)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditDynamic;
