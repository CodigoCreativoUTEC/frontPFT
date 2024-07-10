import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ReferrerEnum } from '@/types/emuns';

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
      return NextResponse.json(db.bajas_equipos);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch equips' }, { status: 500 });
    }
  }

  

export async function POST(request: NextRequest) {
  const body = await request.json();
  const db = readDatabase();

  // Ensure a unique ID is generated if not provided
  const newId = db.bajas_equipos.length > 0 ? Math.max(...db.bajas_equipos.map((u: { id: number | string }) => Number(u.id))) + 1 : 1;
  const newBaja = { ...body, id: newId.toString(), estado: ReferrerEnum.INACTIVO }; // Use enum value

  db.bajas_equipos.push(newBaja);

  // Update equipo status to Inactivo
  const equipIndex = db.equipos.findIndex((u: { id: number | string }) => u.id === body.id || u.id === body.id.toString());
  if (equipIndex !== -1) {
    db.equipos[equipIndex].estado = ReferrerEnum.INACTIVO; // Use enum value
  }

  writeDatabase(db);

  return NextResponse.json(newBaja);
}
