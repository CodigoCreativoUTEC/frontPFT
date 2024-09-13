"use client";
import { useEffect, useState } from 'react';
import { UsuarioModel, ReferrerEnum } from '@/types';
import UsuariosList from '@/components/Usuarios';
import { signIn, useSession } from 'next-auth/react';

const UsuariosRead = () => {
    const { data: session, status } = useSession();
    const [usuarios, setUsuarios] = useState<UsuarioModel[]>([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState<UsuarioModel[]>([]);
    const [nombreFilter, setNombreFilter] = useState<string>('');
    const [apellidoFilter, setApellidoFilter] = useState<string>('');
    const [nombreUsuarioFilter, setNombreUsuarioFilter] = useState<string>('');
    const [emailFilter, setEmailFilter] = useState<string>('');
    const [estadoFilter, setEstadoFilter] = useState<string>('');
    const [tipoUsuarioFilter, setTipoUsuarioFilter] = useState<string | null>(null);
    const [tiposUsuario, setTiposUsuario] = useState<string[]>([]);

    const fetcher = async () => {
        const res = await fetch("http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/ListarTodosLosUsuarios", {
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + (session?.accessToken || ''),
            },
        });
        const result = await res.json();
        console.log(result);
        setUsuarios(result);
        setFilteredUsuarios(result);
        populateFilters(result);
    };

    const populateFilters = (usuarios: UsuarioModel[]) => {
        console.log(result)
        const tiposSet = new Set<string>();
        usuarios.forEach((usuario: UsuarioModel) => {
            if (usuario.idPerfil?.nombrePerfil) {
                tiposSet.add(usuario.idPerfil.nombrePerfil);
            }
        });
        setTiposUsuario(Array.from(tiposSet));
    };

    useEffect(() => {
        fetcher().then(() => console.log("Obteniendo usuarios"));
    }, []);

    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNombreFilter(e.target.value);
        filterUsuarios(e.target.value, apellidoFilter, nombreUsuarioFilter, emailFilter, estadoFilter, tipoUsuarioFilter);
    };

    const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApellidoFilter(e.target.value);
        filterUsuarios(nombreFilter, e.target.value, nombreUsuarioFilter, emailFilter, estadoFilter, tipoUsuarioFilter);
    };

    const handleNombreUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNombreUsuarioFilter(e.target.value);
        filterUsuarios(nombreFilter, apellidoFilter, e.target.value, emailFilter, estadoFilter, tipoUsuarioFilter);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailFilter(e.target.value);
        filterUsuarios(nombreFilter, apellidoFilter, nombreUsuarioFilter, e.target.value, estadoFilter, tipoUsuarioFilter);
    };

    const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEstadoFilter(e.target.value);
        filterUsuarios(nombreFilter, apellidoFilter, nombreUsuarioFilter, emailFilter, e.target.value, tipoUsuarioFilter);
    };

    const handleTipoUsuarioChange = (tipo: string) => {
        setTipoUsuarioFilter(tipo);
        filterUsuarios(nombreFilter, apellidoFilter, nombreUsuarioFilter, emailFilter, estadoFilter, tipo);
    };

    const handleClearFilters = () => {
        setNombreFilter('');
        setApellidoFilter('');
        setNombreUsuarioFilter('');
        setEmailFilter('');
        setEstadoFilter('');
        setTipoUsuarioFilter(null);
        setFilteredUsuarios(usuarios);
    };

    const filterUsuarios = (
        nombre: string,
        apellido: string,
        nombreUsuario: string,
        email: string,
        estado: string,
        tipoUsuario: string | null
    ) => {
        let filtered = usuarios.filter((usuario: UsuarioModel) => {
            let matchesNombre = !nombre || usuario.nombre.toLowerCase().includes(nombre.toLowerCase());
            let matchesApellido = !apellido || usuario.apellido.toLowerCase().includes(apellido.toLowerCase());
            let matchesNombreUsuario = !nombreUsuario || usuario.nombreUsuario.toLowerCase().includes(nombreUsuario.toLowerCase());
            let matchesEmail = !email || usuario.email.toLowerCase().includes(email.toLowerCase());
            let matchesEstado = !estado || usuario.estado === estado;
            let matchesTipoUsuario = !tipoUsuario || usuario.idPerfil?.nombrePerfil === tipoUsuario;

            return matchesNombre && matchesApellido && matchesNombreUsuario && matchesEmail && matchesEstado && matchesTipoUsuario;
        });
        setFilteredUsuarios(filtered);
    };

    if (!session) { signIn(); return null; }

    return (
        <div className='rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
            <div className='mb-4 flex flex-wrap gap-4'>
                {/* Nombre Input */}
                <input
                    type="text"
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Nombre"
                    value={nombreFilter}
                    onChange={handleNombreChange}
                />

                {/* Apellido Input */}
                <input
                    type="text"
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Apellido"
                    value={apellidoFilter}
                    onChange={handleApellidoChange}
                />

                {/* Nombre de Usuario Input */}
                <input
                    type="text"
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Nombre de Usuario"
                    value={nombreUsuarioFilter}
                    onChange={handleNombreUsuarioChange}
                />

                {/* Email Input */}
                <input
                    type="text"
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Email"
                    value={emailFilter}
                    onChange={handleEmailChange}
                />

                {/* Estado Select */}
                <select
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={estadoFilter}
                    onChange={handleEstadoChange}
                >
                    <option value="">Selecciona un Estado</option>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="SIN_VALIDAR">SIN_VALIDAR</option>
                    <option value="INACTIVO">INACTIVO</option>
                </select>

                {/* Tipo de Usuario Select */}
                <select
                    className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={tipoUsuarioFilter || ''}
                    onChange={(e) => handleTipoUsuarioChange(e.target.value)}
                >
                    <option value="">Selecciona un Tipo de Usuario</option>
                    {tiposUsuario.map((tipo, index) => (
                        <option key={index} value={tipo}>{tipo}</option>
                    ))}
                </select>

                {/* Botón de Limpiar Filtros */}
                <button
                    onClick={handleClearFilters}
                    className="bg-violet-800 text-white px-3 py-1 rounded"
                >
                    Limpiar Filtros
                </button>
            </div>
            <div className="flex flex-col overflow-x-auto">
                <div className="sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="border-b font-normal dark:border-neutral-500">
                                <tr className='bg-gray-2 text-center dark:bg-meta-4'>
                                    <td className="px-1 py-1">ID</td>
                                    <td className='px-1 py-1'>Nombre</td>
                                    <td className='px-1 py-1'>Apellido</td>
                                    <td className='px-1 py-1'>Cédula</td>
                                    <td className='px-1 py-1'>Fecha Nacimiento</td>
                                    <td className='px-1 py-1'>Teléfonos</td>
                                    <td className='px-1 py-1'>Email</td>
                                    <td className='px-1 py-1'>Nombre de Usuario</td>
                                    <td className='px-1 py-1'>Tipo de Usuario</td>
                                    <td className='px-1 py-1'>Estado</td>
                                    <td className='px-1 py-1 font-medium text-black dark:text-white'>Acciones</td>
                                </tr>
                                </thead>
                                <tbody className='bg-white items-center text-xs'>
                                {filteredUsuarios.map((item: UsuarioModel) => (
                                    <UsuariosList
                                        usuariosTelefonos={item.usuariosTelefonos} key={item.id}
                                        {...item}
                                        fetcher={fetcher}
                                    />
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsuariosRead;