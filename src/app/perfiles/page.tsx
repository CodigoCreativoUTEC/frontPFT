"use-client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Listar from "@/components/Paginas/Perfiles/Listar";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Listado de perfiles",
};

const TablesPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Listado de perfiles" />
            <div className="flex flex-col gap-10">
                <Listar />
            </div>
        </DefaultLayout>
    );
};

export default TablesPage;
