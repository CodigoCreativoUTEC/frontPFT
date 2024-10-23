"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { da } from "date-fns/locale";

interface Usuario {
  nombre: string;
  apellidos: string;
  rol: string;
  posts: number;
  followers: number;
  following: number;
  aboutMe: string;
}

const MostrarPerfil = () => {
  const { data: session, status } = useSession();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const imageUrl = session?.user?.image ?? `https://ui-avatars.com/api/?name=${session?.user?.name}`;

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return; // Esperar hasta que la sesión esté disponible

      const baseEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/obtenerUserEmail?email=${session?.user?.email}`;

      try {
        const response = await fetch(baseEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener el usuario");
        }

        const data = await response.json();

        setUsuario({
            usuariosTelefonos: data.usuariosTelefonos,
            id: data.id,
            cedula: data.cedula,
            email: data.email,
            contrasenia: data.contrasenia,
            fechaNacimiento: data.fechaNacimiento,
            estado: data.estado,
            nombre: data.nombre,
            apellido: data.apellido, 
            nombreUsuario: data.nombreUsuario, 
            Institucion: data.idInstitucion.nombre, 
            Perfil: data.idPerfil.nombrePerfil
          
        });
      } catch (error: any) {
        console.error("Error al obtener el usuario:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, [session]);

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!usuario) {
    return <p>No se pudo cargar la información del usuario.</p>;
  }

  return (
        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="relative z-5 h-25 md:h-20">
                    </div>
                    <div className="px-4 pb-9 text-center lg:pb-8 xl:pb-11.5">
                        <div className="relative z-20 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                            <div className="relative drop-shadow-2">
                            <picture>
              <img src={ imageUrl } className="rounded-full" width={160} height={160} alt="" />
              </picture>

                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                                {usuario.nombre} {usuario.apellido} 
                            </h3>
                            <p className="font-medium">{usuario.Perfil}</p>
                            <div className="mx-auto mb-5.5 mt-4.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    {usuario.cedula}
                  </span>
                                    
                                </div>
                                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    {usuario.estado}
                  </span>
                                    
                                </div>
                                <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    {usuario.Institucion}
                  </span>
                                    
                                </div>
                            </div>

                            <div className="mx-auto max-w-180">
                                <h4 className="font-semibold text-black dark:text-white">
                                    Otros datos
                                </h4>
                                <ul>
                                    <li><big>Email:</big> {usuario.email}</li>
                                    <li><big>Username:</big> {usuario.nombreUsuario}</li>
                                    <li><big>Cumpleaños:</big> {usuario.fechaNacimiento}</li> 
                                    <li><big>Telefonos:</big> {
                                        usuario.usuariosTelefonos.map((telefono) => {
                                            return <p key={telefono.id}>{telefono.numero}</p>
                                        })
                                        }</li>
                                

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
    );
}
export default MostrarPerfil;