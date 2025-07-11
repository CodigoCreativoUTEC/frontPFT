"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import fetcher from "@/components/Helpers/Fetcher";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Perfil } from "@/types/Usuario";
import { validateAndFormatCI, random_ci } from "./CedulaHelper";

const getDefaultBirthDate = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  return today.toISOString().split("T")[0];
};

interface PhoneNumber {
  numero: string;
}

const RegisterForm: React.FC = () => {
  const [cedula, setCedula] = useState("");
  const [cedulaFormatted, setCedulaFormatted] = useState("");
  const [cedulaError, setCedulaError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [reContrasenia, setReContrasenia] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(getDefaultBirthDate());
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState<Perfil | null>(null);
  const [phones, setPhones] = useState<PhoneNumber[]>([{ numero: "" }]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTestingCedulas, setShowTestingCedulas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generar cédulas aleatorias válidas para testing
  const generateTestingCedulas = () => {
    const cedulas = [];
    for (let i = 0; i < 5; i++) {
      const randomCi = random_ci();
      cedulas.push({
        numero: randomCi,
        formateada: validateAndFormatCI(randomCi).formatted
      });
    }
    return cedulas;
  };

  const [cedulasEjemplo, setCedulasEjemplo] = useState<Array<{numero: string, formateada: string}>>([]);

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        const data = await fetcher<Perfil[]>("/perfiles/listar", { method: "GET", requiresAuth: false });
        setPerfiles(data);
      } catch (err: any) {
        setError("Error al cargar perfiles");
      }
    };
    fetchPerfiles();
  }, []);

  useEffect(() => {
    if (nombre && apellido) {
      setNombreUsuario(
        `${nombre.trim().toLowerCase().replace(/\s+/g, "")}.${apellido.trim().toLowerCase().replace(/\s+/g, "")}`
      );
    } else {
      setNombreUsuario("");
    }
  }, [nombre, apellido]);

  useEffect(() => {
    flatpickr("#fecha-nacimiento", {
      maxDate: getDefaultBirthDate(),
      defaultDate: getDefaultBirthDate(),
      dateFormat: "Y-m-d",
      onChange: (selectedDates) => {
        if (selectedDates[0]) setFechaNacimiento(selectedDates[0].toISOString().split("T")[0]);
      },
    });
  }, []);

  const handleCedulaChange = (value: string) => {
    setCedula(value);
    const validation = validateAndFormatCI(value);
    setCedulaFormatted(validation.formatted);
    setCedulaError(validation.error || null);
  };

  const generateRandomCedula = () => {
    const randomCi = random_ci();
    handleCedulaChange(randomCi);
  };

  const openTestingModal = () => {
    // Generar nuevas cédulas aleatorias cada vez que se abre el modal
    setCedulasEjemplo(generateTestingCedulas());
    setShowTestingCedulas(true);
  };

  const addPhone = () => {
    setPhones([...phones, { numero: "" }]);
  };

  const removePhone = (index: number) => {
    if (phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index));
    }
  };

  const updatePhone = (index: number, numero: string) => {
    const updatedPhones = [...phones];
    updatedPhones[index].numero = numero;
    setPhones(updatedPhones);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    setMessage(null);
    setError(null);
    
    if (cedulaError) {
      setError("Por favor corrija los errores en la cédula");
      setLoading(false);
      return;
    }
    
    if (contrasenia !== reContrasenia) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    if (!perfilSeleccionado) {
      setError("Debe seleccionar un perfil");
      setLoading(false);
      return;
    }
    // Filter out empty phone numbers
    const validPhones = phones.filter(phone => phone.numero.trim() !== "");
    if (validPhones.length === 0) {
      setError("Debe ingresar al menos un número de teléfono");
      setLoading(false);
      return;
    }
    try {
      await fetcher("/usuarios/crear", {
        method: "POST",
        requiresAuth: false,
        body: {
          cedula: cedula.replace(/\D/g, ''), // Enviar solo números
          email,
          contrasenia,
          fechaNacimiento,
          nombre,
          apellido,
          nombreUsuario,
          idPerfil: perfilSeleccionado,
          usuariosTelefonos: validPhones,
        },
      });
      setMessage("Usuario registrado exitosamente");
      setCedula("");
      setCedulaFormatted("");
      setCedulaError(null);
      setEmail("");
      setContrasenia("");
      setReContrasenia("");
      setNombre("");
      setApellido("");
      setNombreUsuario("");
      setFechaNacimiento(getDefaultBirthDate());
      setPerfilSeleccionado(null);
      setPhones([{ numero: "" }]);
    } catch (err: any) {
      setError(err.message || "Error al registrar usuario");
    }
    setLoading(false);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
        <div className="w-full border-stroke dark:border-strokedark">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium">Start for free</span>
            <h2 
              className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 cursor-pointer select-none hover:opacity-80 transition-opacity" 
              onDoubleClick={openTestingModal}
              title="Doble clic para abrir cédulas de testing"
            >
              MA-MED
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Cédula</label>
                <input 
                  type="text" 
                  value={cedulaFormatted} 
                  onChange={e => handleCedulaChange(e.target.value)} 
                  placeholder="Ingrese su cédula" 
                  className={`w-full rounded-lg border py-4 pl-6 pr-10 text-black outline-none focus-visible:shadow-none dark:text-white dark:focus:border-primary ${
                    cedulaError 
                      ? 'border-red-500 bg-transparent focus:border-red-500 dark:border-red-500 dark:bg-form-input' 
                      : 'border-stroke bg-transparent focus:border-primary dark:border-form-strokedark dark:bg-form-input'
                  }`} 
                  required 
                />
                {cedulaError && (
                  <p className="mt-1 text-sm text-red-500">{cedulaError}</p>
                )}
                {!cedulaError && cedulaFormatted && (
                  <p className="mt-1 text-sm text-green-600">✓ Cédula válida</p>
                )}
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Nombre</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ingrese su nombre" className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" required />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Apellido</label>
                <input type="text" value={apellido} onChange={e => setApellido(e.target.value)} placeholder="Ingrese su apellido" className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" required />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Nombre de usuario</label>
                <input type="text" value={nombreUsuario} disabled className="w-full rounded-lg border border-stroke bg-gray-100 py-4 pl-6 pr-10 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white" />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ingrese su email" className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" required />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Contraseña</label>
                <input type="password" value={contrasenia} onChange={e => setContrasenia(e.target.value)} placeholder="Ingrese su contraseña" className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" required />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Repetir contraseña</label>
                <input type="password" value={reContrasenia} onChange={e => setReContrasenia(e.target.value)} placeholder="Repita su contraseña" className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" required />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Fecha de nacimiento</label>
                <input id="fecha-nacimiento" type="text" value={fechaNacimiento} readOnly className="form-datepicker w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" required />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Números de teléfono</label>
                {phones.map((phone, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="tel"
                      value={phone.numero}
                      onChange={(e) => updatePhone(index, e.target.value)}
                      placeholder="Ingrese número de teléfono"
                      className="flex-1 rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required={index === 0}
                    />
                    {phones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePhone(index)}
                        className="px-3 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPhone}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Agregar teléfono
                </button>
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Perfil</label>
                <select value={perfilSeleccionado?.id || ""} onChange={e => {
                  const perfil = perfiles.find(p => p.id === Number(e.target.value));
                  setPerfilSeleccionado(perfil || null);
                }} className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" required>
                  <option value="">Seleccione un perfil</option>
                  {perfiles.map(perfil => (
                    <option key={perfil.id} value={perfil.id}>{perfil.nombrePerfil} ({perfil.estado})</option>
                  ))}
                </select>
              </div>
              {error && <div className="mb-4 text-red-500">{error}</div>}
              {message && <div className="mb-4 text-green-600">{message}</div>}
              <div className="mb-5">
                <input type="submit" value={loading ? "Registrando..." : "Crear cuenta"} disabled={loading} className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-60" />
              </div>
              <div className="mt-6 text-center">
                <p>
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/auth/signin" className="text-primary">Inicia sesión</Link>
                </p>
              </div>
            </form>
            
            {/* Modal de confirmación */}
            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-lg max-w-md w-full">
                  <h3 className="text-lg font-bold mb-4">¿Desea registrarse?</h3>
                  <div className="mb-6 space-y-2">
                    <p><strong>Nombre:</strong> {nombre} {apellido}</p>
                    <p><strong>Cédula:</strong> {cedulaFormatted}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Usuario:</strong> {nombreUsuario}</p>
                    <p><strong>Fecha de nacimiento:</strong> {fechaNacimiento}</p>
                    <p><strong>Perfil:</strong> {perfilSeleccionado?.nombrePerfil}</p>
                    <div>
                      <strong>Teléfonos:</strong>
                      <ul className="ml-4">
                        {phones.filter(phone => phone.numero.trim() !== "").map((phone, index) => (
                          <li key={index}>• {phone.numero}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-meta-4 dark:hover:bg-meta-3">Cancelar</button>
                    <button onClick={handleConfirm} className="px-4 py-2 rounded bg-primary text-white hover:bg-opacity-90">Confirmar</button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de cédulas de testing */}
            {showTestingCedulas && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-lg max-w-md w-full">
                  <h3 className="text-lg font-bold mb-4">🧪 Cédulas aleatorias válidas para Testing</h3>
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Estas cédulas se generan aleatoriamente usando el algoritmo uruguayo y son válidas para testing:
                    </p>
                    <div className="space-y-2">
                      {cedulasEjemplo.map((cedula, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-meta-4 rounded">
                          <div>
                            <span className="font-mono text-sm">{cedula.numero}</span>
                            <span className="text-gray-500 ml-2">→</span>
                            <span className="font-mono text-sm ml-2">{cedula.formateada}</span>
                          </div>
                          <button
                            onClick={() => {
                              handleCedulaChange(cedula.numero);
                              setShowTestingCedulas(false);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                          >
                            Usar
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>💡 Tip:</strong> Cada vez que abras este modal se generarán nuevas cédulas aleatorias.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setCedulasEjemplo(generateTestingCedulas());
                      }}
                      className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                    >
                      🔄 Generar nuevas
                    </button>
                    <button 
                      onClick={() => setShowTestingCedulas(false)} 
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-meta-4 dark:hover:bg-meta-3"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;