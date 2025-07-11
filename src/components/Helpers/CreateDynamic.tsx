"use client";
import React, { useState, useEffect } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

/**
 * CreateDynamic - Componente de formulario dinámico para crear objetos vía API
 *
 * Props:
 *  - fields: Array de campos, cada uno con:
 *      label: string
 *      accessor: string
 *      type: "text" | "number" | "dropdown" | "checkbox" | "date"
 *      required?: boolean
 *      options?: { label: string; value: any }[] // para dropdowns estáticos
 *      optionsEndpoint?: string // para dropdowns dinámicos
 *      optionLabelKey?: string // para dropdowns dinámicos
 *      optionValueKey?: string // para dropdowns dinámicos
 *      validate?: (value: any) => string | undefined
 *      placeholder?: string
 *  - createUrl: string (endpoint para el POST)
 *  - successMessage?: string
 *  - errorMessage?: string
 *  - onSuccess?: (data: any) => void
 *
 * Ejemplo de uso para crear un Perfil:
 * <CreateDynamic
 *   createUrl="/perfiles/crear"
 *   fields={[
 *     { label: "Nombre del Perfil", accessor: "nombrePerfil", type: "text", required: true },
 *   ]}
 *   successMessage="Perfil creado exitosamente"
 * />
 *
 * Ejemplo de dropdown dinámico:
 * { label: "Perfil", accessor: "idPerfil", type: "dropdown", required: true,
 *   optionsEndpoint: "/perfiles/listar", optionLabelKey: "nombrePerfil", optionValueKey: "id" }
 */

export type CreateDynamicField = {
  label: string;
  accessor: string;
  type: "text" | "number" | "dropdown" | "checkbox" | "date";
  required?: boolean;
  options?: { label: string; value: any }[];
  optionsEndpoint?: string;
  optionLabelKey?: string;
  optionValueKey?: string;
  validate?: (value: any) => string | undefined;
  placeholder?: string;
  sendFullObject?: boolean; // Si true, envía el objeto completo en lugar del ID
};

type Props = {
  fields: CreateDynamicField[];
  createUrl: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: any) => void;
};

