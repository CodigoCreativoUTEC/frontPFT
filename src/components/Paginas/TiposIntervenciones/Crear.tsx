"use client";
import React, { useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";

const CrearTipoIntervencion: React.FC = () => {
  // Campos del formulario
  const [nombreTipo, setNombreTipo] = useState("");

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validación de campos obligatorios
  const isFormValid = () => {
    return nombreTipo.trim() !== "";
  };

  // Envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!isFormValid()) {
      setError("Por favor complete el nombre del tipo de intervención.");
      return;
    }
    
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const tipoIntervencion = {
        nombreTipo: nombreTipo.trim(),
        estado: "ACTIVO"
      };

      const result = await fetcher("/tipoIntervenciones/crear", {
        method: "POST",
        body: tipoIntervencion,
      });

      // El endpoint crear devuelve status 201 sin contenido, por lo que result será null
      setMessage("Tipo de intervención creado exitosamente");
      
      // Limpiar formulario
      setNombreTipo("");

    } catch (err: any) {
      setError("Error al crear el tipo de intervención: " + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Crear nuevo tipo de intervención
        </h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Nombre del tipo de intervención *
            </label>
            <input
              type="text"
              value={nombreTipo}
              onChange={e => setNombreTipo(e.target.value)}
              placeholder="Ej: Mantenimiento preventivo, Reparación, Calibración..."
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
              maxLength={100}
            />
            <p className="mt-1 text-sm text-gray-500">
              Máximo 100 caracteres
            </p>
          </div>

          {error && (
            <div className="mb-4.5 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4.5 p-4 bg-green-100 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:opacity-60"
            >
              {loading ? "Creando..." : "Crear tipo de intervención"}
            </button>
          </div>
        </div>
      </form>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-black dark:text-white">¿Desea crear este tipo de intervención?</h3>
            <p className="mb-6 text-black dark:text-white">Confirme que los datos ingresados son correctos.</p>
            
            <div className="mb-4 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <p className="text-black dark:text-white"><strong>Nombre:</strong> {nombreTipo}</p>
              <p className="text-black dark:text-white"><strong>Estado:</strong> Activo</p>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border border-stroke text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded bg-primary text-white hover:bg-opacity-90"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearTipoIntervencion; 