import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbFilePath = path.join(process.cwd(), 'db.json');

// Helper function to read the database
const readDatabase = () => {
  const data = fs.readFileSync(dbFilePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write to the database
const writeDatabase = (data: any) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

// Function to generate a unique username
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
    const db = readDatabase();
    return NextResponse.json(db.usuarios);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = readDatabase();

    // Validar si el correo electrónico ya está registrado
    const emailExists = db.usuarios.some((u: { email: string }) => u.email === body.email);
    if (emailExists) {
      return NextResponse.json({ error: 'El correo electrónico ya está registrado' }, { status: 400 });
    }

    // Validar la contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(body.password)) {
      return NextResponse.json({ error: 'La contraseña debe contener al menos 8 caracteres, incluyendo letras y números' }, { status: 400 });
    }

    // Generate a unique username
    const baseUsername = `${body.nombre.toLowerCase()}.${body.apellido.toLowerCase()}`;
    const existingUsernames = db.usuarios.map((u: { nombre_usuario: string }) => u.nombre_usuario);
    const uniqueUsername = generateUniqueUsername(baseUsername, existingUsernames);

    // Ensure a unique ID is generated if not provided
    const newId = db.usuarios.length > 0 ? Math.max(...db.usuarios.map((u: { id: number | string }) => Number(u.id))) + 1 : 1;
    const newUser = { ...body, id: newId.toString(), nombre_usuario: uniqueUsername }; // Convertir a cadena

    db.usuarios.push(newUser);
    writeDatabase(db);

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
