// Test Drive API access (sometimes needed for Sheets)
const { google } = require('googleapis');
const fs = require('fs');

async function testDriveAPI() {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync('./service-account.json', 'utf8'));
    
    console.log('📋 Service Account Bilgileri:');
    console.log('   Email:', serviceAccount.client_email);
    console.log('');
    
    const auth = new google.auth.GoogleAuth({
      keyFile: './service-account.json',
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });
    
    const drive = google.drive({ version: 'v3', auth });
    
    console.log('🔍 Drive API testi (Sheets için gerekli olabilir)...');
    
    // Try to list files (this tests Drive API access)
    const response = await drive.files.list({
      pageSize: 1,
      q: "mimeType='application/vnd.google-apps.spreadsheet'",
    });
    
    console.log('✅ Drive API çalışıyor!');
    console.log('   Bu, Service Account\'un Drive/Sheets erişimi olduğunu gösterir');
    
  } catch (error) {
    console.error('❌ Drive API Hatası:', error.message);
    if (error.code === 403) {
      console.log('');
      console.log('💡 ÇÖZÜM:');
      console.log('   Google Drive API\'yi de etkinleştirmeniz gerekebilir:');
      console.log('   https://console.cloud.google.com/apis/library/drive.googleapis.com?project=sesliasistan-479211');
    }
  }
}

testDriveAPI();

