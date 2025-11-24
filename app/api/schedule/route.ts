import { NextRequest, NextResponse } from 'next/server';
import { getConfig, getWeeklySchedule, appendScheduleRow } from '@/lib/sheets';
import {
  getWeekKey,
  getAvailableSlotsForStudent,
  findAvailableSlot,
} from '@/lib/slot';
import { ScheduleRequest, ScheduleResponse, ScheduleRow } from '@/lib/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: ScheduleRequest = await request.json();

    // Log incoming request (without sensitive data)
    console.log('[Schedule API] Request received:', {
      studentName: body.student?.name,
      weekStart: body.weekStart,
      hasAvailability: !!body.availability,
      timestamp: new Date().toISOString(),
    });

    // Validate request
    if (!body.student || !body.student.name || !body.student.phone) {
      console.warn('[Schedule API] Validation failed: Missing student information');
      return NextResponse.json(
        { error: 'Student information is required', result: 'error' },
        { status: 400 }
      );
    }

    if (!body.weekStart) {
      console.warn('[Schedule API] Validation failed: Missing weekStart');
      return NextResponse.json(
        { error: 'weekStart is required', result: 'error' },
        { status: 400 }
      );
    }

    if (!body.availability) {
      console.warn('[Schedule API] Validation failed: Missing availability');
      return NextResponse.json(
        { error: 'availability is required', result: 'error' },
        { status: 400 }
      );
    }

    // Get config from Google Sheets
    const config = await getConfig();

    if (config.trainers.length === 0) {
      return NextResponse.json(
        { result: 'no_availability' as const },
        { status: 200 }
      );
    }

    // Get week key
    const weekKey = getWeekKey(body.weekStart);

    // Get existing schedule for this week
    const existingSchedule = await getWeeklySchedule(weekKey);

    // Get available slots for student
    const availableSlots = getAvailableSlotsForStudent(config, body.availability);

    // Find first available slot
    const slot = findAvailableSlot(availableSlots, existingSchedule);

    if (!slot) {
      return NextResponse.json(
        { result: 'no_availability' as const },
        { status: 200 }
      );
    }

    // Create schedule row
    const scheduleRow: ScheduleRow = {
      week: weekKey,
      trainer: slot.trainer,
      day: slot.day,
      start: slot.start,
      end: slot.end,
      student: body.student.name,
      phone: body.student.phone,
    };

    // Save to Google Sheets
    await appendScheduleRow(scheduleRow);

    // Return success response
    const response: ScheduleResponse = {
      result: 'scheduled',
      day: slot.day,
      start: slot.start,
      end: slot.end,
      trainerName: slot.trainer,
    };

    const duration = Date.now() - startTime;
    console.log('[Schedule API] Success:', {
      result: 'scheduled',
      day: slot.day,
      start: slot.start,
      trainer: slot.trainer,
      duration: `${duration}ms`,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[Schedule API] Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
    });

    return NextResponse.json(
      {
        error: 'Internal server error',
        result: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

