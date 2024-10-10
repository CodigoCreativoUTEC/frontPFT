"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from "next/link";
import Image from "next/image";

export default function RegistrarModelo() {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({ nombre: '', idMarca: '', estado: 'ACTIVO' });
    const [errors, setErrors] = useState({ nombre: undefined, idMarca: undefined });
    const [marcas, setMarcas] = useState([]);

    // Fetch de marcas desde el endpoint
    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marca/listar`, {
                    headers: { 
                        'Content-Type': 'application/json',
                        "authorization": "Bearer " + (session?.accessToken || ''),  // Incluye el token de sesión
                    },
                });
                if (res.ok) {
                    const marcasData = await res.json();
                    setMarcas(marcasData);
                } else {
                    console.error("Error al obtener marcas.");
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
            }
        };

        if (session) {
            fetchMarcas();
        }
    }, [session]);

    const validate = () => {
        let tempErrors = {
            nombre: undefined,
            idMarca: undefined
        };
        if (!formData.nombre) {
            tempErrors.nombre = "El nombre del modelo es requerido.";
        }
        if (!formData.idMarca) {
            tempErrors.idMarca = "La marca es requerida.";
        }
        setErrors(tempErrors);
        return Object.values(tempErrors).every(error => error === undefined);
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
            const selectedMarca = marcas.find(marca => marca.id === parseInt(formData.idMarca));

            const dataToSend = {
                nombre: formData.nombre,
                idMarca: {
                    id: selectedMarca.id,  
                    nombre: selectedMarca.nombre,  
                    estado: "ACTIVO" 
                },
                estado: "ACTIVO" 
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modelo/crear`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + (session?.accessToken || ''),  // Incluye el token de sesión
                },
                body: JSON.stringify(dataToSend),  // Enviar el objeto completo con la marca
            });

            if (res.ok) {
                alert('Modelo registrado exitosamente.');
                router.push('/modelos'); // Ajusta esta ruta según sea necesario
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
    
                <div className="w-full">
                    <div className="px-12.5 py-17.5 sm:px-25 sm:py-30">
                        <h2 className="mb-9 text-2xl font-bold">
                            Registrar Modelo
                        </h2>
                        <form onSubmit={handleSubmit}>
                            {/* Campo de Nombre del Modelo */}
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

                            {/* Campo de Selección de Marca */}
                            <div className="mb-4">
                                <label htmlFor="idMarca" className="block mb-2.5 font-medium">
                                    Marca
                                </label>
                                <select
                                    name="idMarca"
                                    id="idMarca"
                                    value={formData.idMarca}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border py-4 pl-6 pr-10 outline-none focus:border-primary"
                                >
                                    <option value="">Seleccione una Marca</option>
                                    {marcas.map((marca) => (
                                        <option key={marca.id} value={marca.id}>
                                            {marca.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.idMarca && <p className="text-rose-500">{errors.idMarca}</p>}
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
