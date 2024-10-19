"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { Session } from "inspector";
import { signIn, useSession } from 'next-auth/react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
// Función para verificar permisos
function hasPermission(userProfile: string, requiredPermissions: string[]): boolean {
  return requiredPermissions.includes(userProfile);
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  
  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const { data: session, status } = useSession();

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const userProfile = session?.user?.perfil || '';

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-center gap-2 px-6 py-5.5 lg:py-6.5">
        <div className="columns-2 justify-start"><Link href="/">
        <svg xmlns="http://www.w3.org/2000/svg" className="dark:bg-white dark:rounded-full bg-white rounded-full" version="1.0" width="70" height="70" viewBox="0 0 324.000000 324.000000" preserveAspectRatio="xMidYMid meet">

<g transform="translate(-155.000000,552.000000) scale(0.20000,-0.200)" fill="#000000" stroke="none">
<path d="M1491 2740 c-470 -64 -782 -507 -681 -965 61 -276 260 -497 530 -588 90 -30 169 -40 288 -35 139 6 255 40 372 110 260 154 416 466 382 763 -25 219 -119 397 -285 536 -161 136 -402 206 -606 179z m504 -604 c0 -199 -3 -260 -12 -263 -10 -4 -13 35 -13 171 l0 176 -415 0 -415 0 2 -292 3 -293 63 -3 c44 -2 62 -7 59 -15 -2 -8 -30 -12 -83 -12 l-79 0 -3 375 c-1 206 0 385 3 398 l5 22 443 -2 442 -3 0 -259z m-341 5 c5 -8 -139 -247 -172 -284 -10 -11 -19 -14 -25 -8 -6 6 8 38 39 88 133 216 143 229 158 204z m-244 -35 c0 -8 -21 -35 -46 -61 l-47 -46 47 -48 c46 -46 57 -71 34 -71 -15 0 -118 100 -118 114 0 12 111 126 122 126 4 0 8 -6 8 -14z m364 -45 c66 -67 66 -68 -7 -140 -33 -31 -51 -42 -63 -37 -15 6 -10 14 29 54 26 26 47 52 47 56 0 5 -20 31 -46 58 -39 42 -49 68 -26 68 4 0 34 -26 66 -59z m164 -206 c6 -33 19 -40 47 -25 23 12 28 11 55 -15 30 -29 39 -58 20 -70 -15 -9 0 -33 26 -39 21 -6 24 -12 24 -56 0 -42 -3 -50 -19 -50 -26 0 -48 -27 -33 -42 20 -20 14 -43 -18 -73 -26 -25 -33 -28 -50 -17 -29 18 -39 15 -50 -13 -12 -32 -30 -39 -75 -31 -25 5 -35 12 -35 26 0 27 -18 34 -46 19 -22 -11 -27 -10 -59 21 -32 31 -34 36 -21 55 17 26 4 55 -24 55 -17 0 -20 7 -20 50 0 44 3 50 24 56 26 6 41 30 26 39 -19 12 -10 41 20 70 27 26 32 27 54 16 28 -15 46 -8 46 18 0 27 10 32 60 29 36 -2 46 -7 48 -23z m-432 -90 c4 -9 19 -15 35 -15 32 0 63 -37 53 -64 -4 -10 0 -18 10 -22 23 -9 23 -84 0 -84 -12 0 -15 -6 -10 -23 7 -31 -33 -72 -62 -63 -15 5 -22 1 -27 -14 -9 -27 -70 -28 -85 -1 -6 13 -17 17 -30 14 -29 -8 -63 25 -55 54 4 16 -1 25 -15 33 -27 15 -27 65 0 80 15 8 19 17 15 31 -9 28 21 59 55 59 16 0 30 7 34 15 3 9 19 15 41 15 22 0 38 -6 41 -15z"/>
<path d="M1140 2310 l0 -50 415 0 415 0 0 50 0 50 -415 0 -415 0 0 -50z m60 5 c0 -8 -4 -15 -9 -15 -13 0 -22 16 -14 24 11 11 23 6 23 -9z m67 -11 c-9 -9 -28 6 -21 18 4 6 10 6 17 -1 6 -6 8 -13 4 -17z m70 0 c-9 -9 -28 6 -21 18 4 6 10 6 17 -1 6 -6 8 -13 4 -17z"/>
<path d="M1863 1821 c-6 -23 -56 -43 -88 -35 -26 6 -42 -11 -27 -29 14 -16 -10 -72 -37 -87 -24 -12 -28 -40 -6 -40 23 0 47 -45 43 -82 -3 -30 -1 -33 22 -31 40 3 87 -16 93 -37 7 -26 37 -26 44 -1 6 24 56 43 91 34 23 -5 24 -4 20 22 -8 40 10 85 38 95 29 12 31 30 4 37 -27 7 -53 68 -40 93 12 22 -2 35 -27 26 -25 -10 -80 13 -86 34 -7 26 -37 26 -44 1z m85 -117 c48 -54 11 -136 -62 -136 -99 0 -120 130 -26 165 26 10 64 -3 88 -29z"/>
<path d="M1844 1679 c-17 -19 -17 -23 -3 -47 27 -49 89 -37 89 17 0 51 -51 69 -86 30z"/>
<path d="M1442 1725 c-7 -8 -24 -15 -37 -15 -17 0 -25 -6 -25 -17 0 -10 -8 -31 -18 -48 -17 -28 -17 -30 0 -47 10 -10 18 -28 18 -40 0 -18 6 -23 27 -25 15 0 32 -9 39 -18 12 -15 15 -15 43 5 16 13 37 20 45 17 12 -5 16 0 16 16 0 12 7 33 16 45 14 20 14 24 0 44 -9 12 -16 33 -16 46 0 16 -4 22 -14 19 -7 -3 -28 3 -45 14 -37 22 -33 22 -49 4z m58 -65 c23 -23 26 -49 7 -74 -16 -21 -60 -24 -82 -6 -33 27 -6 100 37 100 10 0 27 -9 38 -20z"/>
<path d="M1445 1630 c-8 -14 3 -30 21 -30 8 0 14 9 14 20 0 21 -24 28 -35 10z"/>
</g>
</svg><p className="text-lg">CodigoCreativo</p>
        </Link></div>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >

        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU <aside>{session?.user.perfil}</aside>
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/" || pathname.includes("/")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div className={`translate transform overflow-hidden ${!open && "hidden" }`}>
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/" && "text-white"
                                }`}>
                              Escritorio
                            </Link>
                          </li>





{/* Menú para Administradores */}
{hasPermission(userProfile, ["Administrador", "Aux administrativo"]) && (
              <SidebarLinkGroup activeCondition={pathname === "/" || pathname.includes("/")}>
                {(handleClick, open) => (
                  <>
                    <div>
                      <Link href="/admin" className="group flex items-center px-4 py-2">Admin Dashboard</Link>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>
            )}

            {/* Menú para Técnicos */}
            {hasPermission(userProfile, ["Técnico", "Administrador"]) && (
              <SidebarLinkGroup activeCondition={pathname === "/equipos" || pathname.includes("equipos")}>
                {(handleClick, open) => (
                  <>
                    <div>
                      <Link href="/equipos" className="group flex items-center px-4 py-2">Ver Equipos</Link>
                    </div>
                    <div>
                      <Link href="/equipos/create" className="group flex items-center px-4 py-2">Agregar Equipos</Link>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>
            )}

            {/* Menú para Usuarios comunes */}
            {hasPermission(userProfile, ["Tecnico", "Administrador"]) && (
              <SidebarLinkGroup activeCondition={pathname === "/usuarios" || pathname.includes("usuarios")}>
                {(handleClick, open) => (
                  <>
                    <div>
                      <Link href="/usuarios" className="group flex items-center px-4 py-2">Ver Usuarios</Link>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>
            )}





                          <li>
                            <SidebarLinkGroup
                              activeCondition={
                                pathname === "/equipos" || pathname.includes("/equipos")
                              }
                            >
                              {(handleClick, open) => {
                                return (
                                  <React.Fragment>
                                    <Link
                                      href="#"
                                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                          pathname.includes("equipos")) &&
                                        "bg-graydark dark:bg-meta-4"
                                        }`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        sidebarExpanded
                                          ? handleClick()
                                          : setSidebarExpanded(true);
                                      }}
                                    >
                                      <svg width="24" height="24" viewBox="0 0 25 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" transform="rotate(-360 0 0)">
