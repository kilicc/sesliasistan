# ⚠️ ACİL: Google Sheets API Etkinleştirme

## Hata: "The caller does not have permission" (403)

Bu hata, Google Sheets API'nin etkin olmadığını gösteriyor.

## Hızlı Çözüm (5 dakika)

### 1. Google Cloud Console'a Gidin
👉 https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=sesliasistan-479211

**VEYA manuel olarak:**
1. https://console.cloud.google.com/ adresine gidin
2. Üst kısımdan projeyi seçin: **sesliasistan-479211**
3. Sol menüden **"APIs & Services"** > **"Library"** tıklayın
4. Arama kutusuna **"Google Sheets API"** yazın

### 2. API'yi Etkinleştirin
- **"Google Sheets API"** seçeneğine tıklayın
- **"ENABLE"** butonuna tıklayın
- Birkaç saniye bekleyin (API etkinleşiyor)

### 3. Tekrar Deneyin
- Tarayıcıda `http://localhost:3000` adresine gidin
- "Google Sheet Oluştur" butonuna tıklayın

## Service Account Bilgileri

- **Proje ID:** `sesliasistan-479211`
- **Service Account Email:** `sesli2asistan@sesliasistan-479211.iam.gserviceaccount.com`

## Sorun Devam Ederse

1. Google Cloud Console'da **"APIs & Services"** > **"Enabled APIs"** bölümüne gidin
2. "Google Sheets API" listede görünüyor mu kontrol edin
3. Görünmüyorsa, yukarıdaki adımları tekrar uygulayın

