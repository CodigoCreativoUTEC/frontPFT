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
    return NextResponse.json(db.equipos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch equips' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = readDatabase();

    // Ensure a unique ID is generated if not provided
    const newId = db.equipos.length > 0 ? Math.max(...db.equipos.map((u: { id: number | string }) => Number(u.id))) + 1 : 1;
    const newEquip = { ...body, id: newId.toString() }; // Convertir a cadena

    db.equipos.push(newEquip);
    writeDatabase(db);

    return NextResponse.json(newEquip);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create equip' }, { status: 500 });
  }
}