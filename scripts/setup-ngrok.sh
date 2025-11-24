#!/bin/bash

# ngrok Setup Helper Script

echo "🔧 ngrok Kurulum Yardımcısı"
echo "============================"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok bulunamadı!"
    echo ""
    echo "📦 ngrok kurulumu:"
    echo ""
    echo "   macOS (Homebrew):"
    echo "   brew install ngrok"
    echo ""
    echo "   veya manuel:"
    echo "   https://ngrok.com/download"
    echo ""
    exit 1
fi

echo "✅ ngrok kurulu"
echo ""

# Check if authtoken is configured
if ngrok config check &> /dev/null; then
    echo "✅ ngrok authtoken zaten yapılandırılmış"
    echo ""
    ngrok config check
    exit 0
fi

echo "⚠️  ngrok authtoken yapılandırılmamış"
echo ""
echo "📝 Adımlar:"
echo ""
echo "1. 🌐 https://dashboard.ngrok.com/signup adresinden ücretsiz hesap oluşturun"
echo "2. 🔑 https://dashboard.ngrok.com/get-started/your-authtoken adresinden authtoken'ı kopyalayın"
echo "3. 💻 Aşağıdaki komutu çalıştırın:"
echo ""
echo "   ngrok config add-authtoken YOUR_AUTHTOKEN"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Authtoken'ı şimdi girmek ister misiniz? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "ngrok authtoken'ınızı girin: " AUTHTOKEN
    
    if [ -z "$AUTHTOKEN" ]; then
        echo "❌ Authtoken boş olamaz"
        exit 1
    fi
    
    echo ""
    echo "🔄 ngrok authtoken ekleniyor..."
    ngrok config add-authtoken "$AUTHTOKEN"
    
    if [ $? -eq 0 ]; then
        echo "✅ ngrok authtoken başarıyla eklendi!"
        echo ""
        echo "🎉 Artık webhook kurulumunu yapabilirsiniz:"
        echo "   npm run setup:webhook"
    else
        echo "❌ ngrok authtoken eklenemedi"
        exit 1
    fi
else
    echo "ℹ️  Authtoken'ı daha sonra ekleyebilirsiniz:"
    echo "   ngrok config add-authtoken YOUR_AUTHTOKEN"
fi

