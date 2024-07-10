import { ReferrerEnum, Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion } from "./emuns";

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

export { ReferrerEnum, Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion };

