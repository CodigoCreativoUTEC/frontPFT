"use client"; // Asegúrate de incluir esto

import React from "react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from "next/link";
import Image from "next/image";

export default function RegistrarIntervencion() {
    const { data: session } = useSession();
    const router = useRouter();

    // Simulación de los idInterno de los equipos
    const equipos = [
        { idInterno: 'EQ001' },
        { idInterno: 'EQ002' },
        { idInterno: 'EQ003' },
        { idInterno: 'EQ004' }
    ];

    const [formData, setFormData] = useState({
        fechaIntervencion: '',
        tipoIntervencion: '',
        motivo: '',
        equipoId: '', // Cambiado a string para el select
        observaciones: ''
    });

    const [errors, setErrors] = useState({
        fechaIntervencion: undefined,
        tipoIntervencion: undefined,
        motivo: undefined,
        equipoId: undefined
    });

    const validate = () => {
        let tempErrors: any = {
            fechaIntervencion: '',
            tipoIntervencion: '',
            motivo: '',
            equipoId: ''
        };

        if (!formData.fechaIntervencion) tempErrors.fechaIntervencion = "La fecha/hora de la intervención es requerida.";
        if (!formData.tipoIntervencion) tempErrors.tipoIntervencion = "El tipo de intervención es requerido.";
        if (!formData.motivo) tempErrors.motivo = "El motivo de la intervención es requerido.";
        if (!formData.equipoId) tempErrors.equipoId = "La identificación del equipo es requerida.";

        setErrors(tempErrors);
        return Object.values(tempErrors).every(error => error === '');
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
            const res = await fetch('http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/intervenciones/crear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Intervención registrada exitosamente.');
                router.push('/ruta-de-exito');
            } else {
                const errorData = await res.json();
                console.error(errorData);
                alert('Error al registrar la intervención.');
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
                            {/* SVG content omitted for brevity */}
                        </span>
                    </div>
                </div>
                <div className="w-full xl:w-1/2">
                    <div className="px-12.5 py-17.5 sm:px-25 sm:py-30">
                        <h2 className="mb-9 text-2xl font-bold">
                            Registrar Intervención
                        </h2>
                        <form onSubmit={handleSubmit}>
                            {/* Fecha/hora de la intervención */}
                            <div className="mb-4">
                                <label htmlFor="fechaIntervencion" className="block mb-2.5 font-medium">
                                    Fecha/hora de la intervención
                                </label>
                                <input
                                    type="datetime-local"
                                    name="fechaIntervencion"
                                    id="fechaIntervencion"
                                    value={formData.fechaIntervencion}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border py-4 pl-6 pr-10 outline-none focus:border-primary"
                                />
                                {errors.fechaIntervencion && <p className="text-rose-500">{errors.fechaIntervencion}</p>}
                            </div>

                            {/* Tipo de intervención */}
                            <div className="mb-4">
                                <label htmlFor="tipoIntervencion" className="block mb-2.5 font-medium">
                                    Tipo de intervención
                                </label>
                                <select
                                    name="tipoIntervencion"
                                    id="tipoIntervencion"
                                    value={formData.tipoIntervencion}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border py-4 pl-6 pr-10 outline-none focus:border-primary"
                                >
                                    <option value="">Seleccione el tipo de intervención</option>
                                    <option value="Prevención">Prevención</option>
                                    <option value="Falla">Falla</option>
                                    <option value="Resolución">Resolución</option>
                                </select>
                                {errors.tipoIntervencion && <p className="text-rose-500">{errors.tipoIntervencion}</p>}
                            </div>

                            {/* Motivo de la intervención */}
                            <div className="mb-4">
                                <label htmlFor="motivo" className="block mb-2.5 font-medium">
                                    Motivo
                                </label>
                                <input
                                    type="text"
                                    name="motivo"
                                    id="motivo"
                                    value={formData.motivo}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border py-4 pl-6 pr-10 outline-none focus:border-primary"
                                />
                                {errors.motivo && <p className="text-rose-500">{errors.motivo}</p>}
                            </div>

                            {/* Identificación del equipo (combobox simulado) */}
                            <div className="mb-4">
                                <label htmlFor="equipoId" className="block mb-2.5 font-medium">
                                    Identificación del equipo
                                </label>
                                <select
                                    name="equipoId"
                                    id="equipoId"
                                    value={formData.equipoId}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border py-4 pl-6 pr-10 outline-none focus:border-primary"
                                >
                                    <option value="">Seleccione un equipo</option>
                                    {equipos.map(equipo => (
                                        <option key={equipo.idInterno} value={equipo.idInterno}>
                                            {equipo.idInterno}
                                        </option>
                                    ))}
                                </select>
                                {errors.equipoId && <p className="text-rose-500">{errors.equipoId}</p>}
                            </div>

                            {/* Observaciones */}
                            <div className="mb-4">
                                <label htmlFor="observaciones" className="block mb-2.5 font-medium">
                                    Observaciones (opcional)
                                </label>
                                <textarea
                                    name="observaciones"
                                    id="observaciones"
                                    value={formData.observaciones}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border py-4 pl-6 pr-10 outline-none focus:border-primary"
                                />
                            </div>

                            {/* Botón para enviar el formulario */}
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
