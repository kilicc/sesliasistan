# 🔐 Service Account IAM İzinleri

## Sorun
API etkin ama Service Account'un IAM izinleri eksik. 403 hatası alınıyor.

## Çözüm Adımları

### 1. Service Account IAM Rollerini Kontrol Edin

👉 **IAM Sayfası:** https://console.cloud.google.com/iam-admin/iam?project=sesliasistan-479211

1. Bu sayfaya gidin
2. `sesli2asistan@sesliasistan-479211.iam.gserviceaccount.com` email'ini arayın
3. Eğer listede YOKSA, Service Account oluşturulmamış demektir
4. Eğer listede VARSA, rollerini kontrol edin

### 2. Service Account'a Rol Ekleyin

Service Account'a şu rollerden en az birini ekleyin:

**Önerilen Roller:**
- **Editor** (tam yetki - önerilen)
- **Service Account User** (minimum)
- **Service Account Token Creator** (gerekirse)

**Nasıl eklenir:**
1. IAM sayfasında Service Account'u bulun
2. Sağ taraftaki "✏️ Edit" (kalem) ikonuna tıklayın
3. "ADD ANOTHER ROLE" butonuna tıklayın
4. Rol seçin: **Editor**
5. "SAVE" butonuna tıklayın

### 3. Service Account Detaylarını Kontrol Edin

👉 **Service Accounts Sayfası:** https://console.cloud.google.com/iam-admin/serviceaccounts?project=sesliasistan-479211

1. Bu sayfaya gidin
2. `sesli2asistan@sesliasistan-479211.iam.gserviceaccount.com` email'ini arayın
3. Service Account'un **aktif** olduğundan emin olun
4. "DISABLED" yazıyorsa, "ENABLE" butonuna tıklayın

### 4. Test Edin

Rol ekledikten sonra:
```bash
node test-api.js
```

"✅ BAŞARILI!" mesajını görmelisiniz.

## Alternatif: Yeni Service Account Oluşturun

Eğer Service Account yoksa veya sorun devam ediyorsa:

1. **Service Accounts** sayfasına gidin
2. **"CREATE SERVICE ACCOUNT"** butonuna tıklayın
3. İsim: `sesli2asistan` (veya istediğiniz isim)
4. **"CREATE AND CONTINUE"** tıklayın
5. Rol ekleyin: **Editor**
6. **"CONTINUE"** tıklayın
7. **"DONE"** tıklayın
8. Service Account'a tıklayın
9. **"KEYS"** sekmesine gidin
10. **"ADD KEY"** > **"Create new key"** > **JSON** seçin
11. İndirilen JSON dosyasını `service-account.json` olarak kaydedin

