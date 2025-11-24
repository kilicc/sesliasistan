#!/bin/bash

# Setup Check Script
# Tüm kurulumların doğru yapıldığını kontrol eder

echo "🔍 Kurulum Kontrolü"
echo "==================="
echo ""

ERRORS=0

# Check .env file
echo "📋 Environment Variables:"
if [ -f .env ]; then
    if grep -q "GOOGLE_SHEET_ID" .env; then
        echo "   ✅ GOOGLE_SHEET_ID"
    else
        echo "   ❌ GOOGLE_SHEET_ID eksik"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "GOOGLE_SERVICE_ACCOUNT_PATH" .env; then
        echo "   ✅ GOOGLE_SERVICE_ACCOUNT_PATH"
    else
        echo "   ❌ GOOGLE_SERVICE_ACCOUNT_PATH eksik"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "RETELL_API_KEY" .env; then
        echo "   ✅ RETELL_API_KEY"
    else
        echo "   ⚠️  RETELL_API_KEY eksik (opsiyonel)"
    fi
else
    echo "   ❌ .env dosyası bulunamadı"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check service account file
echo "🔐 Service Account:"
if [ -f service-account.json ]; then
    echo "   ✅ service-account.json bulundu"
    
    # Check if it's valid JSON
    if python3 -m json.tool service-account.json > /dev/null 2>&1; then
        echo "   ✅ service-account.json geçerli JSON"
    else
        echo "   ❌ service-account.json geçersiz JSON"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "   ❌ service-account.json bulunamadı"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check node_modules
echo "📦 Dependencies:"
if [ -d node_modules ]; then
    echo "   ✅ node_modules bulundu"
else
    echo "   ⚠️  node_modules bulunamadı (npm install çalıştırın)"
fi

echo ""

# Check if server can start
echo "🚀 Server Test:"
if command -v node &> /dev/null; then
    echo "   ✅ Node.js kurulu"
else
    echo "   ❌ Node.js kurulu değil"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo "✅ Tüm kontroller başarılı!"
    echo ""
    echo "📝 Sonraki adımlar:"
    echo "   1. npm run dev (server başlat)"
    echo "   2. ./scripts/setup-webhook.sh (ngrok tunnel)"
    echo "   3. Retell AI Dashboard'da webhook ayarla"
else
    echo "❌ $ERRORS hata bulundu"
    echo "   Lütfen yukarıdaki hataları düzeltin"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit $ERRORS

