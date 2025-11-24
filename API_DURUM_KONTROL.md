# 🔍 Google Sheets API Durum Kontrolü

## Test Sonucu
❌ **API ETKİN DEĞİL** - "The caller does not have permission" hatası alınıyor

## Service Account Bilgileri
- **Email:** `sesli2asistan@sesliasistan-479211.iam.gserviceaccount.com`
- **Project ID:** `sesliasistan-479211`

## ⚠️ ÖNEMLİ: API Etkinleştirme Adımları

### 1. Doğru Projeyi Seçin
Google Cloud Console'da **kesinlikle** şu projeyi seçmelisiniz:
👉 **sesliasistan-479211**

### 2. API'yi Etkinleştirin
**Doğrudan link:**
https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=sesliasistan-479211

**VEYA manuel:**
1. https://console.cloud.google.com/ adresine gidin
2. Üst kısımdan projeyi seçin: **sesliasistan-479211** (önemli!)
3. Sol menüden **"APIs & Services"** > **"Library"** tıklayın
4. Arama kutusuna **"Google Sheets API"** yazın
5. **"Google Sheets API"** seçeneğine tıklayın
6. **"ENABLE"** butonuna tıklayın (eğer "MANAGE" görüyorsanız zaten etkin)

### 3. Etkinleştirme Sonrası Kontrol
1. **"APIs & Services"** > **"Enabled APIs"** bölümüne gidin
2. Listede **"Google Sheets API"** görünüyor mu kontrol edin
3. Görünüyorsa, birkaç saniye bekleyin (API yayılıyor)

### 4. Test Edin
```bash
node test-api.js
```

Eğer "✅ BAŞARILI!" mesajı görürseniz, API etkin demektir.

## Yaygın Sorunlar

### Sorun: "ENABLE" butonu görünmüyor
- Projeyi yanlış seçmiş olabilirsiniz
- Üst kısımdan **sesliasistan-479211** projesini seçtiğinizden emin olun

### Sorun: API etkin ama hala hata alıyorum
- Birkaç dakika bekleyin (API yayılıyor)
- Development server'ı yeniden başlatın: `npm run dev`
- Tarayıcı cache'ini temizleyin

### Sorun: Farklı bir projede API etkin
- Service Account **sesliasistan-479211** projesine ait
- Başka bir projede API etkinleştirmeniz işe yaramaz
- **Mutlaka sesliasistan-479211 projesinde** etkinleştirin

