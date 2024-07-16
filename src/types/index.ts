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
    idEquipo: any;
    nombre: string;
    fecha_baja: Date;
    usuario: string;
    razon: string;
    comentarios: string;
    estado: ReferrerEnum.INACTIVO;
}

export { ReferrerEnum, Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion };

