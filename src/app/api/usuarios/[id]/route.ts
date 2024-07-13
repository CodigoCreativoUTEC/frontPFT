import { NextRequest, NextResponse } from 'next/server';

// Helper function to generate a unique username
const generateUniqueUsername = (baseUsername: string, existingUsernames: string[]): string => {
  let uniqueUsername = baseUsername;
  let counter = 1;

  while (existingUsernames.includes(uniqueUsername)) {
    uniqueUsername = `${baseUsername}${counter}`;
    counter++;
  }

  return uniqueUsername;
};

export async function GET() {
  try {
    const res = await fetch(`${process.env.API_REST}/usuarios`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Obtener la lista de usuarios para las validaciones
    const usuariosRes = await fetch(`${process.env.API_REST}/usuarios`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!usuariosRes.ok) {
      throw new Error('Failed to fetch users');
    }

    const usuarios = await usuariosRes.json();

    // Validar si el correo electrónico ya está registrado
    const emailExists = usuarios.some((u: { email: string }) => u.email === body.email);
    if (emailExists) {
      return NextResponse.json({ error: 'El correo electrónico ya está registrado' }, { status: 400 });
    }

    // Validar la contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(body.password)) {
      return NextResponse.json({ error: 'La contraseña debe contener al menos 8 caracteres, incluyendo letras y números' }, { status: 400 });
    }

    // Generar nombre de usuario único
    const baseUsername = `${body.nombre.toLowerCase()}.${body.apellido.toLowerCase()}`;
    const existingUsernames = usuarios.map((u: { nombre_usuario: string }) => u.nombre_usuario);
    const uniqueUsername = generateUniqueUsername(baseUsername, existingUsernames);
    body.nombre_usuario = uniqueUsername;

    // Crear usuario
    const res = await fetch(`${process.env.API_REST}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error('Failed to create user');
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}