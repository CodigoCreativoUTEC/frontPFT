"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { EquipoModel, BajaEquipoModel, ReferrerEnum } from '@/types';
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';

const DeleteEquipo = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [equipo, setEquipo] = useState<EquipoModel | null>(null);
  const [fechaBaja, setFechaBaja] = useState<Date | null>(null);
  const [idUsuario, setUsuario] = useState<string>("");
  const [razon, setRazon] = useState<string>("");
  const [comentarios, setComentarios] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  useEffect(() => {
    if (!session) {signIn();return null;}
    if (id) {
      const fetchEquipo = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipos/seleccionar?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            "authorization": session ? `Bearer ${session.accessToken}` : '',
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
  }, [id, session.accessToken]);

  const validateForm = () => {
    const newErrors: string[] = [];
    //if (!equipo?.nombre) newErrors.push("Nombre es obligatorio");
    if (!fechaBaja) newErrors.push("Fecha de baja es obligatoria");
    //if (!idUsuario) newErrors.push("Usuario es obligatorio");
    if (!razon) newErrors.push("Razón de la baja es obligatoria");
    if (!comentarios) newErrors.push("Comentarios de la baja es obligatoria");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const formData: BajaEquipoModel = {
        idEquipo: equipo,
        fecha: fechaBaja!,
        idUsuario: session.user,
        razon: razon,
        comentarios: comentarios,
        estado: ReferrerEnum.INACTIVO, // Use enum value
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipos/inactivar`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + (session.accessToken || ''),
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      console.log(res);
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
              Bienvenido al ingreso al sistema de gestion de mantenimiento de equipos clínicos hospitalarios.
            </p>
          </div>
        </div>
        <div className='w-full border-stroke dark:border-strokedark xl:w-3/4 xl:border-l-2'>
    <div className='w-full p-4 sm:p-12.5 xl:p-17.5'>
        <span className='mb-1.5 block text-2xl font-extrabold'>
          Baja de Equipo
        </span>

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
          <label htmlFor="nombre" className='mb-2.5 block font-medium text-sm text-black dark:text-white'>
            Nombre de equipo a borrar
          </label>
          <input 
            type="text" 
            name="nombre"
            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            value={equipo.nombre}
            readOnly
          />
        </div>
        <div className='mb-4'>
          <label htmlFor="fecha" className='mb-2.5 block font-medium text-sm text-black dark:text-white'>
            Fecha de Baja
          </label>
          <DatePicker 
            selected={fechaBaja}
            onChange={(date: Date | null, event: React.SyntheticEvent<any> | undefined) => setFechaBaja(date)}
            dateFormat="yyyy-MM-dd"
            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            locale="es"
          />
        </div>
        <div className='mb-4'>
          <label htmlFor="razon" className='mb-2.5 block font-medium text-sm text-black dark:text-white'>
            Razón de la Baja
          </label>
          <input 
            type="text" 
            name="razon"
            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            value={razon}
            onChange={(e) => setRazon(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor="comentarios" className='mb-2.5 block font-medium text-sm text-black dark:text-white'>
            Comentarios
          </label>
          <textarea 
            name="comentarios"
            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
          />
        </div>
        <div className='mb-4'>
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
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
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
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
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
    </div>
    </div>
  );
}

export default DeleteEquipo;
