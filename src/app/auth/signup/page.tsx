"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Metadata } from "next";
import fetcher from "@/components/Helpers/Fetcher";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Perfil } from "@/types/Usuario";



const getDefaultBirthDate = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  return today.toISOString().split("T")[0];
};

const SignUp: React.FC = () => {
  // Estados de formulario
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [reContrasenia, setReContrasenia] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(getDefaultBirthDate());
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState<Perfil | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch perfiles al montar
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

  // Autogenerar nombreUsuario
  useEffect(() => {
    if (nombre && apellido) {
      setNombreUsuario(
        `${nombre.trim().toLowerCase().replace(/\s+/g, "")}.${apellido.trim().toLowerCase().replace(/\s+/g, "")}`
      );
    } else {
      setNombreUsuario("");
    }
  }, [nombre, apellido]);

  // Inicializar flatpickr para fechaNacimiento
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    setMessage(null);
    setError(null);
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
    try {
      await fetcher("/usuarios/crear", {
        method: "POST",
        requiresAuth: false,
        body: {
          cedula,
          email,
          contrasenia,
          fechaNacimiento,
          nombre,
          apellido,
          nombreUsuario,
          idPerfil: perfilSeleccionado,
        },
      });
      setMessage("Usuario registrado exitosamente");
      // Limpiar formulario
      setCedula("");
      setEmail("");
      setContrasenia("");
      setReContrasenia("");
      setNombre("");
      setApellido("");
      setNombreUsuario("");
      setFechaNacimiento(getDefaultBirthDate());
      setPerfilSeleccionado(null);
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
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">MA-MED</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Cédula</label>
                <input type="text" value={cedula} onChange={e => setCedula(e.target.value)} placeholder="Ingrese su cédula" className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" required />
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
                <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-lg max-w-sm w-full">
                  <h3 className="text-lg font-bold mb-4">¿Desea registrarse?</h3>
                  <p className="mb-6">Confirme que los datos ingresados son correctos para crear su cuenta.</p>
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-meta-4 dark:hover:bg-meta-3">Cancelar</button>
                    <button onClick={handleConfirm} className="px-4 py-2 rounded bg-primary text-white hover:bg-opacity-90">Confirmar</button>
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

export default SignUp;
