import { NextResponse } from 'next/server';
import { createSpreadsheet } from '@/lib/sheets';

export async function POST() {
  try {
    const result = await createSpreadsheet();

    return NextResponse.json(
      {
        success: true,
        spreadsheetId: result.spreadsheetId,
        spreadsheetUrl: result.spreadsheetUrl,
        message: 'Google Sheet başarıyla oluşturuldu!',
        instructions: [
          `1. .env dosyasına şu satırı ekleyin:`,
          `   GOOGLE_SHEET_ID=${result.spreadsheetId}`,
          `2. Service Account email'ini (sesliasistan@my-project-1470667591660.iam.gserviceaccount.com) Sheet'e Editor olarak ekleyin`,
          `3. Sheet hazır! Config sheet'i otomatik olarak oluşturuldu.`,
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating sheet:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Sheet oluşturulurken hata oluştu',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}