<path d="M12.0231 8.55941C11.6089 8.55941 11.2731 8.8952 11.2731 9.30941V11.9999H8.58266C8.16845 11.9999 7.83266 12.3357 7.83266 12.7499C7.83266 13.1641 8.16845 13.4999 8.58266 13.4999H11.2731V16.1909C11.2731 16.6051 11.6089 16.9409 12.0231 16.9409C12.4373 16.9409 12.7731 16.6051 12.7731 16.1909V13.4999H15.4641C15.8783 13.4999 16.2141 13.1641 16.2141 12.7499C16.2141 12.3357 15.8783 11.9999 15.4641 11.9999H12.7731V9.30941C12.7731 8.8952 12.4373 8.55941 12.0231 8.55941Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.77344 5.25C7.77344 4.00736 8.7808 3 10.0234 3H14.0234C15.2661 3 16.2734 4.00736 16.2734 5.25V6H19.2736C20.5163 6 21.5236 7.00736 21.5236 8.25V17.25C21.5236 18.4926 20.5163 19.5 19.2736 19.5H4.77344C3.5308 19.5 2.52344 18.4926 2.52344 17.25V8.25C2.52344 7.00736 3.5308 6 4.77344 6H7.77344V5.25ZM14.7734 5.25V6H9.27344V5.25C9.27344 4.83579 9.60922 4.5 10.0234 4.5H14.0234C14.4377 4.5 14.7734 4.83579 14.7734 5.25ZM4.77344 7.5H19.2736C19.6879 7.5 20.0236 7.83579 20.0236 8.25V17.25C20.0236 17.6642 19.6879 18 19.2736 18H4.77344C4.35922 18 4.02344 17.6642 4.02344 17.25V8.25C4.02344 7.83579 4.35922 7.5 4.77344 7.5Z" fill="#ffffff"/>
</svg>

                                      Equipos
                                      <svg
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                          }`}
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                          fill=""
                                        />
                                      </svg>
                                    </Link>
                                    {/* <!-- Dropdown Menu Start --> */}
                                    <div
                                      className={`translate transform overflow-hidden ${!open && "hidden"
                                        }`}
                                    >
                                      <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                        <li>
                                          <Link
                                            href="/equipos/create"
                                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/equipos/create" &&
                                              "text-white"
                                              }`}
                                          >
                                            Agregar Equipo
                                          </Link>
                                        </li>
                                        <li>
                                          <Link
                                            href="/equipos"
                                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/equipos" &&
                                              "text-white"
                                              } `}
                                          >
                                            Ver Equipos
                                          </Link>
                                        </li>
                                        <li>
                                          <Link
                                            href="/equipos/baja"
                                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/equipos/baja" &&
                                              "text-white"
                                              } `}
                                          >
                                            Equipos Inactivos
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                    {/* <!-- Dropdown Menu End --> */}
                                  </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                          </li>
                          <li>
                            <SidebarLinkGroup
                              activeCondition={
                                pathname === "/usuarios" || pathname.includes("forms")
                              }
                            >
                              {(handleClick, open) => {
                                return (
                                  <React.Fragment>
                                    <Link
                                      href="#"
                                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                          pathname.includes("forms")) &&
                                        "bg-graydark dark:bg-meta-4"
                                        }`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        sidebarExpanded
                                          ? handleClick()
                                          : setSidebarExpanded(true);
                                      }}
                                    >
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" transform="rotate(-360 0 0)">
<path d="M6.83691 9.8614C6.83691 8.96875 7.56055 8.24512 8.45319 8.24512C9.34584 8.24512 10.0695 8.96875 10.0695 9.8614C10.0695 10.754 9.34584 11.4777 8.45319 11.4777C7.56055 11.4777 6.83691 10.754 6.83691 9.8614Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.23935 12.0869C6.00313 12.0869 5.00098 13.0891 5.00098 14.3253V15.2555C5.00098 15.6697 5.33676 16.0055 5.75098 16.0055H11.156C11.5702 16.0055 11.906 15.6697 11.906 15.2555V14.3253C11.906 13.0891 10.9039 12.0869 9.66766 12.0869H7.23935ZM6.50098 14.3253C6.50098 13.9175 6.83156 13.5869 7.23935 13.5869H9.66766C10.0754 13.5869 10.406 13.9175 10.406 14.3253V14.5055H6.50098V14.3253Z" fill="#ffffff"/>
<path d="M19.0004 10.501C19.0004 10.9152 18.6646 11.251 18.2504 11.251H14.1504C13.7362 11.251 13.4004 10.9152 13.4004 10.501C13.4004 10.0868 13.7362 9.75098 14.1504 9.75098H18.2504C18.6646 9.75098 19.0004 10.0868 19.0004 10.501Z" fill="#ffffff"/>
<path d="M16.1508 14.251C16.565 14.251 16.9008 13.9152 16.9008 13.501C16.9008 13.0868 16.565 12.751 16.1508 12.751H14.1508C13.7366 12.751 13.4008 13.0868 13.4008 13.501C13.4008 13.9152 13.7366 14.251 14.1508 14.251H16.1508Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 4.50098C3.00736 4.50098 2 5.50834 2 6.75098V17.251C2 18.4936 3.00736 19.501 4.25 19.501H19.75C20.9926 19.501 22 18.4936 22 17.251V6.75098C22 5.50834 20.9926 4.50098 19.75 4.50098H4.25ZM3.5 6.75098C3.5 6.33676 3.83579 6.00098 4.25 6.00098H19.75C20.1642 6.00098 20.5 6.33676 20.5 6.75098V17.251C20.5 17.6652 20.1642 18.001 19.75 18.001H4.25C3.83579 18.001 3.5 17.6652 3.5 17.251V6.75098Z" fill="#ffffff"/>
</svg>


                                      Usuarios
                                      <svg
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                          }`}
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                          fill=""
                                        />
                                      </svg>
                                    </Link>
                                    {/* <!-- Dropdown Menu Start --> */}
                                    <div
                                      className={`translate transform overflow-hidden ${!open && "hidden"
                                        }`}
                                    >
                                      <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                        <li>
                                          <Link
                                            href="/usuarios/create"
                                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios/create" &&
                                              "text-white"
                                              }`}
                                          >
                                            Agregar Usuario
                                          </Link>
                                        </li>
                                        <li>
                                          <Link
                                            href="/usuarios"
                                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios" &&
                                              "text-white"
                                              } `}
                                          >
                                            Ver Usuarios
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                    {/* <!-- Dropdown Menu End --> */}
                                  </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                          </li>
                          <li>
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === "/tipo_equipo" || pathname.includes("forms")
                                }
                            >
                              {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                      <Link
                                          href="#"
                                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                              pathname.includes("forms")) &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            sidebarExpanded
                                                ? handleClick()
                                                : setSidebarExpanded(true);
                                          }}
                                      >
                                        <svg width="24" height="24" viewBox="0 0 25 25" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" transform="rotate(-360 0 0)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.56538 12.7847C2.64868 12.0166 2.69235 9.28826 4.63265 8.58188L18.6297 3.48619C20.4257 2.83233 22.1675 4.5741 21.5136 6.37015L16.4179 20.3672C15.7116 22.3075 12.9833 22.3511 12.2152 20.4344L10.146 15.2711C10.0697 15.0808 9.91898 14.9301 9.72877 14.8539L4.56538 12.7847ZM5.14579 9.99138C4.49902 10.2268 4.48446 11.1363 5.12336 11.3923L10.2867 13.4615C10.8574 13.6902 11.3096 14.1424 11.5383 14.7131L13.6075 19.8765C13.8636 20.5154 14.773 20.5008 15.0084 19.854L20.1041 5.85701C20.3221 5.25833 19.7415 4.67774 19.1428 4.89569L5.14579 9.99138Z" fill="#ffffff"/>
