// lib/user.js
/*
export async function createUserInDatabase(
    user: { name: any, 
        image: any,
        id: any,
        cedula: any,
        idInstitucion: any,
        email: any,
        contrasenia: any,
        fechaNacimiento: any,
        estado: any,
        nombre: any,
        apellido: any,
        nombreUsuario: any,
        idPerfil: any,
        usuariosTelefonos: any; 
    }) 
{
    const { name, image,id,cedula,idInstitucion,email,contrasenia,fechaNacimiento,estado,nombre,apellido,nombreUsuario,idPerfil,usuariosTelefonos } = user;
    const response = await fetch('http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/crear', {
        method: 'POST',
            headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({
            
            cedula,
            idInstitucion,
            email,
            contrasenia,
            fechaNacimiento,
            estado,
            nombre,
            apellido,
            nombreUsuario,
            idPerfil,
            usuariosTelefonos,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to create user');
    }

    const data = await response.json();
    return data;
}

    export async function findUserByEmail(email: any) {
        const response = await fetch(`http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/obtenerUserEmail?email=${email}`);
        
        if (!response.ok) {
            return null;
        }
        const user = await response.json();
        return user;
    }

    export async function updateUserWithAdditionalInfo(email: any, document: any, phone: any) {
        const response = await fetch('http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/modificar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({ email, document, phone }),
        });
        if (!response.ok) {
            throw new Error('Failed to update user');
        }
        const data = await response.json();
        return data;
    }/** */