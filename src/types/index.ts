import { ReferrerEnum } from "./emuns";

export interface UsuarioModel {
    id: number;
    nombre: string;
    apellido: string;
   cedula: string;
   fecha_nasc: Date;
    telefono: Object;
    nombre_usuario: string;
    email: string;
   password: string;
    tipo_usuario: ReferrerEnum;
    estado: ReferrerEnum; 

}

export interface EquipoModel {
    id: number;
    nombre: string;
    tipo_equipo: string;
    marca: string;
    modelo: string;
    num_serie: number;
    garantia: number;
    pais: string;
    proveedor: string;
    fecha_adq: Date;
    id_interno: string;
    ubicacion: string;
    imagen: string;
    estado: ReferrerEnum;

}

export { ReferrerEnum };
