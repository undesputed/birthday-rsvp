import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase-server';

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

function rowToEntry(row: {
  id: string;
  guest_name: string;
  attending: string;
  number_of_guests: number;
  additional_guests: string | null;
  dietary_restrictions: string | null;
  created_at: string;
}): RSVPEntryStored {
  return {
    id: row.id,
    guestName: row.guest_name,
    attending: row.attending as 'yes' | 'no' | 'maybe',
    numberOfGuests: row.number_of_guests ?? 0,
    additionalGuests: row.additional_guests ?? '',
    dietaryRestrictions: row.dietary_restrictions ?? '',
    createdAt: row.created_at,
  };
}

async function readRsvpsFile(): Promise<RSVPEntryStored[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw) as { rsvps: RSVPEntryStored[] };
    return Array.isArray(data.rsvps) ? data.rsvps : [];
  } catch {
    return [];
  }
}

async function writeRsvpsFile(rsvps: RSVPEntryStored[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify({ rsvps }, null, 2), 'utf-8');
}

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin()!;
      const { data, error } = await supabase
        .from('rsvps')
        .select('id, guest_name, attending, number_of_guests, additional_guests, dietary_restrictions, created_at')
        .order('created_at', { ascending: true });
      if (error) {
        console.error('RSVP GET Supabase error:', error);
        return NextResponse.json({ error: 'Failed to load RSVPs' }, { status: 500 });
      }
      return NextResponse.json((data ?? []).map(rowToEntry));
    }
    const rsvps = await readRsvpsFile();
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

    const numGuests = Math.max(0, Math.min(5, Number(numberOfGuests) || 0));
    const guestNameTrimmed = String(guestName).trim();
    const additionalTrimmed = String(additionalGuests ?? '').trim();
    const dietaryTrimmed = String(dietaryRestrictions ?? '').trim();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin()!;
      const { data, error } = await supabase
        .from('rsvps')
        .insert({
          guest_name: guestNameTrimmed,
          attending,
          number_of_guests: numGuests,
          additional_guests: additionalTrimmed,
          dietary_restrictions: dietaryTrimmed,
        })
        .select('id, guest_name, attending, number_of_guests, additional_guests, dietary_restrictions, created_at')
        .single();
      if (error) {
        console.error('RSVP POST Supabase error:', error);
        return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 });
      }
      return NextResponse.json(rowToEntry(data));
    }

    const rsvps = await readRsvpsFile();
    const newEntry: RSVPEntryStored = {
      id: Date.now().toString(),
      guestName: guestNameTrimmed,
      attending,
      numberOfGuests: numGuests,
      additionalGuests: additionalTrimmed,
      dietaryRestrictions: dietaryTrimmed,
      createdAt: new Date().toISOString(),
    };
    rsvps.push(newEntry);
    await writeRsvpsFile(rsvps);
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

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin()!;
      const { error } = await supabase.from('rsvps').delete().eq('id', id);
      if (error) {
        console.error('RSVP DELETE Supabase error:', error);
        return NextResponse.json({ error: 'Failed to delete RSVP' }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    const rsvps = await readRsvpsFile();
    const filtered = rsvps.filter((r) => r.id !== id);
    if (filtered.length === rsvps.length) {
      return NextResponse.json({ error: 'RSVP not found' }, { status: 404 });
    }
    await writeRsvpsFile(filtered);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('RSVP DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete RSVP' }, { status: 500 });
  }
}
