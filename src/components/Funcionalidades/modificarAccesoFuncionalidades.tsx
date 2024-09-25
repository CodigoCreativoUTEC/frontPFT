"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReferrerEnum } from '@/types';
import Image from "next/image";
import Link from "next/link";

// Perfiles hardcoded
const perfiles = [
    { id: 1, nombre: "Perfil A" },
    { id: 2, nombre: "Perfil B" },
    { id: 3, nombre: "Perfil C" }
];

// Funcionalidades hardcoded
const funcionalidades = [
    { id: 1, nombre: "Funcionalidad A"},
    { id: 2, nombre: "Funcionalidad B"},
    { id: 3, nombre: "Funcionalidad C"}
];

// Funcionalidades asociadas a los perfiles
const funcionalidadesPorPerfil = {
    1: [1, 3], // Perfil A tiene Funcionalidad A y C
    2: [2],    // Perfil B tiene Funcionalidad B
    3: [1, 2, 3] // Perfil C tiene todas las funcionalidades
};

const ModificarAccesoFuncionalidades = () => {
    const router = useRouter();
    const [perfilSeleccionado, setPerfilSeleccionado] = useState<number | null>(null);
    const [funcionalidadesPerfil, setFuncionalidadesPerfil] = useState<number[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        // Cada vez que se selecciona un perfil, carga las funcionalidades asociadas
        if (perfilSeleccionado !== null) {
            // @ts-ignore
            setFuncionalidadesPerfil(funcionalidadesPorPerfil[perfilSeleccionado] || []);
        }
    }, [perfilSeleccionado]);

    const handlePerfilChange = (e: { target: { value: string; }; }) => {
        const perfilId = Number(e.target.value);
        setPerfilSeleccionado(perfilId);
    };

    const handleCheckboxChange = (funcionalidadId: number) => {
        // Si la funcionalidad está ya seleccionada, la desmarcamos, sino, la marcamos
        setFuncionalidadesPerfil(prev =>
            prev.includes(funcionalidadId)
                ? prev.filter(id => id !== funcionalidadId)
                : [...prev, funcionalidadId]
        );
    };

    const validateForm = () => {
        const newErrors = [];
        if (perfilSeleccionado === null) newErrors.push("Debe seleccionar un perfil.");
        if (funcionalidadesPerfil.length === 0) newErrors.push("Debe seleccionar al menos una funcionalidad.");
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        alert(`Cambios guardados para el perfil ${perfilSeleccionado} (simulado)`);
        // Aquí podrías enviar los cambios al backend o manejar el estado.
        router.push('/perfiles'); // Redirigir al listado de perfiles o a la vista correspondiente
    };

    return (
        <div className="flex flex-wrap items-start">
            <div className="hidden w-full xl:block xl:w-1/4">
                <div className="px-6 py-7.5 text-center">
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
                        Bienvenido al sistema de gestión de mantenimiento.
                    </p>
                </div>
            </div>
            <div className='flex flex-wrap items-start'>
                <div className='w-full p-4'>
                    <form onSubmit={(e) => e.preventDefault()}>
                        {errors.length > 0 && (
                            <div className='bg-rose-200 p-2 mb-4'>
                                <ul>
                                    {errors.map((error, index) => (
                                        <li key={index} className='text-rose-700'>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Combobox de selección de perfil */}
                        <div className='mb-4'>
                            <label className='block mb-2 text-sm font-medium text-gray-700'>Seleccionar Perfil:</label>
                            <select
                                name='perfil'
                                value={perfilSeleccionado ?? ''}
                                onChange={handlePerfilChange}
                                className='w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                            >
                                <option value='' disabled>Seleccione un perfil</option>
                                {perfiles.map(perfil => (
                                    <option key={perfil.id} value={perfil.id}>{perfil.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Lista de checkboxes de funcionalidades */}
                        <div className='mb-4'>
                            <label className='block mb-2 text-sm font-medium text-gray-700'>Funcionalidades:</label>
                            {funcionalidades.map(funcionalidad => (
                                <div key={funcionalidad.id} className='flex items-center mb-2'>
                                    <input
                                        type="checkbox"
                                        id={`func-${funcionalidad.id}`}
                                        checked={funcionalidadesPerfil.includes(funcionalidad.id)}
                                        onChange={() => handleCheckboxChange(funcionalidad.id)}
                                        className='mr-2'
                                    />
                                    <label htmlFor={`func-${funcionalidad.id}`} className='text-sm text-gray-700'>
                                        {funcionalidad.nombre}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Botones de acción */}
                        <button
                            type='button'
                            onClick={handleSubmit}
                            className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700'
                        >
                            Guardar Cambios
                        </button>
                        <button
                            type='button'
                            onClick={() => router.push('/funcionalidades')}
                            className='px-4 py-2 ml-2 text-white bg-gray-500 rounded hover:bg-gray-700'
                        >
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModificarAccesoFuncionalidades;
