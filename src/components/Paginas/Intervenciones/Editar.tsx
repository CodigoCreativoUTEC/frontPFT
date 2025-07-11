"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";
import { formatDateTimeForBackend, isoToDateTimeLocal } from "@/components/Helpers/DateUtils";

const EditarIntervencion: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  // Campos del formulario
  const [motivo, setMotivo] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [idTipo, setIdTipo] = useState("");
  const [idEquipo, setIdEquipo] = useState("");
  const [idUsuario, setIdUsuario] = useState("");

  // Opciones de selects
  const [tiposIntervencion, setTiposIntervencion] = useState<any[]>([]);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Cargar datos de la intervención y opciones
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);

        // Cargar opciones en paralelo
        const [tiposData, equiposData, usuariosData, intervencionData] = await Promise.all([
          fetcher<any[]>("/tipoIntervenciones/listar", { method: "GET" }),
          fetcher<any[]>("/equipos/listar", { method: "GET" }),
          fetcher<any[]>("/usuarios/listar", { method: "GET" }),
          fetcher<any>(`/intervenciones/buscar/${id}`, { method: "GET" })
        ]);

        setTiposIntervencion(tiposData.filter(t => t.estado === "ACTIVO"));
        setEquipos(equiposData.filter(e => e.estado === "ACTIVO"));
        setUsuarios(usuariosData.filter(u => u.estado === "ACTIVO"));

        // Cargar datos de la intervención
        if (intervencionData) {
          setMotivo(intervencionData.motivo || "");
          setComentarios(intervencionData.comentarios || "");
          setIdTipo(intervencionData.idTipo?.id?.toString() || "");
          setIdEquipo(intervencionData.idEquipo?.id?.toString() || "");
          setIdUsuario(intervencionData.idUsuario?.id?.toString() || "");

          // Convertir fecha del backend a formato datetime-local
          if (intervencionData.fechaHora) {
            try {
              // Si la fecha es un número (timestamp), convertirlo
              let fechaValue = intervencionData.fechaHora;
              if (typeof fechaValue === 'number') {
                fechaValue = new Date(fechaValue).toISOString();
              }
              
              const fechaLocal = isoToDateTimeLocal(fechaValue);
              if (fechaLocal) {
                setFechaHora(fechaLocal);
              } else {
                // Establecer fecha actual como fallback
                const now = new Date();
                const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                  .toISOString().slice(0, 16);
                setFechaHora(localDateTime);
              }
            } catch (error) {
              console.error('Error parsing date:', error, intervencionData.fechaHora);
              // Establecer fecha actual como fallback
              const now = new Date();
              const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                .toISOString().slice(0, 16);
              setFechaHora(localDateTime);
            }
          }
        }

      } catch (err: any) {
        setError("Error al cargar datos: " + (err?.message || err));
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Validación de campos obligatorios
  const isFormValid = () => {
    return motivo && fechaHora && idTipo && idEquipo && idUsuario;
  };

  // Envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!isFormValid()) {
      setError("Por favor complete todos los campos obligatorios.");
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
      // Convertir la fecha local a ISO string sin zona horaria para el backend
      const fechaISO = formatDateTimeForBackend(fechaHora);

      const intervencion = {
        id: Number(id),
        motivo,
        fechaHora: fechaISO,
        comentarios: comentarios || null,
        idTipo: { id: Number(idTipo) },
        idEquipo: { id: Number(idEquipo) },
        idUsuario: { id: Number(idUsuario) }
      };

      await fetcher("/intervenciones/modificar", {
        method: "PUT",
        body: intervencion,
      });

      setMessage("Intervención modificada exitosamente");

    } catch (err: any) {
      setError("Error al modificar la intervención: " + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  if (loadingData) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-center items-center h-32 p-6.5">
          <div className="text-gray-600 dark:text-gray-300">Cargando datos de la intervención...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Editar intervención
        </h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="p-6.5">
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Motivo de la intervención *
              </label>
              <input
                type="text"
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                placeholder="Describe el motivo de la intervención"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Fecha y hora *
              </label>
              <input
                type="datetime-local"
                value={fechaHora}
                onChange={e => setFechaHora(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Tipo de intervención *
              </label>
              <select
                value={idTipo}
                onChange={e => setIdTipo(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              >
                <option value="">Seleccione</option>
                {tiposIntervencion.map(t => (
                  <option key={t.id} value={t.id}>{t.nombreTipo}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Equipo *
              </label>
              <select
                value={idEquipo}
                onChange={e => setIdEquipo(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              >
                <option value="">Seleccione</option>
                {equipos.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.idInterno} - {e.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full xl:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Usuario responsable *
              </label>
              <select
                value={idUsuario}
                onChange={e => setIdUsuario(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              >
                <option value="">Seleccione</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} {u.apellido} ({u.nombreUsuario})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Comentarios adicionales
            </label>
            <textarea
              rows={6}
              value={comentarios}
              onChange={e => setComentarios(e.target.value)}
              placeholder="Comentarios adicionales sobre la intervención (opcional)"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
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
              disabled={loading}
              className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:opacity-60"
            >
              {loading ? "Actualizando..." : "Actualizar intervención"}
            </button>
          </div>
        </div>
      </form>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-black dark:text-white">¿Desea actualizar esta intervención?</h3>
            <p className="mb-6 text-black dark:text-white">Confirme que los datos modificados son correctos.</p>
            
            <div className="mb-4 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <p className="text-black dark:text-white"><strong>Motivo:</strong> {motivo}</p>
              <p className="text-black dark:text-white"><strong>Fecha:</strong> {new Date(fechaHora).toLocaleString('es-UY')}</p>
              <p className="text-black dark:text-white"><strong>Tipo:</strong> {tiposIntervencion.find(t => t.id === Number(idTipo))?.nombreTipo}</p>
              <p className="text-black dark:text-white"><strong>Equipo:</strong> {equipos.find(e => e.id === Number(idEquipo))?.idInterno} - {equipos.find(e => e.id === Number(idEquipo))?.nombre}</p>
              <p className="text-black dark:text-white"><strong>Usuario:</strong> {usuarios.find(u => u.id === Number(idUsuario))?.nombre} {usuarios.find(u => u.id === Number(idUsuario))?.apellido}</p>
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

export default EditarIntervencion; 