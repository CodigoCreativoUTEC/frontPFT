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
  const equip = db.equipos.find((u: { id: number | string }) => u.id === params.id || u.id === params.id.toString());
  if (!equip) {
    return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 });
  }
  return NextResponse.json(equip);
}

export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
  const body = await request.json();
  const db = readDatabase();
  const equipIndex = db.equipos.findIndex((u: { id: number | string }) => u.id === params.id || u.id === params.id.toString());

  if (equipIndex === -1) {
    return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 });
  }

  db.equipos[equipIndex] = { ...db.equipos[equipIndex], ...body };
  writeDatabase(db);

  return NextResponse.json(db.equipos[equipIndex]);
}
