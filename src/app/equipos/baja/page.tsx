"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BajaEquipoModel, ReferrerEnum } from '@/types';
import BajaEquiposList from '@/components/Equipos/Baja/BajaEquipos';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { tipoEquipos, marcas, modelos, paises, proveedores, ubicaciones } from '@/types/enums';
import { signIn, useSession } from 'next-auth/react';

const EquiposBaja = () => {
  const [bajaEquipos, setBajaEquipos] = useState<BajaEquipoModel[]>([]);
  const { data: session, status } = useSession();
  
  const fetcher = async () => {
    const res = await fetch("http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/equipos/ListarBajaEquipos", {
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + (session?.user?.accessToken || ''),
      },
    });
    const result = await res.json();
    setBajaEquipos(result.filter((bajaEquipo: BajaEquipoModel) => bajaEquipo.estado));
  };

  useEffect(() => {
    fetcher().then(() => console.log("Obteniendo equipos de baja"));
  }, []);
  if (!session) {signIn();return null;}
  
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Equipos inactivos" />
        <EquiposBaja />
      </DefaultLayout>
    );
  }

export default listarBajaEquipos;