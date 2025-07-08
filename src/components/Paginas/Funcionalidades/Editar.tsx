"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";

interface PerfilDto {
  id: number;
  nombrePerfil: string;
  estado: string;
}

interface FuncionalidadDto {
  id: number;
  nombreFuncionalidad: string;
  ruta: string;
  estado: string;
  perfiles: PerfilDto[];
}

const EditarFuncionalidad: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [funcionalidad, setFuncionalidad] = useState<FuncionalidadDto | null>(null);
  const [perfiles, setPerfiles] = useState<PerfilDto[]>([]);
  const [selectedPerfiles, setSelectedPerfiles] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const funcionalidadData = await fetcher<FuncionalidadDto>(`/funcionalidades/seleccionar/${id}`, { method: "GET" });
        setFuncionalidad(funcionalidadData);
        setSelectedPerfiles(funcionalidadData.perfiles.map(p => p.id));
        const perfilesData = await fetcher<PerfilDto[]>("/perfiles/listar", { method: "GET" });
        setPerfiles(perfilesData);
      } catch (err: any) {
        setError(err.message || "Error al cargar los datos");
      }
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  const handleChange = (field: keyof FuncionalidadDto, value: any) => {
    if (!funcionalidad) return;
    setFuncionalidad({ ...funcionalidad, [field]: value });
  };

  const handlePerfilChange = (perfilId: number) => {
    setSelectedPerfiles(prev =>
      prev.includes(perfilId)
        ? prev.filter(id => id !== perfilId)
        : [...prev, perfilId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!funcionalidad) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const updatedFuncionalidad: FuncionalidadDto = {
        ...funcionalidad,
        perfiles: perfiles.filter(p => selectedPerfiles.includes(p.id)),
      };
      await fetcher("/funcionalidades/modificar", {
        method: "PUT",
        body: updatedFuncionalidad,
      });
      setMessage("Funcionalidad actualizada exitosamente");
    } catch (err: any) {
      setError(err.message || "Error al actualizar la funcionalidad");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-blue-600">Cargando datos...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }
  if (!funcionalidad) {
    return <div className="p-8 text-red-600">No se encontró la funcionalidad</div>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-lg mx-auto mt-8 p-8">
      <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">Editar Funcionalidad</h2>
      <form onSubmit={handleSubmit}>
        {/* Dropdown visual de funcionalidad seleccionada */}
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">Funcionalidad</label>
          <select value={funcionalidad.id} disabled className="w-full rounded-lg border border-stroke bg-gray-100 py-4 pl-6 pr-10 text-black dark:bg-form-input dark:text-white">
            <option value={funcionalidad.id}>{funcionalidad.nombreFuncionalidad}</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">Nombre de la funcionalidad</label>
          <input
            type="text"
            value={funcionalidad.nombreFuncionalidad}
            onChange={e => handleChange("nombreFuncionalidad", e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">Ruta (endpoint)</label>
          <input
            type="text"
            value={funcionalidad.ruta}
            onChange={e => handleChange("ruta", e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            required
          />
        </div>
        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">Estado</label>
          <select
            value={funcionalidad.estado}
            onChange={e => handleChange("estado", e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            required
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
            <option value="SIN_VALIDAR">Sin validar</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">Perfiles con acceso</label>
          <div className="flex flex-col gap-2">
            {perfiles.length === 0 && <span className="text-gray-500">No hay perfiles disponibles</span>}
            {perfiles.map(perfil => (
              <label key={perfil.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPerfiles.includes(perfil.id)}
                  onChange={() => handlePerfilChange(perfil.id)}
                  className="accent-primary"
                />
                <span>{perfil.nombrePerfil} <span className="text-xs text-gray-400">({perfil.estado})</span></span>
              </label>
            ))}
          </div>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {message && <div className="mb-4 text-green-600">{message}</div>}
        <input
          type="submit"
          value={saving ? "Guardando..." : "Guardar cambios"}
          disabled={saving}
          className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-60"
        />
      </form>
    </div>
  );
};

export default EditarFuncionalidad;
