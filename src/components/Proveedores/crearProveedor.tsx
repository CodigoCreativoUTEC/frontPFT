"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from "next/link";
import Image from "next/image";
import CountrySelect from "../CountrySelect";

export default function RegistrarProveedor() {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({ nombre: '' });
    const [errors, setErrors] = useState({
        nombre: ''
    });

    // Validar que los campos no estén vacíos
    const validate = () => {
        let tempErrors = {
            nombre: ''
        };

        if (!formData.nombre) {
            tempErrors.nombre = "El nombre del proveedor es requerido.";
        }

        setErrors(tempErrors);

        // Devuelve true si no hay errores (es decir, todos los valores de tempErrors están vacíos)
        return Object.values(tempErrors).every(error => error === '');
    };

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCountryChange = (country: { id: number; nombre: string }) => {
        setFormData(prev => ({ ...prev, pais: country }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario enviado");

        // Verificar si la validación falla
        if (!validate()) {
            console.log("Validación fallida", errors);
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/proveedores/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + (session?.accessToken || ''),
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Proveedor registrado exitosamente.');
                router.push('/ruta-de-exito'); // Ajusta la ruta de éxito según sea necesario
            } else {
                const errorData = await res.json();
                console.error(errorData);
                alert(errorData.message || 'Error al registrar el proveedor.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con el servidor.');
        }
    };

    // Redirigir a la página de inicio de sesión si no hay sesión activa
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
                    </div>
                </div>
                <div className="w-full xl:w-1/2">
                    <div className="px-12.5 py-17.5 sm:px-25 sm:py-30">
                        <h2 className="mb-9 text-2xl font-bold">
                            Registrar Proveedor
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block mb-2.5 font-medium">
                                    Nombre del Proveedor
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border py-4 pl-6 pr-10 outline-none ${errors.nombre ? 'border-red-500' : 'focus:border-primary'}`}
                                />
                                {errors.nombre && <p className="text-rose-500">{errors.nombre}</p>}
                            </div>

                            <div className='mb-4'>
                                <label className='block mb-2 text-sm font-medium text-gray-700'>Pais del Proveedor:</label>
                                <CountrySelect
                                selectedCountry={formData.pais}
                                onCountryChange={handleCountryChange}
                                />
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
