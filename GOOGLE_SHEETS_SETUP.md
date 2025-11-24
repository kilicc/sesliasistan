# Google Sheets API Kurulum Rehberi

## 1. Google Cloud Console Ayarları

### Adım 1: Google Sheets API'yi Etkinleştirin

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Projenizi seçin: `my-project-1470667591660`
3. Sol menüden **"APIs & Services"** > **"Library"** seçin
4. Arama kutusuna **"Google Sheets API"** yazın
5. **"Google Sheets API"** seçeneğine tıklayın
6. **"ENABLE"** butonuna tıklayın

### Adım 2: Service Account Kontrolü

Service Account email: `sesliasistan@my-project-1470667591660.iam.gserviceaccount.com`

Bu email'in Google Sheets API'ye erişim izni olduğundan emin olun.

## 2. Environment Variables (.env)

`.env` dosyanızda şu değişkenler olmalı:

```env
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_PATH=./service-account.json
```

## 3. Service Account JSON Dosyası

`service-account.json` dosyası proje kök dizininde olmalı ve geçerli bir JSON formatında olmalı.

## 4. Test Etme

1. Development server'ı başlatın: `npm run dev`
2. Tarayıcıda `http://localhost:3000` adresine gidin
3. "Google Sheet Oluştur" butonuna tıklayın

## 5. Yaygın Hatalar ve Çözümleri

### Hata: "Google Sheets API erişim hatası (403)"

**Çözüm:**
- Google Cloud Console'da Google Sheets API'nin etkin olduğundan emin olun
- Service Account'un projeye erişim izni olduğunu kontrol edin

### Hata: "Service account dosyası bulunamadı"

**Çözüm:**
- `service-account.json` dosyasının proje kök dizininde olduğundan emin olun
- `.env` dosyasında `GOOGLE_SERVICE_ACCOUNT_PATH` değerini kontrol edin

### Hata: "Kimlik doğrulama hatası (401)"

**Çözüm:**
- Service Account JSON dosyasının geçerli olduğundan emin olun
- JSON dosyasının bozuk olmadığını kontrol edin