</svg>

                                        Tipo de Equipos
                                        <svg
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                            }`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                              fill=""
                                          />
                                        </svg>
                                      </Link>
                                      {/* <!-- Dropdown Menu Start --> */}
                                      <div
                                          className={`translate transform overflow-hidden ${!open && "hidden"
                                          }`}
                                      >
                                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                          <li>
                                            <Link
                                                href="/tipo_equipo/create"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios/create" &&
                                                "text-white"
                                                }`}
                                            >
                                              Agregar Tipo de Equipos
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/tipo_equipo"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios" &&
                                                "text-white"
                                                } `}
                                            >
                                              Ver Tipo de Equipos
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                      {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                          </li>
                          <li>
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === "/proveedores" || pathname.includes("forms")
                                }
                            >
                              {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                      <Link
                                          href="#"
                                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                              pathname.includes("forms")) &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            sidebarExpanded
                                                ? handleClick()
                                                : setSidebarExpanded(true);
                                          }}
                                      >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" transform="rotate(-360 0 0)">
<path d="M15.3086 2.75L15.5932 2.05611C15.4108 1.9813 15.2063 1.9813 15.0239 2.05611L15.3086 2.75Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.3086 2.75C15.0239 2.05611 15.0239 2.05611 15.0239 2.05611L15.0227 2.05663L15.0211 2.05727L15.0173 2.05886L15.0066 2.06337L14.9735 2.07777C14.9464 2.08977 14.9094 2.10663 14.8639 2.12847C14.7731 2.1721 14.6477 2.23595 14.4991 2.32112C14.2036 2.4906 13.8084 2.74918 13.4106 3.10723C12.6158 3.82257 11.766 4.98015 11.766 6.63101C11.766 8.65116 13.3019 10.383 15.3086 10.383C17.3152 10.383 18.8511 8.65116 18.8511 6.63101C18.8511 4.98015 18.0014 3.82257 17.2066 3.10723C16.8087 2.74918 16.4136 2.4906 16.118 2.32112C15.9695 2.23595 15.8441 2.1721 15.7532 2.12847C15.7077 2.10663 15.6707 2.08977 15.6436 2.07777L15.6105 2.06337L15.5998 2.05886L15.596 2.05727L15.5945 2.05663C15.5945 2.05663 15.5932 2.05611 15.3086 2.75ZM16.2031 4.22217C15.9028 3.95191 15.5999 3.75313 15.3718 3.62234C15.3499 3.6098 15.3288 3.59793 15.3086 3.58672C15.2883 3.59793 15.2672 3.6098 15.2454 3.62234C15.0173 3.75313 14.7143 3.95191 14.414 4.22217C13.8126 4.76347 13.266 5.5464 13.266 6.63101C13.266 7.61344 13.8206 8.4007 14.5586 8.72398V6.10577C14.5586 5.69155 14.8944 5.35577 15.3086 5.35577C15.7228 5.35577 16.0586 5.69155 16.0586 6.10577V8.72398C16.7966 8.4007 17.3511 7.61344 17.3511 6.63101C17.3511 5.5464 16.8046 4.76347 16.2031 4.22217Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.4266 11.084C20.0839 10.5509 21.0447 10.6312 21.6044 11.266C22.1114 11.8411 22.1317 12.6975 21.6525 13.296L17.7859 18.1246C17.4104 18.5935 16.8423 18.8663 16.2417 18.8663H10.0685C9.8825 18.8663 9.70317 18.9354 9.56527 19.0602L9.04042 19.5351C9.14503 19.8637 9.01125 20.2321 8.7004 20.4115L6.1238 21.8991C5.76508 22.1062 5.30638 21.9833 5.09928 21.6246L2.10061 16.4308C1.8935 16.072 2.01641 15.6133 2.37513 15.4062L4.95173 13.9186C5.18986 13.7812 5.47206 13.7891 5.69546 13.9149L7.38764 12.5622C7.94114 12.1197 8.64057 11.8147 9.41278 11.8112C10.2262 11.8076 11.5119 11.8795 12.6754 12.3042H15.2732C15.9345 12.3042 16.512 12.6633 16.8212 13.1972L19.4266 11.084ZM8.55886 17.9479L8.2864 18.1945L6.53627 15.1632L8.32425 13.7338C8.66549 13.4611 9.04628 13.3129 9.41955 13.3112C10.1887 13.3077 11.296 13.383 12.222 13.736C12.3365 13.7796 12.4613 13.8042 12.5912 13.8042H15.2732C15.432 13.8042 15.5608 13.9329 15.5608 14.0918C15.5608 14.1585 15.5381 14.2199 15.5 14.2687L15.4269 14.328C15.4184 14.3349 15.4102 14.3419 15.4021 14.349C15.3633 14.3685 15.3195 14.3794 15.2732 14.3794H12.5383C12.1241 14.3794 11.7883 14.7152 11.7883 15.1294C11.7883 15.5437 12.1241 15.8794 12.5383 15.8794H15.2732C15.7583 15.8794 16.1984 15.6862 16.5205 15.3724L20.3715 12.249C20.404 12.2226 20.4515 12.2266 20.4792 12.258C20.5043 12.2864 20.5053 12.3288 20.4816 12.3584L16.615 17.187C16.5242 17.3004 16.3869 17.3663 16.2417 17.3663H10.0685C9.51056 17.3663 8.97255 17.5736 8.55886 17.9479ZM3.77464 16.3303L6.02332 20.2251L7.30088 19.4875L5.05221 15.5927L3.77464 16.3303Z" fill="#ffffff"/>
</svg>

                                        Proveedores
                                        <svg
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                            }`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                              fill=""
                                          />
                                        </svg>
                                      </Link>
                                      {/* <!-- Dropdown Menu Start --> */}
                                      <div
                                          className={`translate transform overflow-hidden ${!open && "hidden"
                                          }`}
                                      >
                                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                          <li>
                                            <Link
                                                href="/proveedores/create"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios/create" &&
                                                "text-white"
                                                }`}
                                            >
                                              Agregar Proveedor
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/proveedores"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios" &&
                                                "text-white"
                                                } `}
                                            >
                                              Ver Proveedores
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                      {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                          </li>
                          <li>
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === "/modelos" || pathname.includes("forms")
                                }
                            >
                              {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                      <Link
                                          href="#"
                                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                              pathname.includes("forms")) &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            sidebarExpanded
                                                ? handleClick()
                                                : setSidebarExpanded(true);
                                          }}
                                      >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" transform="rotate(-360 0 0)">
