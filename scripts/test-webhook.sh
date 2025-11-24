#!/bin/bash

# Webhook Test Script

echo "🧪 Retell AI Webhook Test"
echo "========================"
echo ""

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Next.js server çalışmıyor!"
    echo "   Önce 'npm run dev' ile server'ı başlatın"
    exit 1
fi

echo "✅ Server çalışıyor"
echo ""

# Test endpoint
echo "📡 Test endpoint'i kontrol ediliyor..."
TEST_RESPONSE=$(curl -s http://localhost:3000/api/schedule/test)

if echo "$TEST_RESPONSE" | grep -q "Retell AI"; then
    echo "✅ Test endpoint çalışıyor"
else
    echo "❌ Test endpoint çalışmıyor"
    exit 1
fi

echo ""

# Test webhook
echo "📤 Webhook test isteği gönderiliyor..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:3000/api/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "student": {
      "name": "Test Öğrenci",
      "phone": "5551234567"
    },
    "weekStart": "'$(date +%Y-%m-%d)'",
    "availability": {
      "Pazartesi": [
        {"start": "09:00", "end": "11:00"}
      ]
    }
  }')

echo "📥 Response:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

if echo "$RESPONSE" | grep -q "scheduled"; then
    echo "✅ BAŞARILI! Webhook çalışıyor!"
elif echo "$RESPONSE" | grep -q "no_availability"; then
    echo "⚠️  Uygun slot bulunamadı (normal, config sheet'i kontrol edin)"
else
    echo "❌ HATA: Webhook çalışmıyor"
    exit 1
fi

