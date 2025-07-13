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
  disabled?: boolean;
  /**
   * Si es true, envía el objeto completo en lugar del ID para dropdowns.
   */
  sendFullObject?: boolean;
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
  /**
   * (Opcional) Si es true, usa el formato de ruta /id en lugar de ?id=id
   * Por defecto es false (usa ?id=id)
   */
  useRouteFormat?: boolean;
}

function EditDynamic<T extends { id: number }>({
  fetchUrl,
  updateUrl,
  fields,
  backLink = "",
  successRedirect = "",
  useRouteFormat = false,
}: EditDynamicProps<T>) {
  const { id } = useParams();
  const router = useRouter();
  const [objectData, setObjectData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<
    Record<string, { [key: string]: any }[]>
  >({});
  const [dropdownObjects, setDropdownObjects] = useState<
    Record<string, { [key: string]: any }[]>
  >({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<T | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar el objeto a editar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = useRouteFormat ? `${fetchUrl}/${id}` : `${fetchUrl}?id=${id}`;
        const data = await fetcher<T>(url, { method: "GET" });
        setObjectData(data);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };
    if (id) {
      fetchData();
    }
  }, [id, fetchUrl, useRouteFormat]);

  // Cargar opciones para los dropdowns
  useEffect(() => {
    const loadDropdownOptions = async () => {
      for (const field of fields) {
        if (field.type === "dropdown" && field.optionsEndpoint && !field.options) {
          try {
            const data = await fetcher<{ [key: string]: any }[]>(field.optionsEndpoint, { method: "GET" });
            setDropdownOptions((prev) => ({
              ...prev,
              [field.accessor as string]: data,
            }));
            // También almacenar los objetos completos
            setDropdownObjects((prev) => ({
              ...prev,
              [field.accessor as string]: data,
            }));
          } catch (err: any) {
            console.error(`Error al cargar opciones para ${field.label}:`, err.message);
          }
        }
      }
    };

    loadDropdownOptions();
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
    const field = fields.find((f) => f.accessor === accessor);
    const errorMessage = field ? validateField(field, value) : undefined;
    setFieldErrors((prev) => ({ ...prev, [accessor as string]: errorMessage || "" }));

    // Si es un dropdown con sendFullObject, buscar el objeto completo
    if (field?.type === "dropdown" && field.sendFullObject) {
      const objects = dropdownObjects[accessor as string] || [];
      const selectedObject = objects.find(obj => obj[field.optionValueKey || "id"] == value);
      if (selectedObject) {
        setObjectData({
          ...objectData,
          [accessor]: selectedObject
        });
      } else {
        setObjectData({ ...objectData, [accessor]: value });
      }
    } else {
      setObjectData({ ...objectData, [accessor]: value });
    }
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
    if (hasError) return;

    // Mostrar modal de confirmación
    setFormDataToSubmit(objectData);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!formDataToSubmit) return;
    setSaving(true);
    try {
      // Preparar los datos para enviar
      const dataToSend = { ...formDataToSubmit } as any;
      
      // Para campos que requieren enviar el objeto completo
      fields.forEach(f => {
        if (f.type === "dropdown" && f.sendFullObject && dataToSend[f.accessor]) {
          const selectedId = dataToSend[f.accessor];
          const objects = dropdownObjects[f.accessor as string] || [];
          const selectedObject = objects.find(obj => obj[f.optionValueKey || "id"] == selectedId);
          if (selectedObject) {
            dataToSend[f.accessor] = selectedObject;
          }
        }
      });

      const response = await fetcher<T>(updateUrl, {
        method: "PUT",
        body: dataToSend,
      });
      setSuccessMessage("Modificado correctamente");
      setTimeout(() => {
        setSuccessMessage(null);
        const redirectTo = successRedirect || backLink;
        if (redirectTo) {
          router.push(redirectTo);
        }
      }, 1200);
    } catch (err: any) {
      if (err.message.includes("Unexpected end of JSON input")) {
        setSuccessMessage("Modificado correctamente");
        setTimeout(() => {
          setSuccessMessage(null);
          const redirectTo = successRedirect || backLink;
          if (redirectTo) {
            router.push(redirectTo);
          }
        }, 1200);
      } else {
        setError(err.message || "Error al actualizar el objeto");
      }
    } finally {
      setSaving(false);
      setShowConfirmModal(false);
    }
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => {
          const fieldKey = field.accessor as string;
          let value = objectData[field.accessor];
          
          // Manejar valores especiales para diferentes tipos de campos
          if (field.type === "date" && value) {
            value = new Date(String(value)).toISOString().slice(0, 10) as T[keyof T];
          } else if (field.type === "dropdown" && field.accessor === "idPerfil" && (objectData as any)?.idPerfil) {
            value = (objectData as any).idPerfil.id;
          } else if (field.type === "dropdown" && field.accessor === "pais" && (objectData as any)?.pais) {
            value = (objectData as any).pais.id;
          } else if (field.type === "dropdown" && field.accessor === "idMarca" && (objectData as any)?.idMarca) {
            value = (objectData as any).idMarca.id;
          }

          return (
            <div key={fieldKey} className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.type === "dropdown" ? (
                <select
                  value={typeof value === "string" || typeof value === "number" ? String(value) : ""}
                  onChange={(e) => handleChange(field.accessor, e.target.value)}
                  disabled={field.readOnly || field.disabled}
                  className="rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="">Seleccione {field.label}</option>
                  {(field.options || dropdownOptions[fieldKey] || []).map((option) => {
                    const optionValueKey = field.optionValueKey || "id";
                    const optionLabelKey = field.optionLabelKey || "label";
                    return (
                      <option key={option[optionValueKey]} value={String(option[optionValueKey])}>
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
                  value={typeof value === "string" || typeof value === "number" ? value : ""}
                  onChange={(e) => handleChange(field.accessor, e.target.value)}
                  disabled={field.readOnly || field.disabled}
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

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirmar cambios</h3>
            <p className="text-gray-700 mb-6">¿Está seguro que desea guardar los cambios?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full text-center">
            <h3 className="text-xl font-semibold mb-2 text-green-700">{successMessage}</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditDynamic;
