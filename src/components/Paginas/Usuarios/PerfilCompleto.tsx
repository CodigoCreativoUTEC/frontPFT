"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import fetcher from "@/components/Helpers/Fetcher";
import { Usuario } from "@/types/Usuario";
import Link from "next/link";

interface PerfilCompletoProps {
  showEditButton?: boolean;
}

const PerfilCompleto: React.FC<PerfilCompletoProps> = ({ showEditButton = true }) => {
  const { data: session } = useSession();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) {
        setError("No se pudo obtener el ID del usuario de la sesión");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Para seleccionar necesitamos enviar el ID
        const userData = await fetcher<Usuario>(`/usuarios/seleccionar?id=${session.user.id}`);
        setUsuario(userData);
      } catch (err: any) {
        setError(err.message || "Error al cargar los datos del perfil");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="text-center">
          <p>No se encontraron datos del perfil</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoBadge = (estado: string) => {
    const baseClasses = "inline-flex rounded-full px-3 py-1 text-sm font-medium";
    switch (estado) {
      case "ACTIVO":
        return `${baseClasses} bg-success bg-opacity-10 text-success`;
      case "INACTIVO":
        return `${baseClasses} bg-danger bg-opacity-10 text-danger`;
      case "SIN_VALIDAR":
        return `${baseClasses} bg-warning bg-opacity-10 text-warning`;
      default:
        return `${baseClasses} bg-secondary bg-opacity-10 text-secondary`;
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-black dark:text-white">
            Información del Perfil
          </h3>
          {showEditButton && (
            <Link
              href="/profile/editar"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar
            </Link>
          )}
        </div>
      </div>

      <div className="p-7">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Información Personal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black dark:text-white border-b border-stroke pb-2 dark:border-strokedark">
              Información Personal
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Nombre Completo
              </label>
              <p className="text-black dark:text-white">
                {usuario.nombre} {usuario.apellido}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Cédula
              </label>
              <p className="text-black dark:text-white">{usuario.cedula}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Email
              </label>
              <p className="text-black dark:text-white">{usuario.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Fecha de Nacimiento
              </label>
              <p className="text-black dark:text-white">
                {formatDate(usuario.fechaNacimiento)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Nombre de Usuario
              </label>
              <p className="text-black dark:text-white">
                {usuario.nombreUsuario || "No especificado"}
              </p>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black dark:text-white border-b border-stroke pb-2 dark:border-strokedark">
              Información del Sistema
            </h4>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Estado
              </label>
              <span className={getEstadoBadge(usuario.estado)}>
                {usuario.estado === "ACTIVO" ? "Activo" : 
                 usuario.estado === "INACTIVO" ? "Inactivo" : 
                 usuario.estado === "SIN_VALIDAR" ? "Sin Validar" : usuario.estado}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Perfil
              </label>
              <p className="text-black dark:text-white">
                {usuario.idPerfil?.nombrePerfil || "No asignado"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Institución
              </label>
              <p className="text-black dark:text-white">
                {usuario.idInstitucion?.nombre || "No asignada"}
              </p>
            </div>

            {/* Teléfonos */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Teléfonos
              </label>
              {usuario.usuariosTelefonos && usuario.usuariosTelefonos.length > 0 ? (
                <div className="space-y-1">
                  {usuario.usuariosTelefonos.map((telefono, index) => (
                    <p key={telefono.id || index} className="text-black dark:text-white">
                      {telefono.numero}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-black dark:text-white">No registrados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilCompleto; 