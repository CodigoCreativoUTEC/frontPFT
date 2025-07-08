"use client";
import React, { useEffect, useState } from "react";
import fetcher from "@/components/Helpers/Fetcher";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY as string;
const PLACEHOLDER_IMG = "https://via.placeholder.com/300x200?text=Sin+imagen";

const CrearEquipo: React.FC = () => {
  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [idTipo, setIdTipo] = useState("");
  const [marcas, setMarcas] = useState<any[]>([]);
  const [idMarca, setIdMarca] = useState("");
  const [modelos, setModelos] = useState<any[]>([]);
  const [idModelo, setIdModelo] = useState("");
  const [nroSerie, setNroSerie] = useState("");
  const [garantia, setGarantia] = useState("");
  const [idPais, setIdPais] = useState("");
  const [idProveedor, setIdProveedor] = useState("");
  const [fechaAdquisicion, setFechaAdquisicion] = useState("");
  const [idInterno, setIdInterno] = useState("");
  const [idUbicacion, setIdUbicacion] = useState("");
  const [imagen, setImagen] = useState("");
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);

  // Opciones de selects
  const [tipos, setTipos] = useState<any[]>([]);
  const [paises, setPaises] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showGarantiaWarning, setShowGarantiaWarning] = useState(false);

  // Fetch de opciones al montar
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const tiposData = await fetcher<any[]>("/tipoEquipos/listar", { method: "GET" });
        setTipos(tiposData.filter(t => t.estado === "ACTIVO"));
        const marcasData = await fetcher<any[]>("/marca/listar", { method: "GET" });
        setMarcas(marcasData.filter(m => m.estado === "ACTIVO"));
        const paisesData = await fetcher<any[]>("/paises/listar", { method: "GET" });
        setPaises(paisesData);
        const proveedoresData = await fetcher<any[]>("/proveedores/listar", { method: "GET" });
        setProveedores(proveedoresData.filter(p => p.estado === "ACTIVO"));
        const ubicacionesData = await fetcher<any[]>("/ubicaciones/listar", { method: "GET" });
        setUbicaciones(ubicacionesData.filter(u => u.estado === "ACTIVO"));
      } catch (err: any) {
        setError("Error: " + (err?.message || err));
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch modelos cuando cambia la marca
  useEffect(() => {
    const fetchModelos = async () => {
      setIdModelo("");
      if (!idMarca) {
        setModelos([]);
        return;
      }
      try {
        // Buscar todos los modelos y filtrar por marca
        const modelosData = await fetcher<any[]>("/modelo/listar", { method: "GET" });
        setModelos(modelosData.filter(m => m.estado === "ACTIVO" && m.idMarca.id === Number(idMarca)));
      } catch (err: any) {
        setError("Error al cargar modelos: " + err.message);
        console.error(err);
      }
    };
    fetchModelos();
  }, [idMarca]);

  // Imagen: preview y subida a imgbb
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const handleSubirImagen = async () => {
    if (!imagenFile) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", imagenFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImagen(data.data.url);
        setMessage("Imagen subida correctamente");
      } else {
        setImagen(PLACEHOLDER_IMG);
        setMessage("No se pudo subir la imagen, se usará una imagen por defecto.");
      }
    } catch (err: any) {
      setImagen(PLACEHOLDER_IMG);
      setMessage("No se pudo subir la imagen, se usará una imagen por defecto.");
      console.error(err);
    }
    setLoading(false);
  };

  // Validación de garantía
  const checkGarantiaVencida = () => {
    if (!garantia) return false;
    const hoy = new Date();
    const garantiaDate = new Date(garantia);
    return garantiaDate < hoy;
  };

  // Validación de campos obligatorios
  const isFormValid = () => {
    return (
      nombre && idTipo && idMarca && idModelo && nroSerie && garantia && idPais && idProveedor && fechaAdquisicion && idInterno && idUbicacion && imagen
    );
  };

  // Envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!isFormValid()) {
      setError("Por favor complete todos los campos obligatorios.");
      return;
    }
    if (checkGarantiaVencida()) {
      setShowGarantiaWarning(true);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const equipo = {
        nombre,
        idTipo: { id: Number(idTipo) },
        idModelo: { id: Number(idModelo), idMarca: { id: Number(idMarca) } },
        nroSerie,
        garantia,
        idPais: { id: Number(idPais) },
        idProveedor: { id: Number(idProveedor) },
        fechaAdquisicion,
        idInterno,
        idUbicacion: { id: Number(idUbicacion) },
        imagen,
        estado: "ACTIVO"
      };
      await fetcher("/equipos/crear", {
        method: "POST",
        body: equipo,
      });
      setMessage("Equipo creado exitosamente");
      // Limpiar formulario
      setNombre(""); setIdTipo(""); setIdMarca(""); setIdModelo(""); setNroSerie(""); setGarantia(""); setIdPais(""); setIdProveedor(""); setFechaAdquisicion(""); setIdInterno(""); setIdUbicacion(""); setImagen(""); setImagenPreview(null); setImagenFile(null);
    } catch (err: any) {
      setError("Error al crear el equipo: " + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Registrar nuevo equipo</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="block font-medium mb-1">Nombre *</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="tipo" className="block font-medium mb-1">Tipo de equipo *</label>
            <select
              id="tipo"
              value={idTipo}
              onChange={e => setIdTipo(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            >
              <option value="">Seleccione</option>
              {tipos.map(t => <option key={t.id} value={t.id}>{t.nombreTipo}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="marca" className="block font-medium mb-1">Marca *</label>
            <select
              id="marca"
              value={idMarca}
              onChange={e => setIdMarca(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            >
              <option value="">Seleccione</option>
              {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="modelo" className="block font-medium mb-1">Modelo *</label>
            <select
              id="modelo"
              value={idModelo}
              onChange={e => setIdModelo(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            >
              <option value="">Seleccione</option>
              {modelos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="nroSerie" className="block font-medium mb-1">Número de serie *</label>
            <input
              id="nroSerie"
              type="text"
              value={nroSerie}
              onChange={e => setNroSerie(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="garantia" className="block font-medium mb-1">Garantía (fecha) *</label>
            <input
              id="garantia"
              type="date"
              value={garantia}
              onChange={e => setGarantia(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="pais" className="block font-medium mb-1">País de origen *</label>
            <select
              id="pais"
              value={idPais}
              onChange={e => setIdPais(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            >
              <option value="">Seleccione</option>
              {paises.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="proveedor" className="block font-medium mb-1">Proveedor *</label>
            <select
              id="proveedor"
              value={idProveedor}
              onChange={e => setIdProveedor(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            >
              <option value="">Seleccione</option>
              {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="fechaAdquisicion" className="block font-medium mb-1">Fecha de adquisición *</label>
            <input
              id="fechaAdquisicion"
              type="date"
              value={fechaAdquisicion}
              onChange={e => setFechaAdquisicion(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="idInterno" className="block font-medium mb-1">Identificación interna *</label>
            <input
              id="idInterno"
              type="text"
              value={idInterno}
              onChange={e => setIdInterno(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="ubicacion" className="block font-medium mb-1">Ubicación *</label>
            <select
              id="ubicacion"
              value={idUbicacion}
              onChange={e => setIdUbicacion(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              required
            >
              <option value="">Seleccione</option>
              {ubicaciones.map(u => <option key={u.id} value={u.id}>{u.nombre} ({u.sector}, Piso {u.piso})</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="imagen" className="block font-medium mb-1">Imagen del equipo *</label>
            <input
              id="imagen"
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              className="mb-2"
            />
            <button type="button" onClick={handleSubirImagen} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2" disabled={!imagenFile || loading}>
              {loading ? "Subiendo..." : "Subir imagen"}
            </button>
            {imagenPreview && (
              <div className="mb-2"><img src={imagenPreview} alt="Preview" className="h-32 rounded border" /></div>
            )}
            <input type="text" value={imagen} readOnly className="w-full rounded border border-gray-300 p-2 bg-gray-100" placeholder="URL de la imagen" />
          </div>
        </div>
        {error && <div className="mt-4 text-red-500">{error}</div>}
        {message && <div className="mt-4 text-green-600">{message}</div>}
        <div className="mt-6 flex justify-end gap-4">
          <input type="submit" value={loading ? "Creando..." : "Crear equipo"} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer disabled:opacity-60" />
        </div>
      </form>
      {/* Modal de advertencia de garantía vencida */}
      {showGarantiaWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-yellow-600">Advertencia de garantía</h3>
            <p className="mb-6">La fecha de garantía ingresada ya está vencida. ¿Desea continuar?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowGarantiaWarning(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-meta-4 dark:hover:bg-meta-3">Cancelar</button>
              <button onClick={() => { setShowGarantiaWarning(false); setShowConfirm(true); }} className="px-4 py-2 rounded bg-primary text-white hover:bg-opacity-90">Continuar</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">¿Desea crear este equipo?</h3>
            <p className="mb-6">Confirme que los datos ingresados son correctos para registrar el equipo.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-meta-4 dark:hover:bg-meta-3">Cancelar</button>
              <button onClick={handleConfirm} className="px-4 py-2 rounded bg-primary text-white hover:bg-opacity-90">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearEquipo;
