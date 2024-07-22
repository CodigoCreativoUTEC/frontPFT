import "react-datepicker/dist/react-datepicker.css";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BajaEquipoDetail from "@/components/Equipos/Baja/detalleBajaEquipo";

export const metadata: Metadata = {
  title: "Equipo Inactivo",
  description: "Equips inactivo",
};

const listarBajaEquipos = () => {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Detalles equipo inactivo" />
        <BajaEquipoDetail />
      </DefaultLayout>
    );
  }

export default listarBajaEquipos;