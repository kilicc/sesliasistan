// Service Account durumunu kontrol et
const { google } = require('googleapis');
const fs = require('fs');

async function checkServiceAccount() {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync('./service-account.json', 'utf8'));
    
    console.log('📋 Service Account Bilgileri:');
    console.log('   Email:', serviceAccount.client_email);
    console.log('   Project ID:', serviceAccount.project_id);
    console.log('   Type:', serviceAccount.type);
    console.log('');
    
    // Google Auth test
    console.log('🔍 Authentication testi...');
    const auth = new google.auth.GoogleAuth({
      keyFile: './service-account.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const authClient = await auth.getClient();
    const projectId = await auth.getProjectId();
    
    console.log('✅ Authentication başarılı!');
    console.log('   Project ID:', projectId);
    console.log('');
    
    // Token almayı dene
    console.log('🔍 Access token alınıyor...');
    const token = await authClient.getAccessToken();
    
    if (token) {
      console.log('✅ Access token alındı!');
      console.log('   Token (ilk 20 karakter):', token.token?.substring(0, 20) + '...');
    } else {
      console.log('❌ Access token alınamadı');
    }
    
    console.log('');
    console.log('💡 Eğer authentication başarılı ama API çağrısı başarısızsa:');
    console.log('   1. Service Account\'un IAM\'de "Editor" rolü olduğundan emin olun');
    console.log('   2. Service Account\'un aktif olduğundan emin olun');
    console.log('   3. Birkaç dakika bekleyin (izinler yayılıyor olabilir)');
    console.log('   4. Google Cloud Console\'da Service Account\'u kontrol edin');
    
  } catch (error) {
    console.error('❌ HATA:', error.message);
    if (error.code) {
      console.error('   Code:', error.code);
    }
    if (error.response) {
      console.error('   Response:', error.response.status, error.response.statusText);
    }
  }
}

checkServiceAccount();

