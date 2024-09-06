import { ReferrerEnum, Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion } from "./enums";
type nombrePerfil = any;
export interface UsuarioModel {
    id: number | null;
    nombre: string;
    apellido: string;
    cedula: string;
    fechaNacimiento: Date;
    usuariosTelefono: Object;
    nombreUsuario: string;
    email: string;
    password: string;
    nombrePerfil: ReferrerEnum; // Sirve para mostrar el nombre del perfil
    estado: ReferrerEnum; 
    institucion: ReferrerEnum;
    idPerfil: number | nombrePerfil;
}

export interface EquipoModel {
    id: number | null;
    nombre: string;
    idTipo: Tipo;
    marca: any | null;
    idModelo: Modelo;
    nroSerie: number | string;
    garantia: number | string;
    idPais: Pais;
    idProveedor: Proveedor;
    fechaAdquisicion: Date | any;
    idInterno: string;
    idUbicacion: Ubicacion;
    imagen: string;
    estado: ReferrerEnum;
    equiposUbicaciones: any;
}

export interface BajaEquipoModel {
    id: number;
    idEquipo: any;
    nombre: string;
    fecha: Date;
    idUsuario: { email: any };
    razon: string;
    comentarios: string;
    estado: ReferrerEnum.INACTIVO;
}

export { ReferrerEnum, Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion };

