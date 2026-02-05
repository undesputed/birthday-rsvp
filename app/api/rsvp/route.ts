import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export interface RSVPEntryStored {
  id: string;
  guestName: string;
  attending: 'yes' | 'no' | 'maybe';
  numberOfGuests: number;
  additionalGuests: string;
  dietaryRestrictions: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'rsvps.json');

async function readRsvps(): Promise<RSVPEntryStored[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw) as { rsvps: RSVPEntryStored[] };
    return Array.isArray(data.rsvps) ? data.rsvps : [];
  } catch {
    return [];
  }
}

async function writeRsvps(rsvps: RSVPEntryStored[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify({ rsvps }, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const rsvps = await readRsvps();
    return NextResponse.json(rsvps);
  } catch (err) {
    console.error('RSVP GET error:', err);
    return NextResponse.json({ error: 'Failed to load RSVPs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guestName, attending, numberOfGuests, additionalGuests, dietaryRestrictions } = body;

    if (!guestName || typeof guestName !== 'string' || !guestName.trim()) {
      return NextResponse.json({ error: 'Guest name is required' }, { status: 400 });
    }
    if (!['yes', 'no', 'maybe'].includes(attending)) {
      return NextResponse.json({ error: 'Invalid attending value' }, { status: 400 });
    }

    const rsvps = await readRsvps();
    const newEntry: RSVPEntryStored = {
      id: Date.now().toString(),
      guestName: String(guestName).trim(),
      attending,
      numberOfGuests: Math.max(0, Math.min(5, Number(numberOfGuests) || 0)),
      additionalGuests: String(additionalGuests ?? '').trim(),
      dietaryRestrictions: String(dietaryRestrictions ?? '').trim(),
      createdAt: new Date().toISOString(),
    };
    rsvps.push(newEntry);
    await writeRsvps(rsvps);
    return NextResponse.json(newEntry);
  } catch (err) {
    console.error('RSVP POST error:', err);
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    const rsvps = await readRsvps();
    const filtered = rsvps.filter((r) => r.id !== id);
    if (filtered.length === rsvps.length) {
      return NextResponse.json({ error: 'RSVP not found' }, { status: 404 });
    }
    await writeRsvps(filtered);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('RSVP DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete RSVP' }, { status: 500 });
  }
}
