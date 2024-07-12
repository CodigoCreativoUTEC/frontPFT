"use client"; // Asegúrate de incluir esto
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EquipoModel, ReferrerEnum } from '@/types';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion } from '@/types/emuns';
import Image from "next/image";
import Link from "next/link";

const EditEquipo = () => {
  const router = useRouter();
  const { id } = useParams();
  const [equipo, setEquipo] = useState<EquipoModel | null>(null);
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
    if (!equipo?.tipo_equipo) newErrors.push("Tipo de equipo es obligatorio");
    if (!equipo?.marca) newErrors.push("Marca es obligatoria");
    if (!equipo?.modelo) newErrors.push("Modelo es obligatorio");
    if (!equipo?.num_serie) newErrors.push("Número de serie es obligatorio");
    if (!equipo?.garantia) newErrors.push("Garantía es obligatoria");
    if (!equipo?.pais) newErrors.push("País de origen es obligatorio");
    if (!equipo?.proveedor) newErrors.push("Proveedor es obligatorio");
    if (!equipo?.fecha_adq) newErrors.push("Fecha de adquisición es obligatoria");
    if (!equipo?.id_interno) newErrors.push("Identificación interna es obligatoria");
    if (!equipo?.ubicacion) newErrors.push("Ubicación es obligatoria");
    if (!equipo?.imagen) newErrors.push("Imagen del equipo es obligatoria");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (equipo) {
      const { name, value } = e.target;
      setEquipo({ ...equipo, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const res = await fetch(`/api/equipos/${id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipo),
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

  const handleBack = () => {
    router.push('/equipos');
  };

  if (!equipo) return <div>...loading</div>;

  return (
    <DefaultLayout>
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
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
        <h1 className='mb-1.5 block text-2xl font-extrabold'>Editar Equipo</h1>

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
              value={equipo.nombre}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Tipo de Equipo:</label>
            <select
              name='tipo_equipo'
              value={equipo.tipo_equipo}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            >
              <option value="">Seleccione un tipo de equipo</option>
              <option value={Tipo.DIGITAL}>Digital</option>
              <option value={Tipo.MECANICO}>Mecánico</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Marca:</label>
            <select
              name='marca'
              value={equipo.marca}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            >
              <option value="">Seleccione una marca</option>
              <option value={Marca.LG}>Lg</option>
              <option value={Marca.MOTOROLA}>Motorola</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Modelo:</label>
            <select
              name='modelo'
              value={equipo.modelo}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            >
              <option value="">Seleccione un modelo</option>
              <option value={Modelo.HD}>HD</option>
              <option value={Modelo.U4K}>U4K</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Número de Serie:</label>
            <input
              type='number'
              name='num_serie'
              value={equipo.num_serie}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Garantía:</label>
            <input
              type='number'
              name='garantia'
              value={equipo.garantia}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>País:</label>
            <select
              name='pais'
              value={equipo.pais}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            >
              <option value="">Seleccione un país</option>
              <option value={Pais.BRASIL}>Brasil</option>
              <option value={Pais.URUGUAY}>Uruguay</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Proveedor:</label>
            <select
              name='proveedor'
              value={equipo.proveedor}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            >
              <option value="">Seleccione un proveedor</option>
              <option value={Proveedor.DISTRICOMP}>Districomp</option>
              <option value={Proveedor.LOI}>Loi</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Fecha de Adquisición:</label>
            <input
              type='date'
              name='fecha_adq'
              value={new Date(equipo.fecha_adq).toISOString().split('T')[0]}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>ID Interno:</label>
            <input
              type='text'
              name='id_interno'
              value={equipo.id_interno}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Ubicación:</label>
            <select
              name='ubicacion'
              value={equipo.ubicacion}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            >
              <option value="">Seleccione una ubicación</option>
              <option value={Ubicacion.CTI}>CTI</option>
              <option value={Ubicacion.SALA1}>Sala 1</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Imagen:</label>
            <input
              type='text'
              name='imagen'
              value={equipo.imagen}
              onChange={handleChange}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Estado:</label>
            <input
              type='text'
              name='estado'
              value={equipo.estado}
              className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            />
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
              <h2 className='text-xl mb-4'>Confirmar cambios</h2>
              <p>¿Estás seguro de que deseas guardar los cambios?</p>
              <div className='mt-4'>
                <button
                  onClick={handleConfirm}
                  className='bg-green-500 text-white p-2 rounded mr-4'
                >
                  Aceptar
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className='bg-violet-800  text-white p-2 rounded'
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
    </DefaultLayout>
  );
}

export default EditEquipo;
