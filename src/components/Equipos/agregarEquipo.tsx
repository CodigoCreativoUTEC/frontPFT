"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { EquipoModel } from '@/types';
import { tipoEquipos, marcas, modelos, paises, proveedores, ubicaciones, ReferrerEnum } from '@/types/enums';
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';

const EquiposCreate = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [errors, setErrors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [nombre, setNombre] = useState<string>("");
  const [selectedTipo, setSelectedTipo] = useState<number | null>(null);
  const [selectedMarca, setSelectedMarca] = useState<number | null>(null);
  const [selectedModelo, setSelectedModelo] = useState<number | null>(null);
  const [nroSerie, setNroSerie] = useState<string>("");
  const [garantia, setGarantia] = useState<Date | null>(null);
  const [selectedPais, setSelectedPais] = useState<number | null>(null);
  const [selectedProveedor, setSelectedProveedor] = useState<number | null>(null);
  const [fechaAdquisicion, setFechaAdquisicion] = useState<Date | null>(null);
  const [idInterno, setIdInterno] = useState<string>("");
  const [selectedUbicacion, setSelectedUbicacion] = useState<number | null>(null);
  const [imagen, setImagen] = useState<string>("");
  
  const validateForm = () => {
    const newErrors: string[] = [];
    if (!nombre) newErrors.push("Nombre es obligatorio");
    if (!selectedTipo) newErrors.push("Tipo de equipo es obligatorio");
    if (!selectedMarca) newErrors.push("Marca es obligatoria");
    if (!selectedModelo) newErrors.push("Modelo es obligatorio");
    if (!nroSerie) newErrors.push("Número de serie es obligatorio");
    if (!garantia) newErrors.push("Garantía es obligatoria");
    if (!selectedPais) newErrors.push("País de origen es obligatorio");
    if (!selectedProveedor) newErrors.push("Proveedor es obligatorio");
    if (!fechaAdquisicion) newErrors.push("Fecha de adquisición es obligatoria");
    if (!idInterno) newErrors.push("Identificación interna es obligatoria");
    if (!selectedUbicacion) newErrors.push("Ubicación es obligatoria");
    if (!imagen) newErrors.push("Imagen del equipo es obligatoria");

    setErrors(newErrors);
    return newErrors.length === 0;
  };
//TODO: Manejar el posible error de que el servicio no funcione
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('https://api.imgbb.com/1/upload?key=7c25531eca2149d7618fe5241473b513', {
          method: 'POST',
          body: formData,
        });

        const result = await res.json();
        if (result.success) {
          setImagen(result.data.url);
        } else {
          console.error('Error al subir la imagen a imgbb');
        }
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }
  };

  const addEquipo = async () => {
    if (validateForm()) {
      const payload: EquipoModel = {
        id: null,
        idInterno,
        nroSerie,
        garantia: garantia ? garantia.toISOString().split('T')[0] : "",
        idTipo: { id: selectedTipo!, nombreTipo: tipoEquipos.find(tipo => tipo.id === selectedTipo)?.nombreTipo || "" },
        idProveedor: { id: selectedProveedor!, nombre: proveedores.find(proveedor => proveedor.id === selectedProveedor)?.nombre || "" },
        idPais: { id: selectedPais!, nombre: paises.find(pais => pais.id === selectedPais)?.nombre || "" },
        idModelo: {
          id: selectedModelo!,
          nombre: modelos.find(modelo => modelo.id === selectedModelo)?.nombre || "",
          idMarca: { id: selectedMarca!, nombre: marcas.find(marca => marca.id === selectedMarca)?.nombre || "" }
        },
        equiposUbicaciones: [],
        idUbicacion: { id: selectedUbicacion!, nombre: ubicaciones.find(ubicacion => ubicacion.id === selectedUbicacion)?.nombre || "" },
        nombre,
        imagen,
        fechaAdquisicion: fechaAdquisicion ? [
          fechaAdquisicion.getFullYear(),
          fechaAdquisicion.getMonth() + 1,
          fechaAdquisicion.getDate()
        ] : [],
        estado: ReferrerEnum.ACTIVO,
        marca: undefined
      };

      const add = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipos/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": session ? `Bearer ${session.accessToken}` : '',
        },
        body: JSON.stringify(payload),
      });

      if (add.ok) {
        router.push("/equipos/CrearEquipo");
      } else {
        const result = await add.json();
        console.error('Error al crear el equipo:', result);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    addEquipo();
  };

  const handleBack = () => {
    router.push('/equipos/CrearEquipo');
  };

  if (!session) { signIn(); return null; }

  return (
    <div className='flex flex-wrap items-start'>
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
            Bienvenido al ingreso al sistema de gestión de mantenimiento de equipos clínicos hospitalarios.
          </p>
        </div>
      </div>
      <div className='w-full border-stroke dark:border-strokedark xl:w-3/4 xl:border-l-2'>
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
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
            <div className='mb-4'>
              <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Nombre:</label>
              <input
                type='text'
                name='nombre'
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              />
            </div>
            <div className='mb-4'>
              <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Tipo de Equipo:</label>
              <select
                name='id'
                value={selectedTipo || ""}
                onChange={(e) => setSelectedTipo(parseInt(e.target.value, 10))}
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              >
                <option value="">Seleccione un tipo de equipo</option>
                {tipoEquipos.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombreTipo}</option>
                ))}
              </select>
            </div>
            <div className='mb-4'>
              <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Marca:</label>
              <select
                name='id'
                value={selectedMarca || ""}
                onChange={(e) => setSelectedMarca(parseInt(e.target.value, 10))}
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              >
                <option value="">Seleccione una marca</option>
                {marcas.map(marca => (
                  <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                ))}
              </select>
            </div>
            <div className='mb-4'>
              <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Modelo:</label>
              <select
                name='id'
                value={selectedModelo || ""}
                onChange={(e) => setSelectedModelo(parseInt(e.target.value, 10))}
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              >
                <option value="">Seleccione un modelo</option>
                {modelos.filter(modelo => modelo.idMarca === selectedMarca).map(modelo => (
                  <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
                ))}
              </select>
            </div>
            <div className='mb-4'>
              <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Número de Serie:</label>
              <input
                type='text'
                name='nroSerie'
                value={nroSerie}
                onChange={(e) => setNroSerie(e.target.value)}
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              />
            </div>
            <div className='mb-4'>
              <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Garantía:</label>
              <DatePicker
                selected={garantia}
                onChange={(date) => setGarantia(date)}
                dateFormat="yyyy-MM-dd"
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              />
            </div>
            <div className='mb-4'>
              <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>País:</label>
              <select
                name='id'
                value={selectedPais || ""}
                onChange={(e) => setSelectedPais(parseInt(e.target.value, 10))}
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              >
                <option value="">Seleccione un país</option>
                {paises.map(pais => (
                  <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                ))}
              </select>
            </div>
            <div className='mb-4'>
              <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Proveedor:</label>
              <select
                name='id'
                value={selectedProveedor || ""}
                onChange={(e) => setSelectedProveedor(parseInt(e.target.value, 10))}
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
                ))}
              </select>
            </div>
            <div className='mb-4'>
              <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Fecha de Adquisición:</label>
              <DatePicker
                selected={fechaAdquisicion}
                onChange={(date) => setFechaAdquisicion(date)}
                dateFormat="yyyy-MM-dd"
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              />
            </div>
            <div className='mb-4'>
              <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>ID Interno:</label>
              <input
                type='text'
                name='idInterno'
                value={idInterno}
                onChange={(e) => setIdInterno(e.target.value)}
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              />
            </div>
            <div className='mb-4'>
              <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Ubicación:</label>
              <select
                name='id'
                value={selectedUbicacion || ""}
                onChange={(e) => setSelectedUbicacion(parseInt(e.target.value, 10))}
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              >
                <option value="">Seleccione una ubicación</option>
                {ubicaciones.map(ubicacion => (
                  <option key={ubicacion.id} value={ubicacion.id}>{ubicacion.nombre}</option>
                ))}
              </select>
            </div>
            <div className='mb-4'>
              <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Imagen:</label>
              <input
                type='file'
                name='imagen'
                onChange={handleFileChange}
                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
              />
              {imagen && (
                <div className='mt-2'>
                  <picture><img src={imagen} alt="Imagen del equipo" className='max-w-full h-auto' /></picture>
                </div>
              )}
            </div>
            <button
              type='button'
              onClick={() => setShowConfirmModal(true)}
              className='bg-green-500 text-white p-2 rounded'
            >
              Guardar
            </button>
            <button
              type='button'
              onClick={handleBack}
              className='mt-4 ml-4 bg-gray-500 text-white bg-violet-800 p-2 rounded'
            >
              Volver
            </button>
          </form>

          {showModal && (
            <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
              <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
                <h2 className='text-xl mb-4'>Errores en el formulario</h2>
                <ul className='list-disc list-inside'>
                  {errors.map((error, index) => (
                    <li key={index} className='text-rose-600'>{error}</li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowModal(false)}
                  className='mt-4 bg-violet-800 text-white p-2 rounded'
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {showConfirmModal && (
            <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
              <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
                <h2 className='text-xl mb-4'>Confirmar creación</h2>
                <p>¿Estás seguro de que deseas guardar este equipo?</p>
                <div className='mt-4'>
                  <button
                    onClick={handleConfirm}
                    className='bg-green-500 text-white p-2 rounded mr-4'
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className='bg-violet-800 text-white p-2 rounded'
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EquiposCreate;
