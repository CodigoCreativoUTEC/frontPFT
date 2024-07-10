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

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  const db = readDatabase();
  const user = db.usuarios.find((u: { id: number | string }) => u.id === params.id || u.id === params.id.toString());
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
  const body = await request.json();
  const db = readDatabase();

  // Check if the email already exists
  const emailExists = db.usuarios.some((u: { email: string; id: number | string }) => u.email === body.email && (u.id !== params.id && u.id !== params.id.toString()));

  if (emailExists) {
    return NextResponse.json({ error: 'Correo electrónico ya registrado' }, { status: 400 });
  }

  const userIndex = db.usuarios.findIndex((u: { id: number | string }) => u.id === params.id || u.id === params.id.toString());

  if (userIndex === -1) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  db.usuarios[userIndex] = { ...db.usuarios[userIndex], ...body };
  writeDatabase(db);

  return NextResponse.json(db.usuarios[userIndex]);
}
