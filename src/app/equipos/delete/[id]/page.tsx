"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import { EquipoModel, BajaEquipoModel, ReferrerEnum } from '@/types';

const DeleteEquipo = () => {
  const router = useRouter();
  const { id } = useParams();
  const [equipo, setEquipo] = useState<EquipoModel | null>(null);
  const [fechaBaja, setFechaBaja] = useState<Date | null>(null);
  const [usuario, setUsuario] = useState<string>("");
  const [razon, setRazon] = useState<string>("");
  const [comentarios, setComentarios] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const fetchEquipo = async () => {
        const res = await fetch(`/api/equipos/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const result = await res.json();
          setEquipo(result);
        } else {
          console.error("Error al obtener el equipo");
        }
      };
      fetchEquipo();
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!equipo?.nombre) newErrors.push("Nombre es obligatorio");
    if (!fechaBaja) newErrors.push("Fecha de baja es obligatoria");
    if (!usuario) newErrors.push("Usuario es obligatorio");
    if (!razon) newErrors.push("Razón de la baja es obligatoria");
    if (!comentarios) newErrors.push("Comentarios de la baja es obligatoria");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const formData: BajaEquipoModel = {
        id: equipo!.id,
        nombre: equipo!.nombre,
        fecha_baja: fechaBaja!,
        usuario: usuario,
        razon: razon,
        comentarios: comentarios,
        estado: ReferrerEnum.INACTIVO, // Use enum value
      };

      const res = await fetch(`/api/equipos/baja`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/equipos');
      } else {
        console.error("Error al actualizar el equipo");
      }
    } else {
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    handleSubmit();
  };

  if (!equipo) return <div>...loading</div>;

  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <form className='w-4/12 bg-white p-10' onSubmit={(e) => e.preventDefault()}>
        <span className='font-bold text-black py-2 block underline text-2xl'>
          Baja de Equipo
        </span>
        {errors.length > 0 && (
          <div className='bg-rose-200 p-2 mb-4'>
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
            value={equipo.nombre}
            readOnly
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="fecha_baja" className='text-sm text-black font-bold py-2 block'>
            Fecha de Baja
          </label>
          <DatePicker 
            selected={fechaBaja}
            onChange={(date: Date | null, event: React.SyntheticEvent<any> | undefined) => setFechaBaja(date)}
            dateFormat="yyyy-MM-dd"
            className='w-full text-black border-[1px]'
            locale="es"
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="usuario" className='text-sm text-black font-bold py-2 block'>
            Usuario
          </label>
          <input 
            type="text" 
            name="usuario"
            className='w-full text-black border-[1px]'
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="razon" className='text-sm text-black font-bold py-2 block'>
            Razón de la Baja
          </label>
          <input 
            type="text" 
            name="razon"
            className='w-full text-black border-[1px]'
            value={razon}
            onChange={(e) => setRazon(e.target.value)}
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="comentarios" className='text-sm text-black font-bold py-2 block'>
            Comentarios
          </label>
          <textarea 
            name="comentarios"
            className='w-full text-black border-[1px]'
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
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
            <h2 className='text-xl mb-4'>Confirmar baja</h2>
            <p>¿Estás seguro de que deseas dar de baja este equipo?</p>
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

export default DeleteEquipo;
