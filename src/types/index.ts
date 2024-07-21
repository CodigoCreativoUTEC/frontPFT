import { ReferrerEnum, Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion } from "./emuns";

export interface UsuarioModel {
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
}

export interface EquipoModel {
    id: number | null;
    nombre: string;
    idTipo: Tipo;
    marca: Marca;
    idModelo: Modelo;
    nroSerie: number;
    garantia: number;
    idPais: Pais;
    idProveedor: Proveedor;
    fechaAdquisicion: Date;
    idInterno: string;
    idUbicacion: Ubicacion;
    imagen: string;
    estado: ReferrerEnum;
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

