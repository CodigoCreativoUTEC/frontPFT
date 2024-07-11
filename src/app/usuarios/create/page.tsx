"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import { UsuarioModel, ReferrerEnum } from '@/types';
import Image from "next/image";
import Link from "next/link";
import DefaultLayout from '@/components/Layouts/DefaultLayout';


const UsuariosCreate = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [cedula, setCedula] = useState<string>("");
  const [fechaNasc, setFechaNasc] = useState<Date | null>(null);
  const [telefonos, setTelefonos] = useState<string[]>([""]);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tipoUsuario, setTipoUsuario] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const addTelefono = () => {
    setTelefonos([...telefonos, ""]);
  };

  const handleTelefonoChange = (index: number, value: string) => {
    const newTelefonos = telefonos.map((tel, i) => (i === index ? value : tel));
    setTelefonos(newTelefonos);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!name) newErrors.push("Nombre es obligatorio");
    if (!apellido) newErrors.push("Apellido es obligatorio");
    if (!cedula) newErrors.push("Cédula es obligatoria");
    if (!fechaNasc) newErrors.push("Fecha de nacimiento es obligatoria");
    if (!telefonos[0]) newErrors.push("Teléfono de contacto es obligatorio");
    if (!email) newErrors.push("Email es obligatorio");
    if (!validateEmail(email)) newErrors.push("El formato del email es inválido");
    if (!password) newErrors.push("Contraseña es obligatoria");
    if (!validatePassword(password)) newErrors.push("La contraseña debe contener al menos 8 caracteres, incluyendo letras y números");
    if (!Object.values(ReferrerEnum).includes(tipoUsuario as ReferrerEnum)) newErrors.push("Tipo de Usuario es obligatorio");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const fetchNewId = async () => {
    const res = await fetch("/api/usuarios", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const users = await res.json();
    const newId = users.length > 0 ? Math.max(...users.map((u: { id: number | string }) => Number(u.id))) + 1 : 1;
    return newId;
  };

  const addUsuario = async () => {
    if (validateForm()) {
      const newId = await fetchNewId();
      const formData: UsuarioModel = {
        id: newId, // Usar el nuevo ID generado como número
        nombre: name,
        apellido: apellido,
        cedula: cedula,
        fecha_nasc: fechaNasc as Date, // Aquí hacemos un type assertion
        telefono: telefonos, // Adaptar según tu estructura
        email: email,
        password: password,
        tipo_usuario: tipoUsuario as ReferrerEnum,
        estado: ReferrerEnum.PENDIENTE,
        institucion: ReferrerEnum.INSTITUCION,
        nombre_usuario: ''
      };

      const add = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await add.json();

      if (add.ok) {
        router.push("/usuarios");
      } else {
        setErrors([data.error]);
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    addUsuario();
  };

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
        <div className='w-full p-4 sm:p-12.5 xl:p-17.5"'>
          
        <span className='mb-1.5 block text-2xl font-extrabold'>
          Agregar Usuario
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
        <div className='w-full py-2'>
          <label htmlFor="nombre" className='mb-2.5 block font-medium text-sm text-black dark:text-white'>
            Nombre
          </label>
          <input 
            type="text" 
            name="nombre"
            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="apellido" className='mb-2.5 block font-medium text-sm text-black dark:text-white'>
            Apellido
          </label>
          <input 
            type="text" 
            name="apellido"
            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="cedula" className='mb-2.5 block font-medium text-sm text-black dark:text-white'>
            Cédula
          </label>
          <input 
            type="text" 
            name="cedula"
            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="password" className='mb-2.5 block font-medium text-sm text-black dark:text-white'>
            Password
          </label>
          <input 
            type="password" 
            name="password"
            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="fecha_nasc" className='mb-2.5 block font-medium text-sm text-black dark:text-white'>
            Fecha de Nacimiento
          </label>
          <DatePicker 
            selected={fechaNasc}
            onChange={(date: Date | null, event: React.SyntheticEvent<any> | undefined) => setFechaNasc(date)}
            dateFormat="yyyy-MM-dd"
            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            locale="es"
            />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="telefonos" className='mb-2.5 block font-medium text-sm text-black dark:text-white'>
            Teléfonos
          </label>
          {telefonos.map((tel, index) => (
            <input 
            key={index}
            type="text" 
            name={`telefono_${index}`}
            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary mt-2'
            value={tel}
            onChange={(e) => handleTelefonoChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addTelefono} className='w-full mt-2 p-2 text-white border-gray-600 border-[1px] rounded bg-green-500'>
            Agregar Teléfono
          </button>
        </div>
        <div className='w-full py-2'>
          <label htmlFor="email" className='mb-2.5 block font-medium text-sm text-black dark:text-white'>
            Email
          </label>
          <input 
            type="text" 
            name="email"
            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="tipo_usuario" className='mb-2.5 block font-medium text-sm text-black dark:text-white'>
            Tipo de Usuario
          </label>
          <select
            name="tipo_usuario"
            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
            >
            <option value="">Seleccione un tipo de usuario</option>
            <option value={ReferrerEnum.AUXILIAR_ADMINISTRATIVO}>Auxiliar Administrativo</option>
            <option value={ReferrerEnum.INGENIERO_BIOMEDICO}>Ingeniero Biomédico</option>
            <option value={ReferrerEnum.TECNICO}>Técnico</option>
            <option value={ReferrerEnum.TECNOLOGO}>Tecnólogo</option>
          </select>
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
            onClick={() => router.push('/usuarios')}
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
            <p>¿Estás seguro de que deseas guardar este usuario?</p>
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
    </DefaultLayout>
  );
}

export default UsuariosCreate;
