"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";

const CrearFuncionalidad: React.FC = () => {
  const [nombreFuncionalidad, setNombreFuncionalidad] = useState("");
  const [ruta, setRuta] = useState("");
  const [estado, setEstado] = useState("ACTIVO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const data = await fetcher("/funcionalidades/crear", {
        method: "POST",
        body: {
          nombreFuncionalidad,
          ruta,
          estado,
        },
      });
      setMessage("Funcionalidad creada exitosamente");
      setTimeout(() => {
        router.push(`/funcionalidades/editar/${data.id}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Error al crear la funcionalidad");
    }
    setLoading(false);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-lg mx-auto mt-8 p-8">
      <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">Crear Funcionalidad</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">Nombre de la funcionalidad</label>
          <input
            type="text"
            value={nombreFuncionalidad}
            onChange={e => setNombreFuncionalidad(e.target.value)}
            placeholder="Ingrese el nombre"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">Ruta (endpoint)</label>
          <input
            type="text"
            value={ruta}
            onChange={e => setRuta(e.target.value)}
            placeholder="/api/ejemplo"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            required
          />
        </div>
        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">Estado</label>
          <select
            value={estado}
            onChange={e => setEstado(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            required
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
            <option value="SIN_VALIDAR">Sin validar</option>
          </select>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {message && <div className="mb-4 text-green-600">{message}</div>}
        <input
          type="submit"
          value={loading ? "Creando..." : "Crear funcionalidad"}
          disabled={loading}
          className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-60"
        />
      </form>
    </div>
  );
};

export default CrearFuncionalidad;
