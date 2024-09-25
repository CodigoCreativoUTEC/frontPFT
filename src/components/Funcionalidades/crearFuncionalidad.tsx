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
    const [formData, setFormData] = useState({ nombre: '' });
    const [errors, setErrors] = useState<{ nombre: string | undefined }>({
        nombre: undefined
    });
    const [serverError, setServerError] = useState<string | null>(null);

    const validate = () => {
        let tempErrors: { nombre: string | undefined } = { nombre: '' };

        if (!formData.nombre) {
            tempErrors.nombre = "El nombre de la funcionalidad es requerido.";
        } else {
            tempErrors.nombre = undefined; // No hay error si se proporciona un nombre
        }

        setErrors(tempErrors);

        // Asegúrate de que no haya ningún error antes de devolver `true`.
        return Object.values(tempErrors).every(error => error === undefined);
    };

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setServerError(null); // Limpiamos errores de servidor anteriores

        if (!validate()) {
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/funcionalidades/crear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Funcionalidad registrada exitosamente.');
                router.push('/ruta-de-exito');
            } else {
                const errorData = await res.json();
                console.error(errorData);
                alert('Error al registrar la funcionalidad.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con el servidor.');
            router.push('/funcionalidades');
        }
    };

    if (!session) {
        signIn();
        return null;
    }

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-wrap items-center">
                <div className="hidden w-full xl:block xl:w-1/2">
                    <div className="px-26 py-17.5 text-center">
                        <Link className="mb-5.5 inline-block" href="/">
                            <Image
                                className="hidden dark:block"
                                src={"/images/logo/LogoCodigo.jpg"}
                                alt="Logo"
                                width={176}
                                height={32}
                            />
                            <Image
                                className="dark:hidden"
                                src={"/images/logo/LogoCodigo.jpg"}
                                alt="Logo"
                                width={176}
                                height={32}
                            />
                        </Link>
                        <p className="2xl:px-20">
                            Bienvenido al ingreso al sistema de gestión de mantenimiento de equipos clínicos hospitalarios.
                        </p>
                        <span className="mt-15 inline-block">
                            {/* SVG content omitted for brevity */}
                        </span>
                    </div>
                </div>
                <div className="w-full xl:w-1/2">
                    <div className="px-12.5 py-17.5 sm:px-25 sm:py-30">
                        <h2 className="mb-9 text-2xl font-bold">
                            Registrar Funcionalidad
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block mb-2.5 font-medium">
                                    Nombre de la Funcionalidad
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border py-4 pl-6 pr-10 outline-none focus:border-primary"
                                />
                                {errors.nombre && <p className="text-rose-500">{errors.nombre}</p>}
                            </div>

                            {/* Mostrar errores de servidor si existen */}
                            {serverError && (
                                <div className="mb-4 bg-red-100 border border-red-500 text-red-500 p-2 rounded">
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
