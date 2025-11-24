import { NextRequest, NextResponse } from 'next/server';
import { ScheduleRequest } from '@/lib/types';

/**
 * Test endpoint for Retell AI schedule integration
 * This endpoint allows testing the schedule API without Retell AI
 */
export async function POST(request: NextRequest) {
  try {
    const body: ScheduleRequest = await request.json();

    // Forward to main schedule endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      data,
      status: response.status,
    }, { status: response.status });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Test endpoint error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to show example request format
 */
export async function GET() {
  const exampleRequest: ScheduleRequest = {
    student: {
      name: 'Ahmet Yılmaz',
      phone: '5551234567',
    },
    weekStart: '2024-01-15',
    availability: {
      Pazartesi: [
        { start: '09:00', end: '11:00' },
        { start: '13:00', end: '15:00' },
      ],
      Salı: [
        { start: '11:00', end: '13:00' },
      ],
      Çarşamba: [
        { start: '09:00', end: '11:00' },
      ],
    },
  };

  return NextResponse.json({
    message: 'Retell AI Schedule API Test Endpoint',
    description: 'POST a request with the following format to test the schedule API',
    exampleRequest,
    endpoint: '/api/schedule',
    testEndpoint: '/api/schedule/test',
  });
}

