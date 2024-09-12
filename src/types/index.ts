import { ReferrerEnum, tipoEquipos, marcas, modelos, paises, proveedores, ubicaciones } from "./enums";
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
    // @ts-ignore
    idTipo: tipoEquipos;
    marca: any | null;
    // @ts-ignore
    idModelo: modelos;
    nroSerie: number | string;
    garantia: number | string;
    // @ts-ignore
    idPais: paises;
    // @ts-ignore
    idProveedor: proveedores;
    fechaAdquisicion: Date | any;
    idInterno: string;
    // @ts-ignore
    idUbicacion: ubicaciones;
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

export interface MarcaModel {
    id: number | null;
    nombre: string;
    estado: ReferrerEnum;
}



export { ReferrerEnum, tipoEquipos, marcas, modelos, paises, proveedores, ubicaciones };

