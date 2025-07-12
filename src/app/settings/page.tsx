"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import fetcher from "@/components/Helpers/Fetcher";
import { useSession } from "next-auth/react";

interface UsuariosTelefonos {
  id: number;
  numero: string;
}

interface IdInstitucion {
  id: number;
  nombre: string;
}

interface IdPerfil {
  id: number;
  nombrePerfil: string;
  estado: string;
}

interface Usuario {
  usuariosTelefonos: UsuariosTelefonos[];
  id: number;
  cedula: string;
  email: string;
  contrasenia: string | null;
  fechaNacimiento: string;
  estado: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  telefono?: string;
  idInstitucion: IdInstitucion;
  idPerfil: IdPerfil;
}

const Settings = () => {
  const { data: session } = useSession();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    cedula: "",
    email: "",
    contrasenia: "",
    confirmarContrasenia: "",
    fechaNacimiento: "",
    nombre: "",
    apellido: "",
    nombreUsuario: "",
  } as {
    cedula: string;
    email: string;
    contrasenia: string;
    confirmarContrasenia?: string;
    fechaNacimiento: string;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
  });

  // Estados para teléfonos
  const [telefonos, setTelefonos] = useState<(UsuariosTelefonos | Omit<UsuariosTelefonos, 'id'>)[]>([]);
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [editandoTelefono, setEditandoTelefono] = useState<number | null>(null);
  const [telefonoEditando, setTelefonoEditando] = useState("");

  // Estados de validación
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any>(null);

  // Cargar datos del usuario
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        if (!session?.user?.id) {
          setError("No se pudo obtener el ID del usuario");
          setLoading(false);
          return;
        }

        const data = await fetcher<Usuario>(`/usuarios/seleccionar?id=${session.user.id}`, { method: "GET" });
        setUsuario(data);
        setFormData({
          cedula: data.cedula || "",
          email: data.email || "",
          contrasenia: "",
          confirmarContrasenia: "",
          fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento.split('T')[0] : "",
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          nombreUsuario: data.nombreUsuario || "",
        });
        setTelefonos(data.usuariosTelefonos || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      cargarUsuario();
    }
  }, [session]);

  // Validar contraseña
  const validarContrasenia = (password: string): boolean => {
    if (password === "") return true; // Contraseña vacía es válida (no se cambia)
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    if (!/[a-zA-Z]/.test(password)) {
      setPasswordError("La contraseña debe contener al menos una letra");
      return false;
    }
    if (!/\d/.test(password)) {
      setPasswordError("La contraseña debe contener al menos un número");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  // Validar confirmación de contraseña
  const validarConfirmacionContrasenia = (password: string, confirmPassword: string): boolean => {
    if (password === "") return true; // Si no hay contraseña nueva, no validar confirmación
    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  // Validar email
  const validarEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Formato de email inválido");
      return false;
    }
    setEmailError(null);
    return true;
  };

  // Funciones para manejar teléfonos
  const agregarTelefono = () => {
    if (!nuevoTelefono.trim()) return;
    
    const nuevoTelefonoObj: Omit<UsuariosTelefonos, 'id'> = {
      numero: nuevoTelefono.trim()
    };
    
    setTelefonos(prev => [...prev, nuevoTelefonoObj]);
    setNuevoTelefono("");
  };

  const eliminarTelefono = (index: number) => {
    setTelefonos(prev => prev.filter((_, i) => i !== index));
  };

  const iniciarEdicionTelefono = (index: number, numero: string) => {
    setEditandoTelefono(index);
    setTelefonoEditando(numero);
  };

  const guardarEdicionTelefono = (index: number) => {
    if (!telefonoEditando.trim()) return;
    
    setTelefonos(prev => prev.map((tel, i) => 
      i === index ? { ...tel, numero: telefonoEditando.trim() } : tel
    ));
    setEditandoTelefono(null);
    setTelefonoEditando("");
  };

  const cancelarEdicionTelefono = () => {
    setEditandoTelefono(null);
    setTelefonoEditando("");
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar campos en tiempo real
    if (name === "contrasenia") {
      validarContrasenia(value);
      if (formData.confirmarContrasenia) {
        validarConfirmacionContrasenia(value, formData.confirmarContrasenia);
      }
    } else if (name === "confirmarContrasenia") {
      validarConfirmacionContrasenia(formData.contrasenia, value);
    } else if (name === "email") {
      validarEmail(value);
    }
  };

  // Validar formulario completo
  const validarFormulario = (): boolean => {
    // Validar contraseña
    if (!validarContrasenia(formData.contrasenia)) {
      return false;
    }

    // Validar confirmación de contraseña
    if (!validarConfirmacionContrasenia(formData.contrasenia, formData.confirmarContrasenia || "")) {
      return false;
    }

    // Validar email
    if (!validarEmail(formData.email)) {
      return false;
    }

    return true;
  };

  // Mostrar modal de confirmación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario completo
    if (!validarFormulario()) {
      return;
    }

    // Preparar datos a enviar
    const datosAEnviar = {
      ...formData,
      // Solo enviar contraseña si no está vacía
      ...(formData.contrasenia && { contrasenia: formData.contrasenia }),
      // Incluir teléfonos
      usuariosTelefonos: telefonos
    };

    // Remover campos que no se envían
    const { confirmarContrasenia, ...datosSinConfirmar } = datosAEnviar;

    // Mostrar modal de confirmación
    setPendingChanges(datosSinConfirmar);
    setShowConfirmModal(true);
  };

  // Confirmar y guardar cambios
  const confirmarCambios = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    setShowConfirmModal(false);

    try {
      await fetcher("/usuarios/modificar-propio-usuario", {
        method: "PUT",
        body: pendingChanges
      });

      setSuccess("Datos actualizados correctamente");
      
      // Recargar datos del usuario
      if (session?.user?.id) {
        const data = await fetcher<Usuario>(`/usuarios/seleccionar?id=${session.user.id}`, { method: "GET" });
        setUsuario(data);
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
      setPendingChanges(null);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Mi perfil" />
          <div className="flex justify-center items-center h-64">
            <p>Cargando datos del usuario...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Mi perfil" />

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Información Personal
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="nombre"
                      >
                        Nombre
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="nombre"
                          id="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="apellido"
                      >
                        Apellido
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="apellido"
                        id="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="cedula"
                      >
                        Cédula
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="cedula"
                        id="cedula"
                        value={formData.cedula}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fechaNacimiento"
                      >
                        Fecha de Nacimiento
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        name="fechaNacimiento"
                        id="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="nuevoTelefono">
                      Teléfonos de Contacto
                    </label>
                    
                    {/* Lista de teléfonos existentes */}
                    <div className="mb-4 space-y-2">
                      {telefonos.map((telefono, index) => (
                        <div key={`telefono-${index}-${telefono.numero}`} className="flex items-center gap-2 p-3 border border-stroke rounded dark:border-strokedark">
                          {editandoTelefono === index ? (
                            <>
                              <input
                                type="tel"
                                value={telefonoEditando}
                                onChange={(e) => setTelefonoEditando(e.target.value)}
                                className="flex-1 rounded border border-stroke px-3 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                placeholder="Número de teléfono"
                              />
                              <button
                                type="button"
                                onClick={() => guardarEdicionTelefono(index)}
                                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                onClick={cancelarEdicionTelefono}
                                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="flex-1 text-black dark:text-white">{telefono.numero}</span>
                              <button
                                type="button"
                                onClick={() => iniciarEdicionTelefono(index, telefono.numero)}
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => eliminarTelefono(index)}
                                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Agregar nuevo teléfono */}
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        id="nuevoTelefono"
                        value={nuevoTelefono}
                        onChange={(e) => setNuevoTelefono(e.target.value)}
                        className="flex-1 rounded border border-stroke px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        placeholder="Nuevo número de teléfono"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            agregarTelefono();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={agregarTelefono}
                        className="px-6 py-3 bg-primary text-white rounded hover:bg-opacity-90"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        className={`w-full rounded border py-3 pl-11.5 pr-4.5 text-black focus-visible:outline-none dark:text-white ${
                          emailError 
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20" 
                            : "border-stroke bg-gray focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                        }`}
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {emailError && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="nombreUsuario"
                    >
                      Nombre de Usuario
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary opacity-50"
                      type="text"
                      name="nombreUsuario"
                      id="nombreUsuario"
                      value={formData.nombreUsuario}
                      readOnly
                      disabled
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      El nombre de usuario no se puede modificar
                    </p>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="contrasenia"
                    >
                      Contraseña (dejar en blanco para mantener la actual)
                    </label>
                    <input
                      className={`w-full rounded border px-4.5 py-3 text-black focus-visible:outline-none dark:text-white ${
                        passwordError 
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20" 
                          : "border-stroke bg-gray focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                      }`}
                      type="password"
                      name="contrasenia"
                      id="contrasenia"
                      value={formData.contrasenia}
                      onChange={handleInputChange}
                      placeholder="Nueva contraseña (mínimo 8 caracteres, letras y números)"
                    />
                    {passwordError && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="confirmarContrasenia"
                    >
                      Confirmar Contraseña
                    </label>
                    <input
                      className={`w-full rounded border px-4.5 py-3 text-black focus-visible:outline-none dark:text-white ${
                        confirmPasswordError 
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20" 
                          : "border-stroke bg-gray focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                      }`}
                      type="password"
                      name="confirmarContrasenia"
                      id="confirmarContrasenia"
                      value={formData.confirmarContrasenia}
                      onChange={handleInputChange}
                      placeholder="Confirmar nueva contraseña"
                    />
                    {confirmPasswordError && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {confirmPasswordError}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                      onClick={() => {
                        setFormData({
                          cedula: usuario?.cedula || "",
                          email: usuario?.email || "",
                          contrasenia: "",
                          confirmarContrasenia: "",
                          fechaNacimiento: usuario?.fechaNacimiento ? usuario.fechaNacimiento.split('T')[0] : "",
                          nombre: usuario?.nombre || "",
                          apellido: usuario?.apellido || "",
                          nombreUsuario: usuario?.nombreUsuario || "",
                        });
                        setTelefonos(usuario?.usuariosTelefonos || []);
                        setNuevoTelefono("");
                        setEditandoTelefono(null);
                        setTelefonoEditando("");
                        setPasswordError(null);
                        setConfirmPasswordError(null);
                        setEmailError(null);
                        setError(null);
                        setSuccess(null);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Tu Foto
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full">
                      <Image
                        src={"/images/user/user-03.png"}
                        width={55}
                        height={55}
                        alt="User"
                      />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Editar tu foto
                      </span>
                      <span className="flex gap-2.5">
                        <button className="text-sm hover:text-primary">
                          Eliminar
                        </button>
                        <button className="text-sm hover:text-primary">
                          Actualizar
                        </button>
                      </span>
                    </div>
                  </div>

                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-primary">Click para subir</span> o
                        arrastra y suelta
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG o GIF</p>
                      <p>(máx, 800 X 800px)</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancelar
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-black dark:text-white">
              Confirmar Cambios
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              ¿Está seguro que desea guardar los siguientes cambios?
            </p>
            
            <div className="mb-6 max-h-48 overflow-y-auto">
              <div className="space-y-2 text-sm">
                {Object.entries(pendingChanges || {}).map(([key, value]) => {
                  if (key === 'contrasenia') return null; // No mostrar contraseña
                  if (key === 'confirmarContrasenia') return null; // No mostrar confirmación
                  if (key === 'usuariosTelefonos') {
                    return (
                      <div key={key} className="space-y-1">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <div className="ml-4 space-y-1">
                          {Array.isArray(value) && value.length > 0 ? (
                            value.map((tel: any, index: number) => (
                              <div key={`modal-telefono-${index}-${tel.numero}`} className="text-gray-600 dark:text-gray-400">
                                • {tel.numero}
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-gray-500 italic">Sin teléfonos</span>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="text-gray-600 dark:text-gray-400">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </button>
              <button
                className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                onClick={confirmarCambios}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default Settings;
