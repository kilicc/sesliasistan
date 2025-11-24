import { NextResponse } from 'next/server';
import { getConfig } from '@/lib/sheets';

export async function GET() {
  try {
    const config = await getConfig();
    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json(
      { error: 'Config yüklenemedi', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

