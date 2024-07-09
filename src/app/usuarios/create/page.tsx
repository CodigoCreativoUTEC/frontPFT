"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import { UsuarioModel } from '@/types/index'; // Asegúrate de que esta ruta sea correcta
import { ReferrerEnum } from '@/types/emuns';

const UsuariosCreate = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [cedula, setCedula] = useState<string>("");
  const [fechaNasc, setFechaNasc] = useState<Date | null>(null);
  const [telefonos, setTelefonos] = useState<string[]>([""]);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tipoUsuario, setTipoUsuario] = useState<ReferrerEnum>(ReferrerEnum.ADMIN);

  const addTelefono = () => {
    setTelefonos([...telefonos, ""]);
  };

  const handleTelefonoChange = (index: number, value: string) => {
    const newTelefonos = telefonos.map((tel, i) => (i === index ? value : tel));
    setTelefonos(newTelefonos);
  };

  const generateUsername = () => {
    return `${name.toLowerCase()}.${apellido.toLowerCase()}`;
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

  const addUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && apellido && cedula && fechaNasc && email) {
      const newId = await fetchNewId();
      const formData: UsuarioModel = {
        id: newId, // Usar el nuevo ID generado como número
        nombre: name,
        apellido: apellido,
        cedula: cedula,
        fecha_nasc: fechaNasc,
        telefono: telefonos, // Adaptar según tu estructura
        nombre_usuario: generateUsername(),
        email: email,
        password: password,
        tipo_usuario: tipoUsuario,
        estado: ReferrerEnum.PENDIENTE
      };

      const add = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (add.ok) {
        router.push("/usuarios");
      }
    } else {
      alert("No llenó todos los campos");
    }
  };

  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <form className='w-4/12 bg-white p-10' onSubmit={addUsuario}>
        <span className='font-bold text-black py-2 block underline text-2xl'>
          Agregar Usuario
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
            type="text" 
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
          <button type="button" onClick={addTelefono} className='w-full mt-2 p-2 text-white border-gray-600 border-[1px] rounded bg-lime-300'>
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
            onChange={(e) => setTipoUsuario(e.target.value as ReferrerEnum)}
          >
            <option value={ReferrerEnum.ADMIN}>Admin</option>
            <option value={ReferrerEnum.AUXILIAR_ADMINISTRATIVO}>Auxiliar Administrativo</option>
            <option value={ReferrerEnum.INGENIERO_BIOMEDICO}>Ingeniero Biomédico</option>
            <option value={ReferrerEnum.TECNICO}>Técnico</option>
            <option value={ReferrerEnum.TECNOLOGO}>Tecnólogo</option>
          </select>
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

export default UsuariosCreate;
