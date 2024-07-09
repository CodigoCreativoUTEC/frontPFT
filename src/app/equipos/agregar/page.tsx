
"use client";
import React from "react";
import FormElements from "@/components/FormElements";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"


import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AgregarEquipo= () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const addUsuario = async (e: any) => {
    e.preventDefault();
    if (name && apellido && email) {
      const formData = {
        id: Math.floor(Math.random() * 1000),  // Generar un ID aleatorio para la demo
        nombre: name,
        apellido: apellido,
        cedula: "00000000",
        fecha_nasc: new Date().toISOString(),
        telefono: {
          casa: "1234-5678",
          movil: "9876-5432"
        },
        nombre_usuario: name,
        email: email,
        password: "password123",
        tipo_usuario: "user",
        estado: "activo"
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
        <DefaultLayout>
        
            <Breadcrumb pageName="Agregar Equipo" />
            <div className="grid grid-cols-1 gap-9 ">
            <div className="flex flex-col gap-9">
                {/* <!-- Input Fields --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Input Fields
              </h3>
            </div>
            <div className='flex justify-center items-center w-full h-screen'>
      <form className='w-4/12 bg-white p-10' onSubmit={addUsuario}>
        <span className='font-bold text-black py-2 block underline text-2xl'>
          Agregar
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
          <button className='w-20 p-2 text-white border-gray-600 border-[1px] rounded bg-lime-300'>
            Enviar
          </button>
        </div>
      </form>
    </div>
          </div>
            </div>
            </div>
            </DefaultLayout>
            
    )
};

export default AgregarEquipo;