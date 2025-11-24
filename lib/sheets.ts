import { google } from 'googleapis';
import { Config, ScheduleRow } from './types';
import fs from 'fs';
import path from 'path';

// Google Sheets API client initialization
let sheets: any = null;

function getSheetsClient() {
  if (sheets) return sheets;

  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_PATH || './service-account.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

/**
 * Config sheet'inden ayarları okur
 */
export async function getConfig(): Promise<Config> {
  try {
    const sheetsClient = getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID environment variable is not set');
    }

    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: 'Config!A2:B100', // key-value pairs starting from row 2
    });

    const rows = response.data.values || [];
    const config: Partial<Config> = {
      trainers: [],
    };

    for (const row of rows) {
      if (!row[0] || !row[1]) continue;

      const key = row[0].trim();
      const value = row[1].trim();

      if (key === 'work_start') {
        config.workStart = value;
      } else if (key === 'work_end') {
        config.workEnd = value;
      } else if (key === 'slot_duration') {
        config.slotDuration = parseInt(value, 10);
      } else if (key.startsWith('trainer_')) {
        config.trainers?.push(value);
      }
    }

    // Default values if not found
    return {
      workStart: config.workStart || '09:00',
      workEnd: config.workEnd || '17:00',
      slotDuration: config.slotDuration || 120,
      trainers: config.trainers || [],
    };
  } catch (error) {
    console.error('Error reading config:', error);
    throw error;
  }
}

/**
 * Haftalık schedule sheet'ini okur
 */
export async function getWeeklySchedule(weekKey: string): Promise<ScheduleRow[]> {
  try {
    const sheetsClient = getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID environment variable is not set');
    }

    const sheetName = `Schedule_${weekKey}`;

    // Check if sheet exists, if not return empty array
    try {
      const response = await sheetsClient.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:G1000`, // Skip header row
      });

      const rows = response.data.values || [];
      return rows
        .filter((row: any[]) => row.length >= 6)
        .map((row: any[]) => ({
          week: row[0] || '',
          trainer: row[1] || '',
          day: row[2] || '',
          start: row[3] || '',
          end: row[4] || '',
          student: row[5] || '',
          phone: row[6] || '',
        }));
    } catch (error: any) {
      // Sheet doesn't exist yet, return empty array
      if (error.code === 400) {
        return [];
      }
      throw error;
    }
  } catch (error) {
    console.error('Error reading weekly schedule:', error);
    throw error;
  }
}

/**
 * Yeni bir Google Sheet oluşturur ve Config sheet'ini hazırlar
 */
export async function createSpreadsheet(): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  try {
    // Check if service account file exists
    const serviceAccountPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH || './service-account.json';
    const absolutePath = path.isAbsolute(serviceAccountPath) 
      ? serviceAccountPath 
      : path.join(process.cwd(), serviceAccountPath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Service account dosyası bulunamadı: ${absolutePath}`);
    }

    const sheetsClient = getSheetsClient();

    // Create new spreadsheet
    const response = await sheetsClient.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'Şirinyer Sürücü Kursu - Program Takvimi',
        },
        sheets: [
          {
            properties: {
              title: 'Config',
            },
          },
        ],
      },
    });

    const spreadsheetId = response.data.spreadsheetId!;
    const spreadsheetUrl = response.data.spreadsheetUrl!;

    // Prepare Config data
    const configData = [
      ['key', 'value'],
      ['work_start', '09:00'],
      ['work_end', '17:00'],
      ['slot_duration', '120'],
      ['trainer_1', 'Ahmet'],
      ['trainer_2', 'Mehmet'],
      ['trainer_3', 'Ayşe'],
      ['trainer_4', 'Zeynep'],
    ];

    // Write Config data
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: 'Config!A1:B10',
      valueInputOption: 'RAW',
      requestBody: {
        values: configData,
      },
    });

    // Format header row (bold)
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: response.data.sheets![0].properties!.sheetId!,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 2,
              },
              cell: {
                userEnteredFormat: {
                  textFormat: {
                    bold: true,
                  },
                  backgroundColor: {
                    red: 0.9,
                    green: 0.9,
                    blue: 0.9,
                  },
                },
              },
              fields: 'userEnteredFormat(textFormat,backgroundColor)',
            },
          },
        ],
      },
    });

    return {
      spreadsheetId,
      spreadsheetUrl,
    };
  } catch (error: any) {
    console.error('Error creating spreadsheet:', error);
    
    // Provide more detailed error messages
    if (error.code === 'ENOENT') {
      throw new Error(`Service account dosyası bulunamadı: ${error.path}`);
    } else if (error.code === 403) {
      throw new Error('Google Sheets API erişim hatası. Service Account\'a Google Sheets API izni verilmiş mi kontrol edin.');
    } else if (error.code === 401) {
      throw new Error('Kimlik doğrulama hatası. Service account JSON dosyası geçerli mi kontrol edin.');
    } else if (error.message) {
      throw new Error(`Google Sheets hatası: ${error.message}`);
    } else {
      throw new Error(`Bilinmeyen hata: ${JSON.stringify(error)}`);
    }
  }
}

/**
 * Yeni bir schedule row ekler
 */
export async function appendScheduleRow(row: ScheduleRow): Promise<void> {
  try {
    const sheetsClient = getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID environment variable is not set');
    }

    const sheetName = `Schedule_${row.week}`;

    // Check if sheet exists, if not create it
    try {
      await sheetsClient.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A1`,
      });
    } catch (error: any) {
      // Sheet doesn't exist, create it
      if (error.code === 400) {
        await sheetsClient.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });

        // Add header row
        await sheetsClient.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetName}!A1:G1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [['Hafta', 'Eğitmen', 'Gün', 'Başlangıç', 'Bitiş', 'Öğrenci', 'Telefon']],
          },
        });
      } else {
        throw error;
      }
    }

    // Append the row
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:G`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          row.week,
          row.trainer,
          row.day,
          row.start,
          row.end,
          row.student,
          row.phone,
        ]],
      },
    });
  } catch (error) {
    console.error('Error appending schedule row:', error);
    throw error;
  }
}

