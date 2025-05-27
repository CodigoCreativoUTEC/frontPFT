export interface UsuariosTelefonos {
    id: number;
    numero: string;
}

export interface Institucion {
    id: number;
    nombre: string;
}

export interface Perfil {
    id: number;
    nombrePerfil: string;
    estado: string;
}

export interface Usuario {
    usuariosTelefonos: UsuariosTelefonos[];
    id: number;
    cedula: string;
    email: string;
    contrasenia: string;
    fechaNacimiento: string;
    estado: string;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    idInstitucion: Institucion;
    idPerfil: Perfil;
}
