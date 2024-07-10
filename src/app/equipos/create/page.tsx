"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import { EquipoModel } from '@/types/index'; // Asegúrate de que esta ruta sea correcta
import { ReferrerEnum } from '@/types/emuns';
import { Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion } from '@/types/emuns';

const EquiposCreate = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [tipoEquipo, setTipoEquipo] = useState<Tipo>();
  const [marca, setMarca] = useState<Marca>();
  const [modelo, setModelo] = useState<Modelo>();
  const [numSerie, setNumSerie] = useState<number>();
  const [garantia, setGarantia] = useState<number>();
  const [pais, setPais] = useState<Pais>();
  const [proveedor, setProveedor] = useState<Proveedor>();
  const [fechaAdq, setFechaAdq] = useState<Date | null>(null);
  const [idInterno, setIdInterno] = useState<string>("");
  const [ubicacion, setUbicacion] = useState<Ubicacion>();
  const [imagen, setImagen] = useState<string>("");

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

  const addEquipo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && tipoEquipo && marca && fechaAdq && modelo && pais && numSerie && garantia && proveedor && ubicacion && imagen && idInterno) {
      const newId = await fetchNewId();
      const formData: EquipoModel = {
        id: newId, // Usar el nuevo ID generado como número
        nombre: name,
        tipo_equipo: tipoEquipo,
        modelo: modelo,
        num_serie: numSerie,
        garantia: garantia,
        pais: pais,
        proveedor: proveedor,
        marca: marca,
        fecha_adq: fechaAdq,
        id_interno: idInterno,
        imagen: imagen,
        ubicacion: ubicacion,
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
      alert("No llenó todos los campos");
    }
  };

  return (
    <div className='flex flex-wrap justify-center items-center w-full h-screen'>
      <form className='w-4/12 bg-white p-10' onSubmit={addEquipo}>
        <span className='font-bold text-black py-2 block underline text-2xl'>
          Agregar Equipo
        </span>
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
            onChange={(e) => setMarca(e.target.value as Marca)}
          >
            <option>...</option>
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
            onChange={(e) => setModelo(e.target.value as Modelo)}
          >
            <option value={Modelo.HD}>HD</option>
            <option value={Modelo.U4K}>U4K</option>
          </select>
        </div>
        <div className='w-full py-2'>
          <label htmlFor="num_serie" className='text-sm text-black font-bold py-2 block'>
            Número de Serie
          </label>
          <input 
            name="num_serie"
            className='w-full text-black border-[1px]'
            value={numSerie}
            onChange={(e) => setNumSerie(e.target.value as unknown as number)}
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="garantia" className='text-sm text-black font-bold py-2 block'>
            Garantía
          </label>
          <input 
            name="garantia"
            className='w-full text-black border-[1px]'
            value={garantia}
            onChange={(e) => setGarantia(e.target.value as unknown as number)}
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
            onChange={(e) => setPais(e.target.value as Pais)}
          >
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
            onChange={(e) => setProveedor(e.target.value as Proveedor)}
          >
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
            onChange={(e) => setUbicacion(e.target.value as Ubicacion)}
          >
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
            onChange={(e) => setTipoEquipo(e.target.value as Tipo)}
          >
            <option value={Tipo.MECANICO}>Mecanico</option>
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
          <button className='w-20 p-2 text-white border-gray-600 border-[1px] rounded bg-lime-300'>
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EquiposCreate;
