// Test script to check Google Sheets API access
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function testAPI() {
  try {
    const serviceAccountPath = './service-account.json';
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    console.log('📋 Service Account Bilgileri:');
    console.log('   Email:', serviceAccount.client_email);
    console.log('   Project ID:', serviceAccount.project_id);
    console.log('');
    
    const auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log('🔍 Google Sheets API erişim testi yapılıyor...');
    console.log('');
    
    // Try to create a test spreadsheet
    const response = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'Test Sheet - Silinebilir',
        },
      },
    });
    
    console.log('✅ BAŞARILI! Google Sheets API çalışıyor!');
    console.log('   Test Sheet ID:', response.data.spreadsheetId);
    console.log('   Test Sheet URL:', response.data.spreadsheetUrl);
    console.log('');
    console.log('🎉 API erişimi tamam. Ana uygulamada da çalışmalı.');
    
    // Clean up - delete test sheet
    // Note: We can't delete via API easily, user should delete manually
    
  } catch (error) {
    console.error('❌ HATA:', error.message);
    console.log('');
    
    if (error.code === 403) {
      console.log('🔧 ÇÖZÜM:');
      console.log('   1. https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=sesliasistan-479211');
      console.log('   2. "ENABLE" butonuna tıklayın');
      console.log('   3. Birkaç saniye bekleyin');
      console.log('   4. Bu scripti tekrar çalıştırın: node test-api.js');
    } else if (error.code === 401) {
      console.log('🔧 ÇÖZÜM: Service Account JSON dosyası geçersiz olabilir.');
    } else {
      console.log('🔧 Hata detayı:', error);
    }
  }
}

testAPI();

