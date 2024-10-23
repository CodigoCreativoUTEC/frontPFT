"use client"; // Asegúrate de incluir esto

import React from "react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from "next/link";
import Image from "next/image";

export default function RegistrarFuncionalidad() {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({ nombreFuncionalidad: '' });
    const [errors, setErrors] = useState<{ nombreFuncionalidad?: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);

    // Validación del formulario
    const validate = () => {
        let tempErrors: { nombreFuncionalidad?: string } = {};

        if (!formData.nombreFuncionalidad) {
            tempErrors.nombreFuncionalidad = "El nombre de la funcionalidad es requerido.";
        }

        setErrors(tempErrors);

        // Verificar si hay algún error
        return Object.values(tempErrors).every(error => error === undefined);
    };

    // Manejador de cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejador del submit del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerError(null); // Limpiar errores de servidor previos

        if (!validate()) {
            return;
        }

        // Asegúrate de enviar el estado "ACTIVO" junto con el nombreFuncionalidad
        const payload = {
            nombreFuncionalidad: formData.nombreFuncionalidad,
            ruta: formData.ruta,
            estado: "ACTIVO" // Asegura que siempre envíes el estado como "ACTIVO"
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funcionalidades/crear`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + (session?.accessToken || ''),
                },
                body: JSON.stringify(payload), // Enviar los datos del formulario
            });

            if (res.ok) {
                alert('Funcionalidad registrada exitosamente.');
                router.push('acceso/');
            } else {
                const errorData = await res.json();
                console.error(errorData);
                setServerError('Error al registrar la funcionalidad.');
            }
        } catch (error) {
            console.error(error);
            setServerError('Error al conectar con el servidor.');
        }
    };

    if (!session) {
        signIn();
        return null;
    }

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-wrap items-center">

                <div className="w-full">
                    <div className="px-12.5 py-17.5 sm:px-25 sm:py-30">
                        <h2 className="mb-9 text-2xl font-bold">
                            Registrar Funcionalidad
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="nombreFuncionalidad" className="block mb-2.5 font-medium">
                                    Nombre de la Funcionalidad
                                </label>
                                <input
                                    type="text"
                                    name="nombreFuncionalidad"
                                    id="nombreFuncionalidad"
                                    value={formData.nombreFuncionalidad}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border py-4 pl-6 pr-10 outline-none focus:border-primary"
                                />
                                {errors.nombreFuncionalidad && (
                                    <p className="text-rose-500">{errors.nombreFuncionalidad}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="ruta" className="block mb-2.5 font-medium">
                                    Ruta de la funcion
                                </label>
                                <input
                                    type="text"
                                    name="ruta"
                                    id="ruta"
                                    value={formData.ruta}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border py-4 pl-6 pr-10 outline-none focus:border-primary"
                                />
                                {errors.ruta && (
                                    <p className="text-rose-500">{errors.ruta}</p>
                                )}
                            </div>

                            {/* Mostrar errores de servidor si existen */}
                            {serverError && (
                                <div className="mb-4 bg-rose-100 border border-rose-500 text-rose-500 p-2 rounded">
                                    {serverError}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-primary py-4 text-white hover:bg-primary-dark"
                            >
                                Registrar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
