# 🚀 Hızlı Başlangıç Rehberi

## 1. Kurulum Kontrolü

```bash
./scripts/check-setup.sh
```

Bu script tüm kurulumların doğru yapıldığını kontrol eder.

## 2. Webhook Kurulumu (Development)

### Otomatik Kurulum (Önerilen)
```bash
./scripts/setup-webhook.sh
```

Bu script:
- ✅ Next.js server'ı kontrol eder
- ✅ ngrok tunnel oluşturur
- ✅ Webhook URL'ini gösterir
- ✅ Retell AI Dashboard'da ne yapmanız gerektiğini söyler

### Manuel Kurulum

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
ngrok http 3000
```

ngrok size bir URL verecek, örneğin: `https://abc123.ngrok.io`

## 3. Retell AI Dashboard'da Webhook Ayarlama

1. https://platform.retellai.com/ adresine gidin
2. **Agent** oluşturun veya mevcut agent'ı düzenleyin
3. **"Webhooks"** veya **"Functions"** sekmesine gidin
4. **"Add Webhook"** butonuna tıklayın
5. Webhook URL'ini girin:
   ```
   https://abc123.ngrok.io/api/schedule
   ```
6. Method: `POST`
7. Content-Type: `application/json`
8. **Kaydedin**

## 4. Test

### Otomatik Test
```bash
./scripts/test-webhook.sh
```

### Manuel Test
```bash
node test-retell-webhook.js
```

### Retell AI'dan Test
1. Retell AI Dashboard'da **"Test Call"** butonuna tıklayın
2. Test telefon numarası girin
3. Arama yapın

## 5. Production Deployment

### Vercel (Önerilen)
```bash
npm install -g vercel
vercel
```

### Webhook URL'ini Güncelle
Production URL'inizi Retell AI Dashboard'da güncelleyin:
```
https://your-domain.vercel.app/api/schedule
```

## Sorun Giderme

### Server çalışmıyor
```bash
npm run dev
```

### ngrok bulunamadı
```bash
# macOS
brew install ngrok

# veya
# https://ngrok.com/download
```

### Webhook çalışmıyor
1. ✅ Server çalışıyor mu? (`http://localhost:3000`)
2. ✅ ngrok tunnel aktif mi?
3. ✅ Webhook URL doğru mu? (`/api/schedule`)
4. ✅ Retell AI Dashboard'da webhook ayarlı mı?

## Hızlı Komutlar

```bash
# Kurulum kontrolü
./scripts/check-setup.sh

# Webhook kurulumu
./scripts/setup-webhook.sh

# Webhook testi
./scripts/test-webhook.sh

# Server başlat
npm run dev

# Build
npm run build
```

## Detaylı Dokümantasyon

- **Webhook Kurulum:** `WEBHOOK_KURULUM_REHBERI.md`
- **Retell AI Entegrasyon:** `RETELL_AI_INTEGRATION.md`
- **Google Sheets Setup:** `GOOGLE_SHEETS_SETUP.md`

