"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EquipoModel, ReferrerEnum } from '@/types';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import DataTable, { TableColumn } from 'react-data-table-component';
import { signIn, useSession } from 'next-auth/react';
import { PencilSquare, Trash, Eye } from 'react-bootstrap-icons';

const EquiposRead = () => {
    const { data: session, status } = useSession();
    const [equipos, setEquipos] = useState<EquipoModel[]>([]);
    const [filteredEquipos, setFilteredEquipos] = useState<EquipoModel[]>([]);
    const [marcas, setMarcas] = useState<string[]>([]);
    const [selectedMarca, setSelectedMarca] = useState<string | null>(null);
    const [modelos, setModelos] = useState<string[]>([]);
    const [selectedModelo, setSelectedModelo] = useState<string | null>(null);
    const [proveedores, setProveedores] = useState<string[]>([]);
    const [selectedProveedor, setSelectedProveedor] = useState<string | null>(null);
    const [paises, setPaises] = useState<string[]>([]);
    const [selectedPais, setSelectedPais] = useState<string | null>(null);
    const [tipos, setTipos] = useState<string[]>([]);
    const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
    const [ubicaciones, setUbicaciones] = useState<string[]>([]);
    const [selectedUbicacion, setSelectedUbicacion] = useState<string | null>(null);
    const [nombreFilter, setNombreFilter] = useState<string>('');
    const [numeroSerieFilter, setNumeroSerieFilter] = useState<string>('');
    const [estadoFilter, setEstadoFilter] = useState<string>("ACTIVO");
    const [fechaAdquiridoFilter, setFechaAdquiridoFilter] = useState<string>('');
    const [idInternoFilter, setIdInternoFilter] = useState<string>('');

    const fetcher = async () => {
        const res = await fetch("http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/equipos/ListarTodosLosEquipos", {
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + (session?.user?.accessToken || ''),
            },
        });
        const result = await res.json();

        const filteredResult = result.filter((equipo: EquipoModel) => equipo.estado !== ReferrerEnum.INACTIVO);
        setEquipos(result);
        setFilteredEquipos(filteredResult);
        populateFilters(result);
    };

    const populateFilters = (equipos: EquipoModel[]) => {
        const marcasSet = new Set<string>();
        const proveedoresSet = new Set<string>();
        const paisesSet = new Set<string>();
        const modelosSet = new Set<string>();
        const tiposSet = new Set<string>();
        const ubicacionesSet = new Set<string>();

        equipos.forEach((equipo: EquipoModel) => {
            marcasSet.add(equipo.idModelo.idMarca.nombre);
            proveedoresSet.add(equipo.idProveedor.nombre);
            paisesSet.add(equipo.idPais.nombre);
            modelosSet.add(equipo.idModelo.nombre);
            tiposSet.add(equipo.idTipo.nombreTipo);
            ubicacionesSet.add(equipo.idUbicacion.nombre);
        });

        setMarcas(Array.from(marcasSet));
        setProveedores(Array.from(proveedoresSet));
        setPaises(Array.from(paisesSet));
        setModelos(Array.from(modelosSet));
        setTipos(Array.from(tiposSet));
        setUbicaciones(Array.from(ubicacionesSet));
    };

    useEffect(() => {
        fetcher().then(() => console.log("Obteniendo equipos"));
    }, []);

    const handleMarcaChange = (marca: string) => {
        setSelectedMarca(marca);
        setSelectedModelo(null);
        filterEquipos(nombreFilter, marca, null, selectedProveedor, selectedPais, selectedTipo, selectedUbicacion, numeroSerieFilter, fechaAdquiridoFilter, idInternoFilter, estadoFilter);
    };

    const handleModeloChange = (modelo: string) => {
        setSelectedModelo(modelo);
        filterEquipos(nombreFilter, selectedMarca, modelo, selectedProveedor, selectedPais, selectedTipo, selectedUbicacion, numeroSerieFilter, fechaAdquiridoFilter, idInternoFilter, estadoFilter);
    };

    const handleProveedorChange = (proveedor: string) => {
        setSelectedProveedor(proveedor);
        filterEquipos(nombreFilter, selectedMarca, selectedModelo, proveedor, selectedPais, selectedTipo, selectedUbicacion, numeroSerieFilter, fechaAdquiridoFilter, idInternoFilter, estadoFilter);
    };

    const handlePaisChange = (pais: string) => {
        setSelectedPais(pais);
        filterEquipos(nombreFilter, selectedMarca, selectedModelo, selectedProveedor, pais, selectedTipo, selectedUbicacion, numeroSerieFilter, fechaAdquiridoFilter, idInternoFilter, estadoFilter);
    };

    const handleTipoChange = (tipo: string) => {
        setSelectedTipo(tipo);
        filterEquipos(nombreFilter, selectedMarca, selectedModelo, selectedProveedor, selectedPais, tipo, selectedUbicacion, numeroSerieFilter, fechaAdquiridoFilter, idInternoFilter, estadoFilter);
    };

    const handleUbicacionChange = (ubicacion: string) => {
        setSelectedUbicacion(ubicacion);
        filterEquipos(nombreFilter, selectedMarca, selectedModelo, selectedProveedor, selectedPais, selectedTipo, ubicacion, numeroSerieFilter, fechaAdquiridoFilter, idInternoFilter, estadoFilter);
    };

    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNombreFilter(e.target.value);
        filterEquipos(e.target.value, selectedMarca, selectedModelo, selectedProveedor, selectedPais, selectedTipo, selectedUbicacion, numeroSerieFilter, fechaAdquiridoFilter, idInternoFilter, estadoFilter);
    };

    const handleNumeroSerieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumeroSerieFilter(e.target.value);
        filterEquipos(nombreFilter, selectedMarca, selectedModelo, selectedProveedor, selectedPais, selectedTipo, selectedUbicacion, e.target.value, fechaAdquiridoFilter, idInternoFilter, estadoFilter);
    };

    const handleFechaAdquiridoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFechaAdquiridoFilter(e.target.value);
        filterEquipos(nombreFilter, selectedMarca, selectedModelo, selectedProveedor, selectedPais, selectedTipo, selectedUbicacion, numeroSerieFilter, e.target.value, idInternoFilter, estadoFilter);
    };

    const handleIdInternoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIdInternoFilter(e.target.value);
        filterEquipos(nombreFilter, selectedMarca, selectedModelo, selectedProveedor, selectedPais, selectedTipo, selectedUbicacion, numeroSerieFilter, fechaAdquiridoFilter, e.target.value, estadoFilter);
    };

    const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEstadoFilter(e.target.value);
        filterEquipos(nombreFilter, selectedMarca, selectedModelo, selectedProveedor, selectedPais, selectedTipo, selectedUbicacion, numeroSerieFilter, fechaAdquiridoFilter, idInternoFilter, e.target.value);
    };

    const handleClearFilters = () => {
        setNombreFilter('');
        setSelectedMarca(null);
        setSelectedModelo(null);
        setSelectedProveedor(null);
        setSelectedPais(null);
        setSelectedTipo(null);
        setSelectedUbicacion(null);
        setNumeroSerieFilter('');
        setFechaAdquiridoFilter('');
        setIdInternoFilter('');
        setEstadoFilter('ACTIVO');
        setFilteredEquipos(equipos.filter((equipo: EquipoModel) => equipo.estado !== ReferrerEnum.INACTIVO));
    };

    const filterEquipos = (
        nombre: string,
        marca: string | null,
        modelo: string | null,
        proveedor: string | null,
        pais: string | null,
        tipo: string | null,
        ubicacion: string | null,
        numeroSerie: string,
        fechaAdquirido: string,
        idInterno: string,
        estado: string
    ) => {
        let filtered = equipos.filter((equipo: EquipoModel) => {
            let matchesNombre = !nombre || equipo.nombre.toLowerCase().includes(nombre.toLowerCase());
            let matchesMarca = !marca || equipo.idModelo.idMarca.nombre === marca;
            let matchesModelo = !modelo || equipo.idModelo.nombre === modelo;
            let matchesProveedor = !proveedor || equipo.idProveedor.nombre === proveedor;
            let matchesPais = !pais || equipo.idPais.nombre === pais;
            let matchesTipo = !tipo || equipo.idTipo.nombreTipo === tipo;
            let matchesUbicacion = !ubicacion || equipo.idUbicacion.nombre === ubicacion;
            let matchesNumeroSerie = !numeroSerie || equipo.nroSerie.toLowerCase().includes(numeroSerie.toLowerCase());
            let matchesFechaAdquirido = !fechaAdquirido || new Date(equipo.fechaAdquisicion).toLocaleDateString() === new Date(fechaAdquirido).toLocaleDateString();
            let matchesIdInterno = !idInterno || equipo.idInterno.toLowerCase().includes(idInterno.toLowerCase());
            let matchesEstado = !estado || equipo.estado === estado;

            return matchesNombre && matchesMarca && matchesModelo && matchesProveedor && matchesPais && matchesTipo && matchesUbicacion && matchesNumeroSerie && matchesFechaAdquirido && matchesIdInterno && matchesEstado;
        });
        setFilteredEquipos(filtered);
    };

    const columns: TableColumn<EquipoModel>[] = [
        { name: 'ID', selector: (row: EquipoModel) => row.id, sortable: true, width: '80px' },
        { name: 'Nombre', selector: (row: EquipoModel) => row.nombre, sortable: true, grow: 2 },
        { name: 'Tipo', selector: (row: EquipoModel) => row.idTipo.nombreTipo, sortable: true, grow: 2 },
        {
            name: 'Marca / Modelo',
            cell: (row: EquipoModel) => (
                <>
                    <div>{row.idModelo.idMarca.nombre} - {row.idModelo.nombre}</div>
                </>
            ),
            sortable: true,
            grow: 2,
            maxWidth: '200px'
        },
        { name: 'Número de Serie', selector: (row: EquipoModel) => row.nroSerie, sortable: true },
        { name: 'Garantía', selector: (row: EquipoModel) => row.garantia, sortable: true },
        { name: 'País', selector: (row: EquipoModel) => row.idPais.nombre, sortable: true },
        { name: 'Proveedor', selector: (row: EquipoModel) => row.idProveedor.nombre, sortable: true },
        { name: 'Fecha de Adquirido', selector: (row: EquipoModel) => new Date(row.fechaAdquisicion).toLocaleDateString(), sortable: true },
        { name: 'ID Interno', selector: (row: EquipoModel) => row.idInterno, sortable: true },
        { name: 'Ubicación', selector: (row: EquipoModel) => `${row.idUbicacion.nombre}/${row.idUbicacion.sector}`, sortable: true },
        { name: 'Imagen', selector: (row: EquipoModel) => <img src={row.imagen} height={50} width={50} />, sortable: false },
        { name: 'Estado', selector: (row: EquipoModel) => row.estado, sortable: true },
        {
            name: 'Acciones',
            cell: (row: EquipoModel) => (
                <div className="flex justify-center">
                    <Link href={`/equipos/delete/${row.id}`} className='bg-rose-500 p-2 inline-block ml-1 text-white text-xs rounded cursor-pointer'>
                        <Trash size={14} />
                    </Link>
                    <Link href={`/equipos/edit/${row.id}`} className='bg-yellow-500 p-2 inline-block ml-1 text-white text-xs rounded cursor-pointer'>
                        <PencilSquare size={14} />
                    </Link>
                    <Link href={`/equipos/read/${row.id}`} className='bg-blue-500 p-2 inline-block ml-1 mr-1 text-white text-xs rounded cursor-pointer'>
                        <Eye size={14} />
                    </Link>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
                padding: '8px',
                backgroundColor: '#1a202c',
                color: '#cbd5e0',
            },
        },
        cells: {
            style: {
                padding: '4px',
                backgroundColor: '#2d3748',
                color: '#cbd5e0',
            },
        },

    };

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',

    };

    if (!equipos.length) return <div>...loading</div>;
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

                    {/* Tipo Select */}
                    <select
                        className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={selectedTipo || ''}
                        onChange={(e) => handleTipoChange(e.target.value)}
                    >
                        <option value="">Selecciona un Tipo</option>
                        {tipos.map((tipo, index) => (
                            <option key={index} value={tipo}>{tipo}</option>
                        ))}
                    </select>

                    {/* Marca Select */}
                    <select
                        className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={selectedMarca || ''}
                        onChange={(e) => handleMarcaChange(e.target.value)}
                    >
                        <option value="">Selecciona una Marca</option>
                        {marcas.map((marca, index) => (
                            <option key={index} value={marca}>{marca}</option>
                        ))}
                    </select>

                    {/* Modelo Select */}
                    <select
                        className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={selectedModelo || ''}
                        onChange={(e) => handleModeloChange(e.target.value)}
                        disabled={!selectedMarca}
                    >
                        <option value="">Selecciona un Modelo</option>
                        {modelos.map((modelo, index) => (
                            <option key={index} value={modelo}>{modelo}</option>
                        ))}
                    </select>

                    {/* Proveedor Select */}
                    <select
                        className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={selectedProveedor || ''}
                        onChange={(e) => handleProveedorChange(e.target.value)}
                    >
                        <option value="">Selecciona un Proveedor</option>
                        {proveedores.map((proveedor, index) => (
                            <option key={index} value={proveedor}>{proveedor}</option>
                        ))}
                    </select>

                    {/* País Select */}
                    <select
                        className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={selectedPais || ''}
                        onChange={(e) => handlePaisChange(e.target.value)}
                    >
                        <option value="">Selecciona un País</option>
                        {paises.map((pais, index) => (
                            <option key={index} value={pais}>{pais}</option>
                        ))}
                    </select>

                    {/* Número de Serie Input */}
                    <input
                        type="text"
                        className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        placeholder="Número de Serie"
                        value={numeroSerieFilter}
                        onChange={handleNumeroSerieChange}
                    />

                    {/* Fecha Adquirido Input */}
                    <input
                        type="date"
                        className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        placeholder="Fecha de Adquirido"
                        value={fechaAdquiridoFilter}
                        onChange={handleFechaAdquiridoChange}
                    />

                    {/* ID Interno Input */}
                    <input
                        type="text"
                        className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        placeholder="ID Interno"
                        value={idInternoFilter}
                        onChange={handleIdInternoChange}
                    />

                    {/* Ubicación Select */}
                    <select
                        className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={selectedUbicacion || ''}
                        onChange={(e) => handleUbicacionChange(e.target.value)}
                    >
                        <option value="">Selecciona una Ubicación</option>
                        {ubicaciones.map((ubicacion, index) => (
                            <option key={index} value={ubicacion}>{ubicacion}</option>
                        ))}
                    </select>

                    {/* Estado Select */}
                    <select
                        className="rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={estadoFilter}
                        onChange={handleEstadoChange}
                    >
                        <option value="">Selecciona un Estado</option>
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="INACTIVO">INACTIVO</option>
                    </select>

                    {/* Botón de Limpiar Filtros */}
                    <button
                        onClick={handleClearFilters}
                        className="bg-violet-800 text-white px-3 py-1 rounded"
                    >
                        Limpiar Filtros
                    </button>
                </div>

                <h4 className="text-2xl font-bold mb-4 text-black dark:text-white">
                    Lista de Equipos
                </h4>

                {/* DataTable */}
                <DataTable
                    columns={columns}
                    data={filteredEquipos}
                    customStyles={customStyles}
                    paginationComponentOptions={paginationComponentOptions}
                />
            </div>

    );
}

export default EquiposRead;