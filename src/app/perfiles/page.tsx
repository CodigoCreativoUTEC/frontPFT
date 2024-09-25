import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PerfilesRead from "@/components/Perfiles/listarPerfiles";

export const metadata: Metadata = {
    title: "Listado de perfiles",
    description: "Listado de perfiles ingresados",
};

const listadoPerfiles: React.FC = function() {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Lista de perfiles" />
            <PerfilesRead />
        </DefaultLayout>
    );
};

export default listadoPerfiles;
