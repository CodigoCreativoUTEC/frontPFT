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

    // Ensure a unique ID is generated if not provided
    const newId = db.usuarios.length > 0 ? Math.max(...db.usuarios.map((u: { id: number | string }) => Number(u.id))) + 1 : 1;
    const newUser = { ...body, id: newId.toString() }; // Convertir a cadena

    db.usuarios.push(newUser);
    writeDatabase(db);

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
