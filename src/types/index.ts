import { ReferrerEnum, Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion } from "./emuns";

export interface UsuarioModel {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    fecha_nasc: Date;
    fechaNacimiento: Date;
    telefono: Object;
    usuariosTelefono: Object;
    nombre_usuario: string;
    nombreUsuario: string;
    email: string;
    password: string;
    tipo_usuario: ReferrerEnum;
    nombrePerfil: string;
    estado: ReferrerEnum; 
    institucion: ReferrerEnum;

}

export interface EquipoModel {
    id: number;
    nombre: string;
    tipo_equipo: Tipo;
    marca: Marca;
    modelo: Modelo;
    num_serie: number;
    garantia: number;
    pais: Pais;
    proveedor: Proveedor;
    fecha_adq: Date;
    id_interno: string;
    ubicacion: Ubicacion;
    imagen: string;
    estado: ReferrerEnum;

}

export interface BajaEquipoModel {
    id: number;
    nombre: string;
    fecha_baja: Date;
    usuario: string;
    razon: string;
    comentarios: string;
    estado: ReferrerEnum.INACTIVO;
}

export { ReferrerEnum, Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion };

