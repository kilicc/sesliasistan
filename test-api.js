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
    
    // Try JWT authentication
    const auth = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
      ],
      projectId: serviceAccount.project_id,
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
    console.log('📋 Detaylı Hata Bilgisi:');
    console.log('   Code:', error.code);
    console.log('   Response:', error.response?.status, error.response?.statusText);
    if (error.response?.data) {
      console.log('   Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    console.log('');
    
    if (error.code === 403) {
      console.log('🔧 ÇÖZÜM - API etkin ama izin sorunu var:');
      console.log('');
      console.log('1. Service Account IAM Rollerini Kontrol Edin:');
      console.log('   https://console.cloud.google.com/iam-admin/iam?project=sesliasistan-479211');
      console.log('   - sesli2asistan@sesliasistan-479211.iam.gserviceaccount.com');
      console.log('   - En azından "Editor" veya "Service Account User" rolü olmalı');
      console.log('');
      console.log('2. Service Account Detaylarını Kontrol Edin:');
      console.log('   https://console.cloud.google.com/iam-admin/serviceaccounts?project=sesliasistan-479211');
      console.log('   - Service Account\'un aktif olduğundan emin olun');
      console.log('');
      console.log('3. API Etkinleştirme Kontrolü:');
      console.log('   https://console.cloud.google.com/apis/dashboard?project=sesliasistan-479211');
      console.log('   - "Google Sheets API" listede görünüyor mu kontrol edin');
      console.log('');
      console.log('4. Billing Kontrolü (gerekirse):');
      console.log('   - Bazı API\'ler için billing aktif olmalı');
    } else if (error.code === 401) {
      console.log('🔧 ÇÖZÜM: Service Account JSON dosyası geçersiz olabilir.');
    } else {
      console.log('🔧 Hata detayı:', error);
    }
  }
}

testAPI();

