// Test script for Retell AI webhook
const fetch = require('node-fetch');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testRetellWebhook() {
  const testRequest = {
    student: {
      name: 'Test Öğrenci',
      phone: '5551234567',
    },
    weekStart: new Date().toISOString().split('T')[0], // Today's date
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

  console.log('🧪 Retell AI Webhook Test');
  console.log('📋 Test Request:');
  console.log(JSON.stringify(testRequest, null, 2));
  console.log('');

  try {
    const response = await fetch(`${BASE_URL}/api/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    });

    const data = await response.json();

    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Body:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');

    if (response.ok && data.result === 'scheduled') {
      console.log('✅ BAŞARILI! Randevu oluşturuldu:');
      console.log(`   Gün: ${data.day}`);
      console.log(`   Saat: ${data.start} - ${data.end}`);
      console.log(`   Eğitmen: ${data.trainerName}`);
    } else if (data.result === 'no_availability') {
      console.log('⚠️  Uygun slot bulunamadı');
    } else {
      console.log('❌ HATA:', data.error || 'Bilinmeyen hata');
    }
  } catch (error) {
    console.error('❌ Test hatası:', error.message);
  }
}

testRetellWebhook();

