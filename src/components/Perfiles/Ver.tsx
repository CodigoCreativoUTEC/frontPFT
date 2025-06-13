"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";
import DetailView, { Column } from "@/components/Helpers/DetailView";

interface Funcionalidad {
    id: number;
    nombreFuncionalidad: string;
    ruta: string;
    estado: string;
    perfiles?: { id: number }[];
}

interface Perfil {
    id: number;
    nombrePerfil: string;
    estado: string;
}

const VerPerfil: React.FC = () => {
    const { id } = useParams();
    const [perfil, setPerfil] = useState<Perfil | null>(null);
    const [funcionalidades, setFuncionalidades] = useState<Funcionalidad[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchPerfil = async () => {
            setLoading(true);
            try {
                const data = await fetcher<Perfil>(`/perfiles/seleccionar?id=${id}`, {
                    method: "GET",
                });
                console.log('Perfil cargado:', data);
                setPerfil(data);
            } catch (err: any) {
                setError(err.message);
            }
            setLoading(false);
        };

        const fetchFuncionalidades = async () => {
            try {
                const data = await fetcher<Funcionalidad[]>('/funcionalidades/listar', {
                    method: "GET",
                });
                console.log('Funcionalidades cargadas:', data);
                setFuncionalidades(data);
            } catch (err: any) {
                console.error('Error al cargar funcionalidades:', err);
            }
        };

        if (id) {
            fetchPerfil();
            fetchFuncionalidades();
        }
    }, [id]);

    // Configuración de columnas para mostrar los datos
    const columns: Column<Perfil>[] = [
        { header: "ID", accessor: "id", type: "number" },
        { header: "Nombre del Perfil", accessor: "nombrePerfil", type: "text" },
        { 
            header: "Estado", 
            accessor: (p) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    p.estado === "ACTIVO" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                    {p.estado}
                </span>
            )
        },
        {
            header: "Funcionalidades",
            accessor: (p) => {
                const funcionalidadesAsignadas = funcionalidades.filter(f => 
                    f.perfiles?.some(perfil => perfil.id === p.id)
                );

                if (funcionalidadesAsignadas.length === 0) {
                    return (
                        <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
                            <p className="text-gray-500">No hay funcionalidades asignadas</p>
                        </div>
                    );
                }

                return (
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            Funcionalidades asignadas ({funcionalidadesAsignadas.length}):
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {funcionalidadesAsignadas.map(f => (
                                <div 
                                    key={f.id}
                                    className="p-2 bg-blue-50 border border-blue-200 rounded-md"
                                >
                                    <div className="font-medium text-blue-900">{f.nombreFuncionalidad}</div>
                                    <div className="text-xs text-blue-600">{f.ruta}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            },
            type: "text"
        }
    ];

    return (
        <>
            {loading && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded mb-4">
                    <p className="text-blue-700">Cargando...</p>
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
                    <p className="text-red-700">Error: {error}</p>
                </div>
            )}
            {!loading && !error && !perfil && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-4">
                    <p className="text-yellow-700">No se encontró el perfil.</p>
                </div>
            )}
            {perfil && (
                <DetailView<Perfil>
                    data={perfil}
                    columns={columns}
                    backLink="/perfiles"
                    showEditButton={true}
                />
            )}
        </>
    );
};

export default VerPerfil;
