"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import { UsuarioModel, ReferrerEnum } from '@/types';

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
    <div className='flex justify-center items-center w-full h-screen'>
      <form className='w-4/12 bg-white p-10' onSubmit={(e) => e.preventDefault()}>
        <span className='font-bold text-black py-2 block underline text-2xl'>
          Agregar Usuario
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
          <label htmlFor="apellido" className='text-sm text-black font-bold py-2 block'>
            Apellido
          </label>
          <input 
            type="text" 
            name="apellido"
            className='w-full text-black border-[1px]'
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="cedula" className='text-sm text-black font-bold py-2 block'>
            Cédula
          </label>
          <input 
            type="text" 
            name="cedula"
            className='w-full text-black border-[1px]'
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="password" className='text-sm text-black font-bold py-2 block'>
            Password
          </label>
          <input 
            type="password" 
            name="password"
            className='w-full text-black border-[1px]'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="fecha_nasc" className='text-sm text-black font-bold py-2 block'>
            Fecha de Nacimiento
          </label>
          <DatePicker 
            selected={fechaNasc}
            onChange={(date: Date | null, event: React.SyntheticEvent<any> | undefined) => setFechaNasc(date)}
            dateFormat="yyyy-MM-dd"
            className='w-full text-black border-[1px]'
            locale="es"
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="telefonos" className='text-sm text-black font-bold py-2 block'>
            Teléfonos
          </label>
          {telefonos.map((tel, index) => (
            <input 
              key={index}
              type="text" 
              name={`telefono_${index}`}
              className='w-full text-black border-[1px] mt-2'
              value={tel}
              onChange={(e) => handleTelefonoChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addTelefono} className='w-full mt-2 p-2 text-white border-gray-600 border-[1px] rounded bg-green-500'>
            Agregar Teléfono
          </button>
        </div>
        <div className='w-full py-2'>
          <label htmlFor="email" className='text-sm text-black font-bold py-2 block'>
            Email
          </label>
          <input 
            type="text" 
            name="email"
            className='w-full text-black border-[1px]'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='w-full py-2'>
          <label htmlFor="tipo_usuario" className='text-sm text-black font-bold py-2 block'>
            Tipo de Usuario
          </label>
          <select
            name="tipo_usuario"
            className='w-full text-black border-[1px]'
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
  );
}

export default UsuariosCreate;