<path d="M20.5 14.3105C20.5 13.1943 20.2801 12.089 19.853 11.0577C19.8068 10.9462 19.7583 10.8358 19.7075 10.7266L18.6527 11.3356C18.294 11.5427 17.8353 11.4198 17.6282 11.061C17.4211 10.7023 17.544 10.2436 17.9027 10.0365L18.9575 9.42755C18.6757 9.02601 18.3589 8.64867 18.0104 8.30014C17.2211 7.51084 16.2841 6.88474 15.2528 6.45757C14.4532 6.12638 13.6092 5.91981 12.75 5.8437V7.06055C12.75 7.47476 12.4142 7.81055 12 7.81055C11.5858 7.81055 11.25 7.47476 11.25 7.06055V5.8437C10.3908 5.91981 9.54676 6.12638 8.74719 6.45757C7.71592 6.88474 6.77889 7.51084 5.98959 8.30014C5.64116 8.64857 5.32453 9.0258 5.04277 9.42721L6.09729 10.036C6.45601 10.2431 6.57891 10.7018 6.3718 11.0605C6.1647 11.4193 5.70601 11.5422 5.34729 11.3351L4.2927 10.7262C4.24184 10.8356 4.19327 10.9461 4.14702 11.0577C3.71986 12.089 3.5 13.1943 3.5 14.3105C3.5 15.4268 3.71986 16.5321 4.14702 17.5634C4.1932 17.6748 4.24169 17.7852 4.29247 17.8944L5.34533 17.2865C5.70405 17.0794 6.16274 17.2023 6.36985 17.561C6.57696 17.9198 6.45405 18.3784 6.09533 18.5856L4.36328 19.5856C4.00456 19.7927 3.54587 19.6698 3.33876 19.311C3.33162 19.2987 3.32488 19.2862 3.31852 19.2736C3.10938 18.9078 2.92314 18.5283 2.76121 18.1374C2.25866 16.9241 2 15.6238 2 14.3105C2 12.9973 2.25866 11.697 2.76121 10.4837C3.26375 9.27046 4.00035 8.16806 4.92893 7.23948C5.85752 6.31089 6.95991 5.5743 8.17317 5.07175C9.38642 4.5692 10.6868 4.31055 12 4.31055C13.3132 4.31055 14.6136 4.5692 15.8268 5.07175C17.0401 5.5743 18.1425 6.31089 19.0711 7.23948C19.9997 8.16807 20.7362 9.27046 21.2388 10.4837C21.7413 11.697 22 12.9973 22 14.3105C22 15.6238 21.7413 16.9241 21.2388 18.1374C21.071 18.5425 20.8771 18.9352 20.6587 19.3133C20.4515 19.6719 19.9927 19.7947 19.6341 19.5875C19.6165 19.5773 19.5995 19.5665 19.5831 19.5552L17.9027 18.5851C17.544 18.378 17.4211 17.9193 17.6282 17.5605C17.8353 17.2018 18.294 17.0789 18.6527 17.286L19.7073 17.8949C19.7582 17.7855 19.8067 17.675 19.853 17.5634C20.2801 16.5321 20.5 15.4268 20.5 14.3105Z" fill="#ffffff"/>
<path d="M12.0003 10.186L12.6636 9.83595C12.5338 9.58997 12.2785 9.43604 12.0003 9.43604C11.7222 9.43604 11.4669 9.58997 11.337 9.83595L12.0003 10.186Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.0003 10.186C11.337 9.83595 11.3371 9.83589 11.337 9.83595L11.3356 9.83873L11.3319 9.84572L11.3182 9.87189L11.2673 9.96985C11.2237 10.0542 11.1617 10.175 11.0874 10.3226C10.9391 10.6172 10.7407 11.0205 10.5416 11.4527C10.3435 11.8828 10.1399 12.3519 9.98425 12.7757C9.84213 13.1627 9.69531 13.6255 9.69531 13.991C9.69531 15.2641 10.7273 16.296 12.0003 16.296C13.2733 16.296 14.3053 15.2641 14.3053 13.991C14.3053 13.6255 14.1585 13.1627 14.0164 12.7757C13.8608 12.3519 13.6571 11.8828 13.459 11.4527C13.2599 11.0205 13.0615 10.6172 12.9132 10.3226C12.8389 10.175 12.7769 10.0542 12.7334 9.96985L12.6825 9.87189L12.6687 9.84572L12.6651 9.83873L12.6636 9.83595C12.6636 9.83589 12.6636 9.83595 12.0003 10.186ZM11.904 12.0803C11.9362 12.0105 11.9684 11.9414 12.0003 11.8734C12.0323 11.9414 12.0645 12.0105 12.0966 12.0803C12.2872 12.4941 12.4724 12.9225 12.6083 13.2927C12.6764 13.478 12.7285 13.6391 12.7629 13.7705C12.7799 13.8358 12.7912 13.8885 12.7979 13.9293C12.8013 13.9494 12.8032 13.9648 12.8043 13.976C12.8053 13.9863 12.8053 13.9912 12.8053 13.9912C12.8053 14.4357 12.4449 14.796 12.0003 14.796C11.5558 14.796 11.1954 14.4357 11.1953 13.9912C11.1953 13.9912 11.1954 13.9863 11.1964 13.976C11.1974 13.9648 11.1994 13.9494 11.2027 13.9293C11.2095 13.8885 11.2207 13.8358 11.2378 13.7705C11.2721 13.6391 11.3243 13.478 11.3923 13.2927C11.5283 12.9225 11.7134 12.4941 11.904 12.0803Z" fill="#ffffff"/>
</svg>

                                        Modelos
                                        <svg
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                            }`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                              fill=""
                                          />
                                        </svg>
                                      </Link>
                                      {/* <!-- Dropdown Menu Start --> */}
                                      <div
                                          className={`translate transform overflow-hidden ${!open && "hidden"
                                          }`}
                                      >
                                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                          <li>
                                            <Link
                                                href="/modelos/create"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios/create" &&
                                                "text-white"
                                                }`}
                                            >
                                              Agregar Modelo
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/modelos"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios" &&
                                                "text-white"
                                                } `}
                                            >
                                              Ver Modelos
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                      {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                          </li>
                          <li>
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === "/marcas" || pathname.includes("forms")
                                }
                            >
                              {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                      <Link
                                          href="#"
                                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                              pathname.includes("forms")) &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            sidebarExpanded
                                                ? handleClick()
                                                : setSidebarExpanded(true);
                                          }}
                                      >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" transform="rotate(-360 0 0)">
<path d="M12.75 14.6667C12.75 14.2524 13.0858 13.9167 13.5 13.9167H16.5C16.9142 13.9167 17.25 14.2524 17.25 14.6667C17.25 15.0809 16.9142 15.4167 16.5 15.4167H13.5C13.0858 15.4167 12.75 15.0809 12.75 14.6667Z" fill="#ffffff"/>
<path d="M13.5 8.58334C13.0858 8.58334 12.75 8.91913 12.75 9.33334C12.75 9.74756 13.0858 10.0833 13.5 10.0833H16.5C16.9142 10.0833 17.25 9.74756 17.25 9.33334C17.25 8.91913 16.9142 8.58334 16.5 8.58334H13.5Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 3.25C10.2574 3.25 9.25 4.25736 9.25 5.5V7.75H5.5C4.25736 7.75 3.25 8.75736 3.25 10V20C3.25 20.4142 3.58579 20.75 4 20.75H20C20.4142 20.75 20.75 20.4142 20.75 20V5.5C20.75 4.25736 19.7426 3.25 18.5 3.25H11.5ZM9.25 19.25V17H7.75586C7.34165 17 7.00586 16.6642 7.00586 16.25C7.00586 15.8358 7.34165 15.5 7.75586 15.5H9.25V13H7.75586C7.34165 13 7.00586 12.6642 7.00586 12.25C7.00586 11.8358 7.34165 11.5 7.75586 11.5H9.25V9.25H5.5C5.08579 9.25 4.75 9.58579 4.75 10V19.25H9.25ZM10.75 12.2773C10.7503 12.2683 10.7505 12.2591 10.7505 12.25C10.7505 12.2409 10.7503 12.2317 10.75 12.2227V5.5C10.75 5.08579 11.0858 4.75 11.5 4.75H18.5C18.9142 4.75 19.25 5.08579 19.25 5.5V19.25H10.75V16.2773C10.7503 16.2683 10.7505 16.2591 10.7505 16.25C10.7505 16.2409 10.7503 16.2317 10.75 16.2227V12.2773Z" fill="#ffffff"/>
</svg>

                                        Marcas
                                        <svg
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                            }`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                              fill=""
                                          />
                                        </svg>
                                      </Link>
                                      {/* <!-- Dropdown Menu Start --> */}
                                      <div
                                          className={`translate transform overflow-hidden ${!open && "hidden"
                                          }`}
                                      >
                                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                          <li>
                                            <Link
                                                href="/marcas/create"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios/create" &&
                                                "text-white"
                                                }`}
                                            >
                                              Agregar Marca
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/marcas"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios" &&
                                                "text-white"
                                                } `}
                                            >
                                              Ver Marcas
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                      {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                          </li>
                          {/* <!-- Nuevas funcionalidades Sprint 2 --> */}
                          <li>
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === "/perfiles" || pathname.includes("forms")
                                }
                            >
                              {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                      <Link
                                          href="#"
                                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                              pathname.includes("forms")) &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            sidebarExpanded
                                                ? handleClick()
                                                : setSidebarExpanded(true);
                                          }}
                                      >
                                        <svg width="24" height="24" viewBox="0 0 25 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" transform="rotate(-360 0 0)">
