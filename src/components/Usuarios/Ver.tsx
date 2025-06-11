"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";
import DetailView, { Column } from "@/components/Helpers/DetailView";

interface UsuariosTelefonos {
    id: number;
    numero: string;
}

interface IdInstitucion {
    id: number;
    nombre: string;
}

interface IdPerfil {
    id: number;
    nombrePerfil: string;
    estado: string;
}

interface Usuario {
    usuariosTelefonos: UsuariosTelefonos[];
    id: number;
    cedula: string;
    email: string;
    contrasenia: string;
    fechaNacimiento: string;
    estado: string;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    idInstitucion: IdInstitucion;
    idPerfil: IdPerfil;
}

const VerUsuario: React.FC = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsuario = async () => {
            setLoading(true);
            try {
                const data = await fetcher<Usuario>(`/usuarios/seleccionar?id=${id}`, {
                    method: "GET",
                });
                setUsuario(data);
            } catch (err: any) {
                setError(err.message);
            }
            setLoading(false);
        };

        if (id) {
            fetchUsuario();
        }
    }, [id]);

    // Configuración de columnas para mostrar los datos
    const columns: Column<Usuario>[] = [
        { header: "ID", accessor: "id", type: "number" },
        { header: "Cédula", accessor: "cedula", type: "text" },
        { header: "Email", accessor: "email", type: "email" },
        { header: "Nombre", accessor: "nombre", type: "text" },
        { header: "Apellido", accessor: "apellido", type: "text" },
        {
            header: "Fecha de Nacimiento",
            accessor: "fechaNacimiento",
            type: "date",
        },
        { header: "Estado", accessor: "estado", type: "text" },
        { header: "Nombre de Usuario", accessor: "nombreUsuario", type: "text" },
        {
            header: "Institución",
            accessor: (u) => u.idInstitucion.nombre,
            type: "text",
        },
        {
            header: "Perfil",
            accessor: (u) => u.idPerfil.nombrePerfil,
            type: "text",
        },
        {
            header: "Teléfonos",
            accessor: (u) => u.usuariosTelefonos.map((tel) => tel.numero).join(", "),
            type: "phone",
        },
    ];

    return (
        
            <div className="p-6">
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
                {!loading && !error && !usuario && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-4">
                        <p className="text-yellow-700">No se encontró el usuario.</p>
                    </div>
                )}
                {usuario && (
                    <DetailView<Usuario>
                        data={usuario}
                        columns={columns}
                        backLink="/usuarios"
                        showEditButton={true}
                    />
                )}
            </div>
    );
};

export default VerUsuario;