const CreateDynamic: React.FC<Props> = ({ fields, createUrl, successMessage, errorMessage, onSuccess }) => {
  const [form, setForm] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach(f => {
      if (f.type === "checkbox") initial[f.accessor] = false;
      else if (f.type === "date") initial[f.accessor] = "";
      else initial[f.accessor] = "";
    });
    return initial;
  });
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, { label: string; value: any }[]>>({});
  const [dropdownObjects, setDropdownObjects] = useState<Record<string, any[]>>({});
  const [dropdownLoading, setDropdownLoading] = useState<Record<string, boolean>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch dropdown options dinámicos
  useEffect(() => {
    fields.forEach(async (f) => {
      if (f.type === "dropdown" && f.optionsEndpoint && f.optionLabelKey && f.optionValueKey) {
        setDropdownLoading(prev => ({ ...prev, [f.accessor]: true }));
        try {
          const data = await fetcher<any[]>(f.optionsEndpoint, { method: "GET", requiresAuth: true });
          setDropdownOptions(prev => ({
            ...prev,
            [f.accessor]: data.map(opt => ({
              label: opt[f.optionLabelKey!],
              value: opt[f.optionValueKey!],
            })),
          }));
          // También almacenar los objetos completos
          setDropdownObjects(prev => ({
            ...prev,
            [f.accessor]: data,
          }));
        } catch (error) {
          console.error(`Error cargando opciones para ${f.label}:`, error);
          setDropdownOptions(prev => ({ ...prev, [f.accessor]: [] }));
          setDropdownObjects(prev => ({ ...prev, [f.accessor]: [] }));
        } finally {
          setDropdownLoading(prev => ({ ...prev, [f.accessor]: false }));
        }
      }
    });
  }, [fields]);

  // Flatpickr para fechas
  useEffect(() => {
    fields.forEach(f => {
      if (f.type === "date") {
        flatpickr(`#date-${f.accessor}`, {
          dateFormat: "Y-m-d",
          onChange: (selectedDates) => {
            setForm(prev => ({ ...prev, [f.accessor]: selectedDates[0]?.toISOString().split("T")[0] || "" }));
          },
        });
      }
    });
    // eslint-disable-next-line
  }, []);

  const handleChange = (accessor: string, value: any) => {
    setForm(prev => ({ ...prev, [accessor]: value }));
  };

  const validateFields = () => {
    const errors: Record<string, string> = {};
    fields.forEach(f => {
      if (f.required && !form[f.accessor]) {
        errors[f.accessor] = "Este campo es obligatorio";
      }
      if (f.validate) {
        const err = f.validate(form[f.accessor]);
        if (err) errors[f.accessor] = err;
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFields()) setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      // Preparar los datos para enviar
      const dataToSend = { ...form } as any;
      
      // Para campos que requieren enviar el objeto completo
      fields.forEach(f => {
        if (f.type === "dropdown" && f.sendFullObject && form[f.accessor]) {
          const selectedId = form[f.accessor];
          // Si el accessor es idMarca, enviar { id: <number> }
          if (f.accessor === "idMarca") {
            dataToSend[f.accessor] = { id: Number(selectedId) };
          } else {
            const objects = dropdownObjects[f.accessor] || [];
            const selectedObject = objects.find(obj => obj[f.optionValueKey || "id"] == selectedId);
            if (selectedObject) {
              dataToSend[f.accessor] = selectedObject;
            }
          }
        }
      });

      const res = await fetcher(createUrl, {
        method: "POST",
        body: dataToSend,
      });
      setMessage(successMessage || "Creado exitosamente");
      setForm(fields.reduce((acc, f) => {
        acc[f.accessor] = f.type === "checkbox" ? false : "";
        return acc;
      }, {} as Record<string, any>));
      setFieldErrors({});
      if (onSuccess) onSuccess(res);
    } catch (err: any) {
      setError(err.message || errorMessage || "Error al crear");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        {fields.map(f => (
          <div className="mb-4" key={f.accessor}>
            <label className="mb-2.5 block font-medium text-black dark:text-white">{f.label}</label>
            {f.type === "text" && (
              <input
                type="text"
                value={form[f.accessor]}
                onChange={e => handleChange(f.accessor, e.target.value)}
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required={f.required}
              />
            )}
            {f.type === "number" && (
              <input
                type="number"
                value={form[f.accessor]}
                onChange={e => handleChange(f.accessor, e.target.value)}
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required={f.required}
              />
            )}
            {f.type === "dropdown" && (
              <select
                value={String(form[f.accessor] || "")}
                onChange={e => handleChange(f.accessor, e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required={f.required}
                disabled={dropdownLoading[f.accessor]}
              >
                <option value="">
                  {dropdownLoading[f.accessor] ? "Cargando opciones..." : "Seleccione una opción"}
                </option>
                {(f.options || dropdownOptions[f.accessor] || []).map(opt => (
                  <option key={opt.value} value={String(opt.value)}>{opt.label}</option>
                ))}
              </select>
            )}
            {f.type === "checkbox" && (
              <input
                type="checkbox"
                checked={form[f.accessor]}
                onChange={e => handleChange(f.accessor, e.target.checked)}
                className="mr-2"
              />
            )}
            {f.type === "date" && (
              <input
                id={`date-${f.accessor}`}
                type="text"
                value={form[f.accessor]}
                readOnly
                placeholder={f.placeholder || "Seleccione una fecha"}
                className="form-datepicker w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required={f.required}
              />
            )}
            {fieldErrors[f.accessor] && <div className="text-red-500 text-sm mt-1">{fieldErrors[f.accessor]}</div>}
          </div>
        ))}
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {message && <div className="mb-4 text-green-600">{message}</div>}
        <div className="mb-5">
          <input
            type="submit"
            value={loading ? "Creando..." : "Crear"}
            disabled={loading}
            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-60"
          />
        </div>
      </form>
      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">¿Desea crear este registro?</h3>
            <p className="mb-6">Confirme que los datos ingresados son correctos para crear el registro.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-meta-4 dark:hover:bg-meta-3">Cancelar</button>
              <button onClick={handleConfirm} className="px-4 py-2 rounded bg-primary text-white hover:bg-opacity-90">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateDynamic; 