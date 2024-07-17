"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EquipoModel, ReferrerEnum } from '@/types';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import DataTable, { TableColumn } from 'react-data-table-component';
import { signIn, useSession } from 'next-auth/react';
import { PencilSquare, Trash, Eye } from 'react-bootstrap-icons'; // Importing Bootstrap Icons

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
  const [numeroSerieFilter, setNumeroSerieFilter] = useState<string>('');
  const [estadoFilter, setEstadoFilter] = useState<string>("ACTIVO");

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

    equipos.forEach((equipo: EquipoModel) => {
      marcasSet.add(equipo.idModelo.idMarca.nombre);
      proveedoresSet.add(equipo.idProveedor.nombre);
      paisesSet.add(equipo.idPais.nombre);
    });

    setMarcas(Array.from(marcasSet));
    setProveedores(Array.from(proveedoresSet));
    setPaises(Array.from(paisesSet));
  };

  useEffect(() => {
    fetcher().then(() => console.log("Obteniendo equipos"));
  }, []);

  const handleMarcaChange = (marca: string) => {
    setSelectedMarca(marca);
    setSelectedModelo(null);
    filterEquipos(marca, selectedModelo, selectedProveedor, selectedPais, numeroSerieFilter, estadoFilter);
  };

  const handleModeloChange = (modelo: string) => {
    setSelectedModelo(modelo);
    filterEquipos(selectedMarca, modelo, selectedProveedor, selectedPais, numeroSerieFilter, estadoFilter);
  };

  const handleProveedorChange = (proveedor: string) => {
    setSelectedProveedor(proveedor);
    filterEquipos(selectedMarca, selectedModelo, proveedor, selectedPais, numeroSerieFilter, estadoFilter);
  };

  const handlePaisChange = (pais: string) => {
    setSelectedPais(pais);
    filterEquipos(selectedMarca, selectedModelo, selectedProveedor, pais, numeroSerieFilter, estadoFilter);
  };

  const handleNumeroSerieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumeroSerieFilter(e.target.value);
    filterEquipos(selectedMarca, selectedModelo, selectedProveedor, selectedPais, e.target.value, estadoFilter);
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstadoFilter(e.target.value);
    filterEquipos(selectedMarca, selectedModelo, selectedProveedor, selectedPais, numeroSerieFilter, e.target.value);
  };

  const filterEquipos = (
      marca: string | null,
      modelo: string | null,
      proveedor: string | null,
      pais: string | null,
      numeroSerie: string,
      estado: string
  ) => {
    let filtered = equipos.filter((equipo: EquipoModel) => {
      let matchesMarca = !marca || equipo.idModelo.idMarca.nombre === marca;
      let matchesModelo = !modelo || equipo.idModelo.nombre === modelo;
      let matchesProveedor = !proveedor || equipo.idProveedor.nombre === proveedor;
      let matchesPais = !pais || equipo.idPais.nombre === pais;
      let matchesNumeroSerie = !numeroSerie || equipo.nroSerie.toLowerCase().includes(numeroSerie.toLowerCase());
      let matchesEstado = !estado || equipo.estado === estado;

      return matchesMarca && matchesModelo && matchesProveedor && matchesPais && matchesNumeroSerie && matchesEstado;
    });
    setFilteredEquipos(filtered);
  };

  const columns: TableColumn<EquipoModel>[] = [
    { name: 'ID', selector: (row: EquipoModel) => row.id, sortable: true, width: '80px' },
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
          <div className="inline-flex">
            <Link href={`/equipos/delete/${row.id}`} className='bg-rose-500 p-2 inline-block ml-1 text-white text-xs rounded cursor-pointer'>
              <Trash size={18} />
            </Link>
            <Link href={`/equipos/edit/${row.id}`} className='bg-yellow-500 p-2 inline-block ml-1 text-white text-xs rounded cursor-pointer'>
              <PencilSquare size={18} />
            </Link>
            <Link href={`/equipos/read/${row.id}`} className='bg-blue-500 p-2 inline-block ml-1 text-white text-xs rounded cursor-pointer'>
              <Eye size={18} />
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
        paddingLeft: '8px', // Adjust padding left
        paddingRight: '8px', // Adjust padding right
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // Adjust padding left
        paddingRight: '8px', // Adjust padding right
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
      <DefaultLayout>
        <div className='rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
          <div className='mb-4 flex flex-wrap gap-4'>
            {/* Marca Select */}
            <select
                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
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
                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
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
                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
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
                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
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
                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
                placeholder="Número de Serie"
                value={numeroSerieFilter}
                onChange={handleNumeroSerieChange}
            />

            {/* Estado Select */}
            <select
                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
                value={estadoFilter}
                onChange={handleEstadoChange}
            >
              <option value="">Selecciona un Estado</option>
              <option value="ACTIVO" selected>ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>

          <h4 className="text-2xl font-bold mb-4 text-black dark:text-white">
            Lista de Equipos
          </h4>

          {/* DataTable */}
          <DataTable
              columns={columns}
              data={filteredEquipos}
              pagination
              customStyles={customStyles}
              paginationComponentOptions={paginationComponentOptions}
          />
        </div>
      </DefaultLayout>
  );
}

export default EquiposRead;
