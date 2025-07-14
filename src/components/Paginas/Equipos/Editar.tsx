"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "@/components/Helpers/Fetcher";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY as string;
const PLACEHOLDER_IMG = "https://via.placeholder.com/300x200?text=Sin+imagen";

const EditarEquipo: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

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
  const [estado, setEstado] = useState("");

  // Opciones de selects
  const [tipos, setTipos] = useState<any[]>([]);
  const [paises, setPaises] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showGarantiaWarning, setShowGarantiaWarning] = useState(false);

  // Cargar datos del equipo y opciones
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);

        // Cargar opciones en paralelo
        const [tiposData, marcasData, paisesData, proveedoresData, ubicacionesData, equipoData] = await Promise.all([
          fetcher<any[]>("/tipoEquipos/listar", { method: "GET" }),
          fetcher<any[]>("/marca/listar", { method: "GET" }),
          fetcher<any[]>("/paises/listar", { method: "GET" }),
          fetcher<any[]>("/proveedores/listar", { method: "GET" }),
          fetcher<any[]>("/ubicaciones/listar", { method: "GET" }),
          fetcher<any>(`/equipos/seleccionar?id=${id}`, { method: "GET" })
        ]);

        setTipos(tiposData.filter(t => t.estado === "ACTIVO"));
        setMarcas(marcasData.filter(m => m.estado === "ACTIVO"));
        setPaises(paisesData);
        setProveedores(proveedoresData.filter(p => p.estado === "ACTIVO"));
        setUbicaciones(ubicacionesData.filter(u => u.estado === "ACTIVO"));

        // Cargar datos del equipo
        if (equipoData) {
          setNombre(equipoData.nombre || "");
          setIdTipo(equipoData.idTipo?.id?.toString() || "");
          setIdMarca(equipoData.idModelo?.idMarca?.id?.toString() || "");
          setIdModelo(equipoData.idModelo?.id?.toString() || "");
          setNroSerie(equipoData.nroSerie || "");
          setGarantia(equipoData.garantia ? equipoData.garantia.split('T')[0] : "");
          setIdPais(equipoData.idPais?.id?.toString() || "");
          setIdProveedor(equipoData.idProveedor?.id?.toString() || "");
          setFechaAdquisicion(equipoData.fechaAdquisicion ? equipoData.fechaAdquisicion.split('T')[0] : "");
          setIdInterno(equipoData.idInterno || "");
          setIdUbicacion(equipoData.idUbicacion?.id?.toString() || "");
          setImagen(equipoData.imagen || "");
          setEstado(equipoData.estado || "");
          if (equipoData.imagen) {
            setImagenPreview(equipoData.imagen);
          }
        }

      } catch (err: any) {
        setError("Error al cargar datos: " + (err?.message || err));
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Fetch modelos cuando cambia la marca
  useEffect(() => {
    const fetchModelos = async () => {
      if (!idMarca) {
        setModelos([]);
        setIdModelo("");
        return;
      }
      try {
        // Buscar todos los modelos y filtrar por marca
        const modelosData = await fetcher<any[]>("/modelo/listar", { method: "GET" });
        const modelosFiltrados = modelosData.filter(m => m.estado === "ACTIVO" && m.idMarca.id === Number(idMarca));
        setModelos(modelosFiltrados);
        
        // Si el modelo actual no pertenece a la marca seleccionada, limpiarlo
        const modeloActual = modelosFiltrados.find(m => m.id === Number(idModelo));
        if (!modeloActual) {
          setIdModelo("");
        }
      } catch (err: any) {
        setError("Error al cargar modelos: " + err.message);
        console.error(err);
      }
    };
    fetchModelos();
  }, [idMarca, idModelo]);

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
        id: Number(id),
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
        estado
      };
      await fetcher("/equipos/modificar", {
        method: "PUT",
        body: equipo,
      });
      setMessage("Equipo modificado exitosamente");
    } catch (err: any) {
      setError("Error al modificar el equipo: " + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  if (loadingData) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-600">Cargando datos del equipo...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Editar equipo</h2>
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
              disabled={!idMarca}
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
            <label htmlFor="pais" className="block font-medium mb-1">País *</label>
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
            <label htmlFor="idInterno" className="block font-medium mb-1">ID Interno *</label>
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
              {ubicaciones.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="imagen" className="block font-medium mb-1">Imagen *</label>
          <div className="flex items-center gap-4">
            <input
              id="imagen"
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              className="flex-1 rounded border border-gray-300 p-2"
            />
            <button
              type="button"
              onClick={handleSubirImagen}
              disabled={!imagenFile || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Subiendo..." : "Subir"}
            </button>
          </div>
          {imagenPreview && (
            <div className="mt-2">
              <img src={imagenPreview} alt="Preview" className="w-32 h-24 object-cover rounded" />
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Actualizando..." : "Actualizar equipo"}
          </button>
        </div>
      </form>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">¿Desea actualizar este equipo?</h3>
            <p className="mb-6">Confirme que los datos modificados son correctos.</p>
            
            <div className="mb-4 text-sm bg-gray-50 p-3 rounded">
              <p><strong>Nombre:</strong> {nombre}</p>
              <p><strong>ID Interno:</strong> {idInterno}</p>
              <p><strong>Número de Serie:</strong> {nroSerie}</p>
              <p><strong>Garantía:</strong> {garantia}</p>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de advertencia de garantía */}
      {showGarantiaWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-yellow-600">Advertencia de Garantía</h3>
            <p className="mb-6">La fecha de garantía ingresada ya ha vencido. ¿Desea continuar de todas formas?</p>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowGarantiaWarning(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowGarantiaWarning(false);
                  setShowConfirm(true);
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarEquipo;
