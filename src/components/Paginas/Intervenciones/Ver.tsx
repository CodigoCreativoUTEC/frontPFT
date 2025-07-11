"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";
import { formatDateForDisplay } from "@/components/Helpers/DateUtils";

interface IntervencionDetalle {
  id: number;
  motivo: string;
  fechaHora: string;
  comentarios: string;
  idUsuario: {
    id: number;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    email: string;
    idPerfil: {
      id: number;
      nombrePerfil: string;
    };
    idInstitucion: {
      id: number;
      nombre: string;
    };
  };
  idTipo: {
    id: number;
    nombreTipo: string;
    estado: string;
  };
  idEquipo: {
    id: number;
    idInterno: string;
    nombre: string;
    nroSerie: string;
    idTipo: {
      id: number;
      nombreTipo: string;
    };
    idUbicacion: {
      id: number;
      nombre: string;
      sector: string;
      piso: number;
    };
  };
}

const VerIntervencion: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  const [intervencion, setIntervencion] = useState<IntervencionDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntervencion = async () => {
      try {
        setLoading(true);
        const data = await fetcher<IntervencionDetalle>(`/intervenciones/buscar/${id}`, { 
          method: "GET" 
        });
        
        if (data === null) {
          setError("La intervención solicitada no existe o ha sido eliminada.");
        } else {
          setIntervencion(data);
        }
      } catch (err: any) {
        if (err?.statusCode === 404) {
          setError("La intervención solicitada no existe o ha sido eliminada.");
        } else {
          setError("Error al cargar la intervención: " + (err?.message || err));
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIntervencion();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-center items-center h-32 p-6.5">
          <div className="text-gray-600 dark:text-gray-300">Cargando detalles de la intervención...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6.5">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
          <button
            onClick={() => window.history.back()}
            className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!intervencion) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6.5 text-center">
          <div className="text-gray-600 dark:text-gray-300 mb-4">
            No se encontró la intervención solicitada.
          </div>
          <button
            onClick={() => window.history.back()}
            className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark flex justify-between items-center">
        <div>
          <h3 className="font-medium text-black dark:text-white">
            Detalles de la Intervención
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">ID: {intervencion.id}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = `/intervenciones/editar/${id}`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
          >
            Editar
          </button>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-md border border-stroke px-4 py-2 text-center font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            Volver
          </button>
        </div>
      </div>

      <div className="p-6.5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información de la Intervención */}
          <div className="rounded-sm border border-stroke bg-gray-50 dark:bg-gray-800 p-6">
            <h4 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Información de la Intervención
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Motivo
                </label>
                <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                  {intervencion.motivo}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Fecha y Hora
                </label>
                <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                  {(() => {
                    try {
                      // Si la fecha es un número (timestamp), convertirlo
                      let fechaValue = intervencion.fechaHora;
                      if (typeof fechaValue === 'number') {
                        fechaValue = new Date(fechaValue).toISOString();
                      }
                      
                      const fecha = new Date(fechaValue);
                      if (isNaN(fecha.getTime())) {
                        console.warn('Fecha inválida en componente Ver:', intervencion.fechaHora);
                        return 'Fecha no válida';
                      }
                      return formatDateForDisplay(fecha);
                    } catch (error) {
                      console.error('Error al formatear fecha en componente Ver:', error, intervencion.fechaHora);
                      return 'Error al formatear fecha';
                    }
                  })()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Tipo de Intervención
                </label>
                <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                  {intervencion.idTipo?.nombreTipo || 'No especificado'}
                </p>
              </div>

              {intervencion.comentarios && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Comentarios
                  </label>
                  <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark min-h-[80px]">
                    {intervencion.comentarios}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información del Usuario Responsable */}
          <div className="rounded-sm border border-stroke bg-gray-50 dark:bg-gray-800 p-6">
            <h4 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Usuario Responsable
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Nombre Completo
                </label>
                <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                  {intervencion.idUsuario?.nombre} {intervencion.idUsuario?.apellido}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Nombre de Usuario
                </label>
                <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                  {intervencion.idUsuario?.nombreUsuario || 'No especificado'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </label>
                <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                  {intervencion.idUsuario?.email || 'No especificado'}
                </p>
              </div>

              {intervencion.idUsuario?.idPerfil && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Perfil
                  </label>
                  <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                    {intervencion.idUsuario.idPerfil.nombrePerfil}
                  </p>
                </div>
              )}

              {intervencion.idUsuario?.idInstitucion && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Institución
                  </label>
                  <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                    {intervencion.idUsuario.idInstitucion.nombre}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información del Equipo */}
          <div className="rounded-sm border border-stroke bg-gray-50 dark:bg-gray-800 p-6 lg:col-span-2">
            <h4 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Información del Equipo
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  ID Interno
                </label>
                <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                  {intervencion.idEquipo?.idInterno || 'No especificado'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Nombre del Equipo
                </label>
                <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                  {intervencion.idEquipo?.nombre || 'No especificado'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Número de Serie
                </label>
                <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                  {intervencion.idEquipo?.nroSerie || 'No especificado'}
                </p>
              </div>

              {intervencion.idEquipo?.idTipo && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Tipo de Equipo
                  </label>
                  <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                    {intervencion.idEquipo.idTipo.nombreTipo}
                  </p>
                </div>
              )}

              {intervencion.idEquipo?.idUbicacion && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Ubicación
                  </label>
                  <p className="text-black dark:text-white bg-white dark:bg-boxdark p-3 rounded border border-stroke dark:border-form-strokedark">
                    {intervencion.idEquipo.idUbicacion.nombre} - {intervencion.idEquipo.idUbicacion.sector} 
                    (Piso {intervencion.idEquipo.idUbicacion.piso})
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones adicionales */}
        <div className="mt-8 flex justify-end gap-4 pt-4 border-t border-stroke dark:border-form-strokedark">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center rounded-md bg-success px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
          >
            Imprimir
          </button>
          <button
            onClick={() => window.location.href = `/intervenciones/editar/${id}`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
          >
            Editar Intervención
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerIntervencion; 