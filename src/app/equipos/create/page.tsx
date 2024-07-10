"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import { EquipoModel, ReferrerEnum, Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion } from '@/types';

const EquiposCreate = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [tipoEquipo, setTipoEquipo] = useState<string>("");
  const [marca, setMarca] = useState<string>("");
  const [modelo, setModelo] = useState<string>("");
  const [numSerie, setNumSerie] = useState<number | undefined>();
  const [garantia, setGarantia] = useState<number | undefined>();
  const [pais, setPais] = useState<string>("");
  const [proveedor, setProveedor] = useState<string>("");
  const [fechaAdq, setFechaAdq] = useState<Date | null>(null);
  const [idInterno, setIdInterno] = useState<string>("");
  const [ubicacion, setUbicacion] = useState<string>("");
  const [imagen, setImagen] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!name) newErrors.push("Nombre es obligatorio");
    if (!tipoEquipo) newErrors.push("Tipo de equipo es obligatorio");
    if (!marca) newErrors.push("Marca es obligatoria");
    if (!modelo) newErrors.push("Modelo es obligatorio");
    if (!numSerie) newErrors.push("Número de serie es obligatorio");
    if (!garantia) newErrors.push("Garantía es obligatoria");
    if (!pais) newErrors.push("País de origen es obligatorio");
    if (!proveedor) newErrors.push("Proveedor es obligatorio");
    if (!fechaAdq) newErrors.push("Fecha de adquisición es obligatoria");
    if (!idInterno) newErrors.push("Identificación interna es obligatoria");
    if (!ubicacion) newErrors.push("Ubicación es obligatoria");
    if (!imagen) newErrors.push("Imagen del equipo es obligatoria");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const fetchNewId = async () => {
    const res = await fetch("/api/equipos", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const equips = await res.json();
    const newId = equips.length > 0 ? Math.max(...equips.map((u: { id: number | string }) => Number(u.id))) + 1 : 1;
    return newId;
  };

  const addEquipo = async () => {
    if (validateForm()) {
      const newId = await fetchNewId();
      const formData: EquipoModel = {
        id: newId,
        nombre: name,
        tipo_equipo: tipoEquipo as Tipo,
        modelo: modelo as Modelo,
        num_serie: numSerie!,
        garantia: garantia!,
        pais: pais as Pais,
        proveedor: proveedor as Proveedor,
        marca: marca as Marca,
        fecha_adq: fechaAdq!,
        id_interno: idInterno,
        imagen: imagen,
        ubicacion: ubicacion as Ubicacion,
        estado: ReferrerEnum.ACTIVO
      };

      const add = await fetch("/api/equipos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (add.ok) {
        router.push("/equipos");
      }
    } else {
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    addEquipo();
  };

  return (
    <div className='flex flex-wrap justify-center items-center w-full h-screen'>
      <form className='w-4/12 bg-white p-10' onSubmit={(e) => e.preventDefault()}>
        <span className='font-bold text-black py-2 block underline text-2xl'>
          Agregar Equipo
        </span>
        {errors.length > 0 && (
          <div className='bg-red-200 p-2 mb-4'>
            <ul>
              {errors.map((error, index) => (
                <li key={index} className='text-red-700'>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className='w-full py-2'>
          <label htmlFor="nombre" className='text-sm text-black font-bold py-2 block'>
            Nombre
          </label>
          <input 
            type="text" 
            name="nombre"
            className='w-full text-black border-[1px]'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="marca" className='text-sm text-black font-bold py-2 block'>
            Marca
          </label>
          <select
            name="marca"
            className='w-full text-black border-[1px]'
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          >
            <option value="">Seleccione una marca</option>
            <option value={Marca.LG}>Lg</option>
            <option value={Marca.MOTOROLA}>Motorola</option>
          </select>
        </div>
        <div className='w-full py-2'>
          <label htmlFor="modelo" className='text-sm text-black font-bold py-2 block'>
            Modelo
          </label>
          <select
            name="modelo"
            className='w-full text-black border-[1px]'
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
          >
            <option value="">Seleccione un modelo</option>
            <option value={Modelo.HD}>HD</option>
            <option value={Modelo.U4K}>U4K</option>
          </select>
        </div>
        <div className='w-full py-2'>
          <label htmlFor="num_serie" className='text-sm text-black font-bold py-2 block'>
            Número de Serie
          </label>
          <input 
            type="number"
            name="num_serie"
            className='w-full text-black border-[1px]'
            value={numSerie}
            onChange={(e) => setNumSerie(Number(e.target.value))}
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="garantia" className='text-sm text-black font-bold py-2 block'>
            Garantía
          </label>
          <input 
            type="number"
            name="garantia"
            className='w-full text-black border-[1px]'
            value={garantia}
            onChange={(e) => setGarantia(Number(e.target.value))}
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="pais" className='text-sm text-black font-bold py-2 block'>
            País
          </label>
          <select
            name="pais"
            className='w-full text-black border-[1px]'
            value={pais}
            onChange={(e) => setPais(e.target.value)}
          >
            <option value="">Seleccione un país</option>
            <option value={Pais.BRASIL}>Brasil</option>
            <option value={Pais.URUGUAY}>Uruguay</option>
          </select>
        </div>
        <div className='w-full py-2'>
          <label htmlFor="proveedor" className='text-sm text-black font-bold py-2 block'>
            Proveedor
          </label>
          <select
            name="proveedor"
            className='w-full text-black border-[1px]'
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
          >
            <option value="">Seleccione un proveedor</option>
            <option value={Proveedor.DISTRICOMP}>Districomp</option>
            <option value={Proveedor.LOI}>Loi</option>
          </select>
        </div>
        <div className='w-full py-2'>
          <label htmlFor="fecha_adq" className='text-sm text-black font-bold py-2 block'>
            Fecha de Adquirido
          </label>
          <DatePicker 
            selected={fechaAdq}
            onChange={(date: Date | null, event: React.SyntheticEvent<any> | undefined) => setFechaAdq(date)}
            dateFormat="yyyy-MM-dd"
            className='w-full text-black border-[1px]'
            locale="es"
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="id_interno" className='text-sm text-black font-bold py-2 block'>
            ID interno
          </label>
          <input 
            type="text" 
            name="id_interno"
            className='w-full text-black border-[1px]'
            value={idInterno}
            onChange={(e) => setIdInterno(e.target.value)}
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="ubicacion" className='text-sm text-black font-bold py-2 block'>
            Ubicación
          </label>
          <select
            name="ubicacion"
            className='w-full text-black border-[1px]'
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          >
            <option value="">Seleccione una ubicación</option>
            <option value={Ubicacion.CTI}>CTI</option>
            <option value={Ubicacion.SALA1}>Sala 1</option>
          </select>
        </div>
        <div className='w-full py-2'>
          <label htmlFor="tipo_equipo" className='text-sm text-black font-bold py-2 block'>
            Tipo de Equipo
          </label>
          <select
            name="tipo_equipo"
            className='w-full text-black border-[1px]'
            value={tipoEquipo}
            onChange={(e) => setTipoEquipo(e.target.value)}
          >
            <option value="">Seleccione un tipo de equipo</option>
            <option value={Tipo.MECANICO}>Mecánico</option>
            <option value={Tipo.DIGITAL}>Digital</option>
          </select>
        </div>
        <div className='w-full py-2'>
          <label htmlFor="imagen" className='text-sm text-black font-bold py-2 block'>
            Imagen
          </label>
          <input 
            type="text" 
            name="imagen"
            className='w-full text-black border-[1px]'
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>
        <div className='w-full py-2'>
          <button
            type='button'
            onClick={() => setShowConfirmModal(true)}
            className='w-20 p-2 text-white border-gray-600 border-[1px] rounded bg-green-500'
          >
            Enviar
          </button>
          <button
            onClick={() => router.push('/equipos')}
            className='mt-4 ml-4 bg-gray-500 text-white bg-violet-800 p-2 rounded'
          >
            Volver
          </button>
        </div>
      </form>
      {showModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-4 rounded shadow-md'>
            <h2 className='text-xl mb-4'>Errores en el formulario</h2>
            <ul className='list-disc list-inside'>
              {errors.map((error, index) => (
                <li key={index} className='text-red-600'>{error}</li>
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
          <div className='bg-white p-4 rounded shadow-md'>
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
  );
}

export default EquiposCreate;
