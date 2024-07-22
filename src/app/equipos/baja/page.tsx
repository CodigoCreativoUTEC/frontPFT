import "react-datepicker/dist/react-datepicker.css";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EquiposBaja from "@/components/Equipos/Baja/listarBajaEquipos";

export const metadata: Metadata = {
  title: "Equipos Inactivos",
  description: "Equipos inactivos",
};

const listarBajaEquipos = () => {
  
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Equipos inactivos" />
        <EquiposBaja />
      </DefaultLayout>
    );
  }

export default listarBajaEquipos;