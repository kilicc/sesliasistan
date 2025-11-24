#!/bin/bash

# Retell AI Webhook Setup Script
# Bu script webhook kurulumunu kolaylaştırır

echo "🚀 Retell AI Webhook Kurulum Script'i"
echo "======================================"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok bulunamadı!"
    echo ""
    echo "📦 ngrok kurulumu:"
    echo "   macOS: brew install ngrok"
    echo "   veya: https://ngrok.com/download"
    echo ""
    exit 1
fi

echo "✅ ngrok bulundu"
echo ""

# Check if Next.js server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "⚠️  Next.js server çalışmıyor (http://localhost:3000)"
    echo ""
    echo "📝 Server'ı başlatmak için:"
    echo "   npm run dev"
    echo ""
    read -p "Server'ı şimdi başlatmak ister misiniz? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Server başlatılıyor..."
        npm run dev &
        sleep 5
    else
        echo "❌ Server çalışmıyor, devam edilemiyor"
        exit 1
    fi
fi

echo "✅ Next.js server çalışıyor"
echo ""

# Start ngrok
echo "🌐 ngrok tunnel başlatılıyor..."
echo ""

# Kill existing ngrok processes
pkill ngrok 2>/dev/null
sleep 2

# Start ngrok in background
ngrok http 3000 > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!

echo "⏳ ngrok başlatılıyor (5 saniye bekleniyor)..."
sleep 5

# Get ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'https://[^"]*' | head -1)

if [ -z "$NGROK_URL" ]; then
    echo "❌ ngrok URL alınamadı"
    echo "📋 ngrok logları:"
    cat /tmp/ngrok.log
    kill $NGROK_PID 2>/dev/null
    exit 1
fi

WEBHOOK_URL="${NGROK_URL}/api/schedule"

echo "✅ ngrok tunnel oluşturuldu!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 WEBHOOK BİLGİLERİ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 ngrok URL: $NGROK_URL"
echo "🔗 Webhook URL: $WEBHOOK_URL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 RETELL AI DASHBOARD'DA YAPILACAKLAR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. https://platform.retellai.com/ adresine gidin"
echo "2. Agent oluşturun veya mevcut agent'ı düzenleyin"
echo "3. 'Webhooks' veya 'Functions' sekmesine gidin"
echo "4. 'Add Webhook' butonuna tıklayın"
echo "5. Webhook URL'ini girin:"
echo ""
echo "   $WEBHOOK_URL"
echo ""
echo "6. Method: POST"
echo "7. Content-Type: application/json"
echo "8. Kaydedin"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 TEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Test etmek için:"
echo "   node test-retell-webhook.js"
echo ""
echo "veya Retell AI Dashboard'dan 'Test Call' yapın"
echo ""
echo "⚠️  ngrok tunnel'ı kapatmak için: Ctrl+C veya"
echo "   kill $NGROK_PID"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Keep script running
trap "kill $NGROK_PID 2>/dev/null; exit" INT TERM
wait $NGROK_PID

