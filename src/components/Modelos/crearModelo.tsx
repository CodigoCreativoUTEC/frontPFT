"use client";

import React from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from "next/link";
import Image from "next/image";

export default function RegistrarModelo() {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({ nombre: '' });
    const [errors, setErrors] = useState({
        nombre: undefined
    });

    const validate = () => {
        let tempErrors = {
            nombre: undefined
        };
        if (!formData.nombre) {
            // @ts-ignore
            tempErrors.nombre = "El nombre del modelo es requerido.";
        }
        setErrors(tempErrors);
        return Object.values(tempErrors).every(error => error === '');
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        try {
            const res = await fetch('http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/modelos/crear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Modelo registrado exitosamente.');
                router.push('/ruta-de-éxito'); // Adjust the success route as needed
            } else {
                const errorData = await res.json();
                console.error(errorData);
                alert('Error al registrar el modelo.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con el servidor.');
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
                            <svg
                                width="350"
                                height="350"
                                viewBox="0 0 350 350"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* SVG content */}
                            </svg>
                        </span>
                    </div>
                </div>
                <div className="w-full xl:w-1/2">
                    <div className="px-12.5 py-17.5 sm:px-25 sm:py-30">
                        <h2 className="mb-9 text-2xl font-bold">
                            Registrar Modelo
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block mb-2.5 font-medium">
                                    Nombre del Modelo
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