<path d="M15.3289 11.4955C14.4941 11.4955 13.724 11.2188 13.1051 10.7522C13.3972 10.3301 13.6284 9.86262 13.786 9.36254C14.1827 9.7539 14.7276 9.99545 15.3289 9.99545C16.5422 9.99545 17.5258 9.01185 17.5258 7.79851C17.5258 6.58517 16.5422 5.60156 15.3289 5.60156C14.7276 5.60156 14.1827 5.84312 13.786 6.23449C13.6284 5.73441 13.3972 5.26698 13.1051 4.84488C13.7239 4.37824 14.4941 4.10156 15.3289 4.10156C17.3706 4.10156 19.0258 5.75674 19.0258 7.79851C19.0258 9.84027 17.3706 11.4955 15.3289 11.4955Z" fill="#ffffff"/>
<path d="M14.7723 13.1891C15.0227 13.437 15.2464 13.6945 15.4463 13.9566C16.7954 13.9826 17.7641 14.3143 18.4675 14.7651C19.2032 15.2366 19.6941 15.8677 20.0242 16.5168C20.3563 17.1698 20.5204 17.8318 20.6002 18.337C20.6398 18.5878 20.6579 18.795 20.6661 18.9365C20.6702 19.0071 20.6717 19.061 20.6724 19.0952L20.6726 19.1161L20.6727 19.1313L20.6727 19.1363L21.4197 19.1486C20.6793 19.1358 20.6728 19.136 20.6727 19.1363L20.6727 19.1376C20.6666 19.5509 20.9961 19.8914 21.4096 19.8985C21.8237 19.9057 22.1653 19.5758 22.1725 19.1617L21.4284 19.1488C22.1725 19.1617 22.1725 19.1621 22.1725 19.1617L22.1725 19.1599L22.1726 19.1575L22.1726 19.1511L22.1727 19.1319C22.1727 19.1163 22.1726 19.0951 22.1721 19.0686C22.1712 19.0158 22.1689 18.9419 22.1636 18.85C22.153 18.6665 22.1303 18.4094 22.0819 18.1029C21.9856 17.4936 21.7848 16.6697 21.3612 15.8368C20.9357 15 20.2801 14.1451 19.2768 13.5022C18.2708 12.8574 16.9604 12.4549 15.274 12.4549C14.8284 12.4549 14.4092 12.483 14.0148 12.5362C14.2852 12.7384 14.5376 12.9566 14.7723 13.1891Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.13173 7.79855C5.13173 5.75678 6.7869 4.1016 8.82867 4.1016C10.8704 4.1016 12.5256 5.75678 12.5256 7.79855C12.5256 9.84031 10.8704 11.4955 8.82867 11.4955C6.7869 11.4955 5.13173 9.84031 5.13173 7.79855ZM8.82867 5.6016C7.61533 5.6016 6.63173 6.58521 6.63173 7.79855C6.63173 9.01189 7.61533 9.99549 8.82867 9.99549C10.042 9.99549 11.0256 9.01189 11.0256 7.79855C11.0256 6.58521 10.042 5.6016 8.82867 5.6016Z" fill="#ffffff"/>
<path d="M3.37502 19.1374C3.38126 19.5507 3.0517 19.8914 2.63812 19.8986C2.22397 19.9058 1.88241 19.5759 1.87522 19.1617L2.62511 19.1487C1.87522 19.1617 1.87523 19.1621 1.87522 19.1617L1.87519 19.1599L1.87516 19.1575L1.87509 19.1511L1.875 19.1319C1.87499 19.1163 1.87512 19.0951 1.87559 19.0687C1.87653 19.0158 1.87882 18.942 1.88413 18.85C1.89474 18.6665 1.91745 18.4094 1.96585 18.103C2.0621 17.4936 2.26292 16.6697 2.68648 15.8368C3.11206 15 3.76758 14.1452 4.77087 13.5022C5.77688 12.8575 7.08727 12.455 8.77376 12.455C10.4602 12.455 11.7706 12.8575 12.7767 13.5022C13.7799 14.1452 14.4355 15 14.861 15.8368C15.2846 16.6697 15.4854 17.4936 15.5817 18.103C15.6301 18.4094 15.6528 18.6665 15.6634 18.85C15.6687 18.942 15.671 19.0158 15.6719 19.0687C15.6724 19.0951 15.6725 19.1163 15.6725 19.1319L15.6724 19.1511L15.6724 19.1575L15.6723 19.1599C15.6723 19.1603 15.6723 19.1617 14.9282 19.1488L15.6723 19.1617C15.6651 19.5759 15.3235 19.9058 14.9094 19.8986C14.4959 19.8914 14.1664 19.5509 14.1725 19.1376L14.1725 19.1364C14.1726 19.1361 14.1791 19.1358 14.9199 19.1487L14.1725 19.1364L14.1725 19.1314L14.1724 19.1161L14.1722 19.0952C14.1716 19.061 14.17 19.0072 14.1659 18.9366C14.1577 18.7951 14.1396 18.5878 14.1 18.337C14.0202 17.8319 13.8561 17.1699 13.524 16.5168C13.1939 15.8677 12.703 15.2366 11.9673 14.7651C11.2343 14.2954 10.2132 13.955 8.77376 13.955C7.33434 13.955 6.31319 14.2954 5.58022 14.7651C4.84453 15.2366 4.35363 15.8677 4.02351 16.5168C3.6914 17.1699 3.52727 17.8319 3.44749 18.337C3.40787 18.5878 3.38981 18.7951 3.38163 18.9366C3.37756 19.0072 3.37596 19.061 3.37536 19.0952C3.37505 19.1123 3.375 19.1245 3.375 19.1314L3.37502 19.1374Z" fill="#ffffff"/>
</svg>

                                        Perfiles
                                        <svg
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                            }`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                              fill=""
                                          />
                                        </svg>
                                      </Link>
                                      {/* <!-- Dropdown Menu Start --> */}
                                      <div
                                          className={`translate transform overflow-hidden ${!open && "hidden"
                                          }`}
                                      >
                                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                          <li>
                                            <Link
                                                href="/perfiles/create"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios/create" &&
                                                "text-white"
                                                }`}
                                            >
                                              Agregar Perfil
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/perfiles"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios" &&
                                                "text-white"
                                                } `}
                                            >
                                              Ver Perfiles
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                      {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                          </li>
                          <li>
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === "/funcionalidades" || pathname.includes("forms")
                                }
                            >
                              {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                      <Link
                                          href="#"
                                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                              pathname.includes("forms")) &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            sidebarExpanded
                                                ? handleClick()
                                                : setSidebarExpanded(true);
                                          }}
                                      >
                                        <svg width="24" height="24" viewBox="0 0 25 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" transform="rotate(-360 0 0)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.66699 6.75C8.66699 5.50736 9.67435 4.5 10.917 4.5H14.0837C15.3263 4.5 16.3337 5.50736 16.3337 6.75V9H17.1667C18.4093 9 19.4167 10.0074 19.4167 11.25V13.5H20.2497C21.4923 13.5 22.4997 14.5074 22.4997 15.75V18.75C22.4997 19.1642 22.1639 19.5 21.7497 19.5H3.25C2.83579 19.5 2.5 19.1642 2.5 18.75V15.75C2.5 14.5074 3.50736 13.5 4.75 13.5H5.58398V11.25C5.58398 10.0074 6.59134 9 7.83398 9H8.66699V6.75ZM10.167 9H14.8337V6.75C14.8337 6.33579 14.4979 6 14.0837 6H10.917C10.5028 6 10.167 6.33579 10.167 6.75V9ZM7.83398 10.5C7.41977 10.5 7.08398 10.8358 7.08398 11.25V13.5H11.7507V10.5H7.83398ZM13.2507 10.5V13.5H17.9167V11.25C17.9167 10.8358 17.5809 10.5 17.1667 10.5H13.2507ZM4.75 15C4.33579 15 4 15.3358 4 15.75V18H8.66667V15H4.75ZM10.1667 15V18H14.8337V15H10.1667ZM16.3337 15V18H20.9997V15.75C20.9997 15.3358 20.6639 15 20.2497 15H16.3337Z" fill="#ffffff"/>
</svg>

                                        Funcionalidades
                                        <svg
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                            }`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                              fill=""
                                          />
                                        </svg>
                                      </Link>
                                      {/* <!-- Dropdown Menu Start --> */}
                                      <div
                                          className={`translate transform overflow-hidden ${!open && "hidden"
                                          }`}
                                      >
                                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                          <li>
                                            <Link
                                                href="/funcionalidades/create"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios/create" &&
                                                "text-white"
                                                }`}
                                            >
                                              Agregar Funcionalidades
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/funcionalidades"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios" &&
                                                "text-white"
                                                } `}
                                            >
                                              Ver Funcionalidades
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/funcionalidades/acceso"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios" &&
                                                "text-white"
                                                } `}
                                            >
                                              Accesos de Funcionalidades
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                      {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                          </li>
                          <li>
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === "/intervenciones" || pathname.includes("forms")
                                }
                            >
                              {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                      <Link
                                          href="#"
                                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                              pathname.includes("forms")) &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            sidebarExpanded
                                                ? handleClick()
                                                : setSidebarExpanded(true);
                                          }}
                                      >
                                        <svg width="24" height="24" viewBox="0 0 24 25" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" transform="rotate(-360 0 0)">
<path d="M4.25315 5.39728C5.24418 5.9627 6.47801 5.25034 6.48385 4.10938L7.98373 4.10938C7.98956 5.25038 9.22343 5.96275 10.2145 5.3973L10.9635 6.6946C11.3812 6.46162 11.8798 6.30786 12.3876 6.21697C12.3568 6.12702 12.3169 6.03871 12.2675 5.95326L11.5095 4.64028C11.0998 3.93076 10.1954 3.68503 9.48364 4.0873C9.47615 3.26978 8.81111 2.60938 7.99183 2.60938H6.47573C5.65647 2.60938 4.99145 3.26976 4.98393 4.08724C4.27222 3.68501 3.3678 3.93074 2.95817 4.64024L2.20012 5.95323C1.79048 6.66275 2.0299 7.56889 2.73413 7.98413C2.0299 8.39938 1.7905 9.30551 2.20013 10.015L2.95819 11.328C3.36782 12.0375 4.27222 12.2832 4.98394 11.881C4.98962 12.4994 5.37154 13.0279 5.91185 13.2486C5.909 12.6779 6.05286 12.0988 6.35883 11.5689L6.4266 11.4515C6.17233 10.5593 5.11989 10.0765 4.25316 10.571L3.50323 9.27204C4.48844 8.69649 4.48842 7.27175 3.50321 6.69621L4.25315 5.39728Z" fill="#ffffff"/>
<path d="M7.23401 9.48438C8.06244 9.48438 8.73401 8.8128 8.73401 7.98438C8.73401 7.15595 8.06244 6.48438 7.23401 6.48438C6.40558 6.48438 5.73401 7.15595 5.73401 7.98438C5.73401 8.8128 6.40558 9.48438 7.23401 9.48438Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.6406 15.1107C11.6406 13.418 13.0129 12.0457 14.7056 12.0457C16.3984 12.0457 17.7706 13.418 17.7706 15.1107C17.7706 16.8035 16.3984 18.1757 14.7056 18.1757C13.0129 18.1757 11.6406 16.8035 11.6406 15.1107ZM14.7056 13.5457C13.8413 13.5457 13.1406 14.2464 13.1406 15.1107C13.1406 15.975 13.8413 16.6757 14.7056 16.6757C15.57 16.6757 16.2706 15.975 16.2706 15.1107C16.2706 14.2464 15.57 13.5457 14.7056 13.5457Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.65797 17.9026C7.15164 17.0256 7.45257 15.9045 8.32916 15.3984C8.55144 15.27 8.55094 14.9496 8.32953 14.8218C7.45293 14.3157 7.15258 13.1948 7.65869 12.3182L8.76495 10.4021C9.27102 9.52553 10.3919 9.22535 11.2683 9.73135C11.49 9.85937 11.767 9.69928 11.767 9.44355C11.767 8.43154 12.5874 7.61115 13.5994 7.61115H15.8121C16.8245 7.61115 17.6448 8.43199 17.6448 9.44397C17.6448 9.7002 17.9221 9.85987 18.1434 9.73212C19.0198 9.22613 20.1404 9.52641 20.6464 10.4028L21.7531 12.3196C22.259 13.1959 21.9588 14.3164 21.0825 14.8223C20.8615 14.9499 20.861 15.2697 21.0829 15.3978C21.9591 15.9037 22.26 17.0245 21.7538 17.9012L20.6475 19.8173C20.1414 20.6939 19.0205 20.9942 18.1439 20.4881C17.9222 20.3601 17.6448 20.5201 17.6448 20.7764C17.6448 21.7886 16.8243 22.6094 15.8119 22.6094H13.5996C12.5875 22.6094 11.767 21.7889 11.767 20.7768C11.767 20.5211 11.4899 20.3606 11.2678 20.4888C10.3913 20.9949 9.27006 20.6948 8.76384 19.818L7.65797 17.9026ZM9.07916 16.6974C8.91962 16.7895 8.86512 16.9935 8.957 17.1526L10.0629 19.068C10.1547 19.2271 10.3584 19.2818 10.5178 19.1898C11.7392 18.4846 13.267 19.3656 13.267 20.7768C13.267 20.9605 13.4159 21.1094 13.5996 21.1094H15.8119C15.9957 21.1094 16.1448 20.9603 16.1448 20.7764C16.1448 19.3657 17.672 18.4836 18.8939 19.1891C19.0531 19.281 19.2566 19.2264 19.3485 19.0673L20.4548 17.1512C20.5465 16.9923 20.4921 16.7888 20.3329 16.6968C19.1119 15.9919 19.1106 14.2287 20.3325 13.5233C20.4913 13.4316 20.5458 13.2285 20.4541 13.0696L19.3474 11.1528C19.2556 10.9938 19.0523 10.9394 18.8934 11.0312C17.6715 11.7366 16.1448 10.8542 16.1448 9.44397C16.1448 9.2601 15.9957 9.11114 15.8121 9.11114L13.5994 9.11115C13.4158 9.11115 13.267 9.25997 13.267 9.44355C13.267 10.8543 11.7397 11.7356 10.5183 11.0304C10.3592 10.9385 10.1558 10.9931 10.064 11.1521L8.95773 13.0682C8.86583 13.2273 8.92037 13.4308 9.07953 13.5227C10.3018 14.2284 10.3006 15.9922 9.07916 16.6974Z" fill="#ffffff"/>
</svg>

                                        Intervenciones
                                        <svg
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                            }`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                              fill=""
                                          />
                                        </svg>
                                      </Link>
                                      {/* <!-- Dropdown Menu Start --> */}
                                      <div
                                          className={`translate transform overflow-hidden ${!open && "hidden"
                                          }`}
                                      >
                                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                          <li>
                                            <Link
                                                href="/intervenciones/create"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios/create" &&
                                                "text-white"
                                                }`}
                                            >
                                              Registrar Intervención
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/intervenciones"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios" &&
                                                "text-white"
                                                } `}
                                            >
                                              Reporte de Intervenciones
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                      {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Dashboard --> */}
              {/* <!-- Menu Item Forms --> */}


              {/* <!-- Menu Item Settings --> */}
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Chart --> */}

              {/* <!-- Menu Item Chart --> */}

              {/* <!-- Menu Item Ui Elements --> */}

              {/* <!-- Menu Item Ui Elements --> */}

              {/* <!-- Menu Item Auth Pages --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/auth" || pathname.includes("auth")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/auth" || pathname.includes("auth")) &&
                          "bg-graydark dark:bg-meta-4"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      />
                       
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && "hidden"
                          }`}
                      >
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Auth Pages --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
