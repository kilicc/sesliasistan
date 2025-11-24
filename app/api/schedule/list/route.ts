import { NextRequest, NextResponse } from 'next/server';
import { getWeeklySchedule } from '@/lib/sheets';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const week = searchParams.get('week');

    if (!week) {
      return NextResponse.json(
        { error: 'week parameter is required' },
        { status: 400 }
      );
    }

    const schedules = await getWeeklySchedule(week);

    return NextResponse.json(
      {
        week,
        schedules,
        count: schedules.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching schedule list:', error);
    return NextResponse.json(
      {
        error: 'Schedule listesi yüklenemedi',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

