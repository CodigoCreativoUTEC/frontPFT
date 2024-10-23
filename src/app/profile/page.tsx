import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MostrarPerfil from "@/components/perfilUsuario";


export const metadata: Metadata = {
    title: "Mi perfil"
};

const Profile = () => {
    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb pageName="Perfil" />
                <MostrarPerfil />
            </div>
        </DefaultLayout>
    );
};

export default Profile;