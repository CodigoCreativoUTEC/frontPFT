"use client"; // Asegúrate de incluir esto

import React from "react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from "next/link";
import Image from "next/image";

export default function RegistrarMarca() {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({ nombre: '' });
    const [errors, setErrors] = useState<{ nombre: string | undefined }>({
        nombre: undefined
    });

    const validate = () => {
        let tempErrors: { nombre: string | undefined } = { nombre: '' };

        if (!formData.nombre) {
            tempErrors.nombre = "El nombre de la marca es requerido.";
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
        if (!validate()) {
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marca/crear`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.accessToken}`
                    },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Marca registrada exitosamente.');
                router.push('/marcas');
            } else {
                const errorData = await res.json();
                console.error(errorData);
                alert('Error al registrar la marca.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con el servidor.');
            router.push('/marcas');
        }
    };

    if (!session) {
        signIn();
        return null;
    }

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-wrap items-center">
                
                <div className="w-auto">
                    <div className="px-12.5 py-17.5 sm:px-25 sm:py-30">
                        <h2 className="mb-9 text-2xl font-bold">
                            Registrar Marca
                        </h2>
                        <p>Luego de crear una marca podrá asignarla a un modelo en el apartadode modelos</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block mb-2.5 font-medium">
                                    Nombre de la Marca
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
