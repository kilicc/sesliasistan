// Setup Config sheet in existing Google Sheet
const { google } = require('googleapis');
const fs = require('fs');

async function setupConfig() {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync('./service-account.json', 'utf8'));
    const spreadsheetId = '1hKDO3QrszclE6NDMIiZvy01_tNstgZExSt2j0jTjO6I';
    
    const auth = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      projectId: serviceAccount.project_id,
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Check if Config sheet exists
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const hasConfig = spreadsheet.data.sheets?.some(s => s.properties?.title === 'Config');
    
    if (!hasConfig) {
      console.log('📋 Config sheet oluşturuluyor...');
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'Config',
                },
              },
            },
          ],
        },
      });
      console.log('✅ Config sheet oluşturuldu!');
    } else {
      console.log('✅ Config sheet zaten var!');
    }
    
    // Add config data
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
    
    console.log('📝 Config verileri ekleniyor...');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Config!A1:B10',
      valueInputOption: 'RAW',
      requestBody: {
        values: configData,
      },
    });
    
    console.log('✅ Config sheet hazır!');
    console.log(`📊 Sheet URL: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
    
  } catch (error) {
    console.error('❌ HATA:', error.message);
    if (error.response) {
      console.error('   Detay:', error.response.data);
    }
  }
}

setupConfig();

