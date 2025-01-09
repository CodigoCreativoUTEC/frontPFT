"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Perfil() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState({
    id: 0,
    contrasenia: "",
    confirmarContrasenia: "",
    estado: "ACTIVO",
    nombre: "",
    apellido: "",
    usuariosTelefonos: [],
    email: "",
    nombreUsuario: "",
    cedula: 0,
    idInstitucion: 0,
    idPerfil: 0,
    fechaNacimiento: "", // Fecha de nacimiento en formato "YYYY-MM-DD"
  });
  const [telefonosEliminados, setTelefonosEliminados] = useState([]); // Para almacenar los teléfonos eliminados
  const [originalEmail, setOriginalEmail] = useState(""); // Para verificar si el email cambia
  const [passwordError, setPasswordError] = useState(null); // Para manejar errores en la contraseña
  const [passwordMatchError, setPasswordMatchError] = useState(null); // Para manejar errores de coincidencia de contraseña
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (status === "loading") return;
    if (status === "unauthenticated") window.location.href = "/auth/signin";

    const fetchUserData = async () => {
      if (session) {
        const userEmail = session.user.email;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/usuarios/obtenerUserEmail?email=${userEmail}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserData({
            id: data.id || 0,
            contrasenia: "", // No precargamos la contraseña
            confirmarContrasenia: "", // Para confirmar la nueva contraseña
            estado: data.estado || "ACTIVO",
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            usuariosTelefonos: data.usuariosTelefonos || [],
            email: data.email || "",
            nombreUsuario: data.nombreUsuario || "",
            cedula: data.cedula || 0, // Precargamos la cédula
            idInstitucion: data.idInstitucion.id || 0,
            idPerfil: data.idPerfil.id || 0,
            fechaNacimiento: data.fechaNacimiento || "", // Precargamos la fecha de nacimiento si está disponible
          });
          setOriginalEmail(data.email); // Guardar el email original
        }
      }
    };

    fetchUserData();
  }, [session, status, mounted]);

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleAddPhone = () => {
    setUserData({ ...userData, usuariosTelefonos: [...userData.usuariosTelefonos, { id: null, numero: "" }] });
  };

  const handleRemovePhone = (index) => {
    const updatedPhones = [...userData.usuariosTelefonos];
    const removedPhone = updatedPhones.splice(index, 1);

    // Si el teléfono tiene un `id`, lo añadimos a la lista de teléfonos a eliminar
    if (removedPhone[0].id) {
      setTelefonosEliminados([...telefonosEliminados, removedPhone[0].id]);
    }

    setUserData({ ...userData, usuariosTelefonos: updatedPhones });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar contraseña si fue modificada
    if (userData.contrasenia) {
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(userData.contrasenia)) {
        setPasswordError("La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.");
        return;
      }

      // Verificar que ambas contraseñas coincidan
      if (userData.contrasenia !== userData.confirmarContrasenia) {
        setPasswordMatchError("Las contraseñas no coinciden.");
        return;
      }
    }

    const confirmChanges = window.confirm("¿Desea guardar los cambios?");
    if (!confirmChanges) return;

    // Verificar si el email o la cédula ya están en uso
    const emailCheckResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios/obtenerUserEmail?email=${userData.email}`,
      { method: "GET", headers: { Authorization: `Bearer ${session.accessToken}` } }
    );

    if (!emailCheckResponse.ok && userData.email !== originalEmail) {
      alert("El email ya está en uso.");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/modificar-propio-usuario`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        idInstitucion: { id: userData.idInstitucion },
        idPerfil: { id: userData.idPerfil },
        usuariosTelefonos: userData.usuariosTelefonos.map(telefono => ({
          id: telefono.id, // Mantener el ID para evitar duplicados
          numero: telefono.numero,
        })),
        telefonosEliminados: telefonosEliminados, // Enviamos los IDs de los teléfonos a eliminar
      }),
    });

    if (response.ok) {
      alert("Datos guardados correctamente, deberá iniciar sesión nuevamente.");
      signOut();
    } else {
      alert("Error al guardar los datos.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="col-span-5 xl:col-span-3">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Información personal</h3>
          </div>
          <div className="p-7">
            <form onSubmit={handleSubmit}>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="nombre">
                    Nombre
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    id="nombre"
                    value={userData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                  />
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="apellido">
                    Apellido
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    id="apellido"
                    value={userData.apellido}
                    onChange={(e) => handleInputChange("apellido", e.target.value)}
                  />
                </div>
              </div>

              {userData.usuariosTelefonos.map((telefono, index) => (
                <div key={index} className="mb-5.5 flex gap-3">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor={`telefono-${index}`}>
                      Teléfono {index + 1}
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      id={`telefono-${index}`}
                      value={telefono.numero}
                      onChange={(e) => {
                        const newTelefonos = [...userData.usuariosTelefonos];
                        newTelefonos[index].numero = e.target.value;
                        handleInputChange("usuariosTelefonos", newTelefonos);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="self-end px-4 py-2 bg-red-600 text-white rounded"
                    onClick={() => handleRemovePhone(index)}
                  >
                    Quitar
                  </button>
                </div>
              ))}

              <button type="button" className="mb-5.5 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAddPhone}>
                Agregar Teléfono
              </button>

              <div className="mb-5.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="email"
                  id="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div className="mb-5.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="cedula">
                  Cédula
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="number"
                  id="cedula"
                  value={userData.cedula}
                  onChange={(e) => handleInputChange("cedula", parseInt(e.target.value))}
                />
              </div>

              <div className="mb-5.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="fechaNacimiento">
                  Fecha de Nacimiento
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="date"
                  id="fechaNacimiento"
                  value={userData.fechaNacimiento}
                  onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                />
              </div>

              <div className="mb-5.5"> <aside className="bg-danger text-neutral-200 pl-2">Dejar en blanco si no desea cambiar contraseña</aside>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="contrasenia">
                  Nueva Contraseña
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="password"
                  id="contrasenia"
                  placeholder="Dejar en blanco si no desea cambiar"
                  value={userData.contrasenia}
                  onChange={(e) => {
                    setPasswordError(null); // Limpiar errores al escribir
                    setPasswordMatchError(null); // Limpiar errores de coincidencia
                    handleInputChange("contrasenia", e.target.value);
                  }}
                />
                {passwordError && <p className="text-red-500">{passwordError}</p>}
              </div>

              <div className="mb-5.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="confirmarContrasenia">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="password"
                  id="confirmarContrasenia"
                  placeholder="Repite la contraseña"
                  value={userData.confirmarContrasenia}
                  onChange={(e) => handleInputChange("confirmarContrasenia", e.target.value)}
                />
                {passwordMatchError && <p className="text-red-500">{passwordMatchError}</p>}
              </div>

              <div className="flex justify-end gap-4.5">
                <button className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90" type="submit">
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
