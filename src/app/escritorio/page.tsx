import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import EscritorioComponent from "@/components/Paginas/Escritorio";

export const metadata: Metadata = {
    title: "MAMED - Escritorio",
    description:
    "Pagina para editar los datos del usuario ingresado",
};

const EscritorioPage = () => {
    return (
    <DefaultLayout>
        <div className="mx-auto max-w-242.5">
            <Breadcrumb pageName="Escritorio" />
            <EscritorioComponent />
        </div>
    </DefaultLayout>
    );
};

export default EscritorioPage;