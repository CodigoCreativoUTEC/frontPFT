"use client";
import React, { useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";

const CrearTipoEquipo: React.FC = () => {
  const [nombreTipo, setNombreTipo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const isFormValid = () => {
    return !!nombreTipo;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!isFormValid()) {
      setError("Por favor complete el nombre del tipo de equipo.");
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
      const tipoEquipo = {
        nombreTipo,
        estado: "ACTIVO"
      };
      await fetcher("/tipoEquipos/crear", {
        method: "POST",
        body: tipoEquipo,
      });
      setMessage("Tipo de equipo creado exitosamente");
      setNombreTipo("");
    } catch (err: any) {
      setError("Error al crear el tipo de equipo: " + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Registrar nuevo tipo de equipo</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="nombreTipo" className="block font-medium mb-1">Nombre *</label>
            <input
              id="nombreTipo"
              type="text"
              value={nombreTipo}
              onChange={e => setNombreTipo(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            />
          </div>
        </div>
        {error && <div className="mt-4 text-red-500">{error}</div>}
        {message && <div className="mt-4 text-green-600">{message}</div>}
        <div className="mt-6 flex justify-end gap-4">
          <input type="submit" value={loading ? "Creando..." : "Crear tipo de equipo"} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer disabled:opacity-60" />
        </div>
      </form>
      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">¿Desea crear este tipo de equipo?</h3>
            <p className="mb-6">Confirme que los datos ingresados son correctos.</p>
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

export default CrearTipoEquipo;
