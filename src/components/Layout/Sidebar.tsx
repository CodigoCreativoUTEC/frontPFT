"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";

interface Perfil {
  id: number;
  nombrePerfil: string;
  estado: string;
}

interface Funcionalidad {
  id: number;
  nombreFuncionalidad: string;
  ruta: string;
  estado: string;
  perfiles: Perfil[];
}

interface MenuGroup {
  name: string;
  icon?: string;
  items: {
    name: string;
    path: string;
  }[];
}

const DynamicSidebar = () => {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchFuncionalidades = async () => {
      try {
        const funcionalidades = await fetcher<Funcionalidad[]>("/funcionalidades/listar", {
          method: "GET",
        });

        // Obtener el perfil del usuario del localStorage
        const userProfile = JSON.parse(localStorage.getItem("user") || "{}");
        const userProfileId = userProfile?.idPerfil?.id;

        // Filtrar funcionalidades por el perfil del usuario
        const filteredFuncionalidades = funcionalidades.filter((func) =>
          func.perfiles.some((perfil) => perfil.id === userProfileId)
        );

        // Agrupar funcionalidades por la primera parte de la ruta
        const groups: { [key: string]: MenuGroup } = {};

        filteredFuncionalidades.forEach((func) => {
          // Ignorar rutas que no queremos mostrar en el menú
          if (func.ruta.includes("/seleccionar") || 
              func.ruta.includes("/buscar") || 
              func.ruta.includes("/filtrar") ||
              func.ruta.includes("/modificar-propio-usuario") ||
              func.ruta.includes("/renovar-token") ||
              func.ruta.includes("/obtenerUserEmail")) {
            return;
          }

          const [_, group] = func.ruta.split("/");
          if (!group) return;

          if (!groups[group]) {
            groups[group] = {
              name: group.charAt(0).toUpperCase() + group.slice(1),
              items: [],
            };
          }

          // Agregar cada funcionalidad como un item único por su ruta
          const exists = groups[group].items.some(item => item.path === func.ruta);
          if (!exists) {
            groups[group].items.push({
              name: func.nombreFuncionalidad,
              path: func.ruta,
            });
          }
        });

        setMenuGroups(Object.values(groups));
      } catch (error) {
        console.error("Error fetching funcionalidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionalidades();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-gray-800 text-white p-4">
        <div className="animate-pulse">Cargando menú...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-800 text-white w-64">
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-6">Menú</h2>
        <nav>
          {menuGroups.map((group, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-medium mb-2 px-2">{group.name}</h3>
              <ul>
                {group.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.path}
                      className={`block px-4 py-2 rounded hover:bg-gray-700 transition-colors ${
                        pathname === item.path ? "bg-gray-700" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DynamicSidebar; 