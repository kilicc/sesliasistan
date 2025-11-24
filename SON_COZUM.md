# 🔧 Son Çözüm - Service Account İzinleri

## Durum
✅ Authentication çalışıyor  
✅ Access token alınabiliyor  
❌ Google Sheets API çağrısı 403 hatası veriyor

## Olası Nedenler ve Çözümler

### 1. IAM Rolleri Henüz Yayılmadı
**Çözüm:** 5-10 dakika bekleyin ve tekrar deneyin

### 2. Service Account'un "Editor" Rolü Yok
**Kontrol:**
👉 https://console.cloud.google.com/iam-admin/iam?project=sesliasistan-479211

**Yapılacaklar:**
1. `sesli2asistan@sesliasistan-479211.iam.gserviceaccount.com` bulun
2. Eğer listede YOKSA → Service Account oluşturulmamış
3. Eğer listede VARSA → Rollerini kontrol edin
4. "Editor" rolü yoksa ekleyin

### 3. Service Account Devre Dışı
**Kontrol:**
👉 https://console.cloud.google.com/iam-admin/serviceaccounts?project=sesliasistan-479211

**Yapılacaklar:**
1. Service Account'u bulun
2. "DISABLED" yazıyorsa → "ENABLE" butonuna tıklayın

### 4. Service Usage API Gerekli Olabilir
Bazı durumlarda Service Account'un "Service Usage API" kullanma izni gerekebilir.

**Kontrol:**
👉 https://console.cloud.google.com/apis/library/serviceusage.googleapis.com?project=sesliasistan-479211

**Yapılacaklar:**
1. "Service Usage API" etkin mi kontrol edin
2. Etkin değilse "ENABLE" butonuna tıklayın

### 5. Yeni Service Account Oluşturun
Eğer hiçbiri işe yaramazsa, yeni bir Service Account oluşturun:

1. **Service Accounts** sayfasına gidin
2. **"CREATE SERVICE ACCOUNT"** tıklayın
3. İsim: `sesli2asistan` (veya farklı bir isim)
4. **"CREATE AND CONTINUE"** tıklayın
5. Rol ekleyin: **"Editor"** (veya **"Owner"**)
6. **"CONTINUE"** > **"DONE"** tıklayın
7. Service Account'a tıklayın
8. **"KEYS"** sekmesi > **"ADD KEY"** > **"Create new key"** > **JSON**
9. İndirilen dosyayı `service-account.json` olarak kaydedin

## Test
Her değişiklikten sonra:
```bash
node test-api.js
```

"✅ BAŞARILI!" mesajını görene kadar tekrar deneyin.

