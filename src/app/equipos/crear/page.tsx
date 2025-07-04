import CrearEquipo from "@/components/Paginas/Equipos/Crear";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Creacion de Equipo",
};

const CrearEquipoPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Creacion de Equipo" />
                <CrearEquipo />
        </DefaultLayout>
    );
};

export default CrearEquipoPage;