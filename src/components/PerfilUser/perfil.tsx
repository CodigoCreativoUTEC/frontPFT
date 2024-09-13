"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Perfil() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState({
    id: 0,
    contrasenia: "",
    estado: "ACTIVO",
    nombre: "",
    apellido: "",
    usuariosTelefonos: [],
    email: "",
    nombreUsuario: "",
    cedula: 0,
    idInstitucion: 0,
    idPerfil: 0,
    fechaNacimiento: [null, null, null],
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // No hacer nada si no está montado
    if (status === "loading") return; // No hacer nada mientras está cargando
    if (status === "unauthenticated") window.location.href = "/login"; // Redirigir si no está autenticado

    const fetchUserData = async () => {
      if (session) {
        const userId = session.user.data.id;
        const response = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/BuscarUsuarioPorId/?id=${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUserData({
            id: data.id || 0,
            contrasenia: data.contrasenia || "",
            estado: data.estado || "ACTIVO",
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            usuariosTelefonos: data.usuariosTelefonos.map(telefono => telefono.numero) || [],
            email: data.email || "",
            nombreUsuario: data.nombreUsuario || "",
            cedula: data.cedula || 0,
            idInstitucion: data.idInstitucion.id || 0,
            idPerfil: data.idPerfil.id || 0,
            fechaNacimiento: data.fechaNacimiento || [],
          });
        }
      }
    };

    fetchUserData();
  }, [session, status, mounted]);

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/modificar`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        idInstitucion: { id: userData.idInstitucion },
        idPerfil: { id: userData.idPerfil },
        usuariosTelefonos: userData.usuariosTelefonos.map(numero => ({ numero })),
      }),
    });

    if (response.ok) {
      alert('Datos guardados correctamente');
    } else {
      alert('Error al guardar los datos');
    }
  };

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="col-span-5 xl:col-span-3">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Información personal
            </h3>
          </div>
          <div className="p-7">
            <form onSubmit={handleSubmit}>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="nombre">
                    Nombre
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="nombre"
                      id="nombre"
                      placeholder="Devid Jhon"
                      value={userData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="apellido">
                    Apellido
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="apellido"
                      id="apellido"
                      placeholder="Devid Jhon"
                      value={userData.apellido}
                      onChange={(e) => handleInputChange('apellido', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {userData.usuariosTelefonos.map((telefono, index) => (
                <div key={index} className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor={`telefono-${index}`}>
                    Teléfono {index + 1}
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name={`telefono-${index}`}
                    id={`telefono-${index}`}
                    placeholder="Número de teléfono"
                    value={telefono}
                    onChange={(e) => {
                      const newTelefonos = [...userData.usuariosTelefonos];
                      newTelefonos[index] = e.target.value;
                      handleInputChange('usuariosTelefonos', newTelefonos);
                    }}
                  />
                </div>
              ))}

              <div className="mb-5.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="devidjond45@gmail.com"
                  value={userData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="mb-5.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="cedula">
                  Cédula
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="number"
                  name="cedula"
                  id="cedula"
                  value={userData.cedula}
                  onChange={(e) => handleInputChange('cedula', parseInt(e.target.value))}
                />
              </div>

              <div className="mb-5.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="fechaNacimiento">
                  Fecha de Nacimiento
                </label>
                <input
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    name="fechaNacimiento"
                    id="fechaNacimiento"
                    value={`${userData.fechaNacimiento[0] || ''}-${(userData.fechaNacimiento[1] !== null ? userData.fechaNacimiento[1].toString().padStart(2, '0') : '')}-${(userData.fechaNacimiento[2] !== null ? userData.fechaNacimiento[2].toString().padStart(2, '0') : '')}`}
                    onChange={(e) => {
                        const [year, month, day] = e.target.value.split('-');
                        handleInputChange('fechaNacimiento', [parseInt(year), parseInt(month), parseInt(day)]);
                    }}
                />

              </div>

              <div className="flex justify-end gap-4.5">
                <button
                  className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                  type="submit">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
