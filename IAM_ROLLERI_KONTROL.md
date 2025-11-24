# 🔐 IAM Rolleri Kontrolü

## Service Account Durumu
✅ **Aktif** - `sesli2asistan@sesliasistan-479211.iam.gserviceaccount.com`

## Şimdi Yapılacaklar

### 1. IAM Sayfasına Gidin
👉 **Doğrudan Link:** https://console.cloud.google.com/iam-admin/iam?project=sesliasistan-479211

### 2. Service Account'u Bulun
- Arama kutusuna: `sesli2asistan` yazın
- VEYA email ile: `sesli2asistan@sesliasistan-479211.iam.gserviceaccount.com`

### 3. Rolleri Kontrol Edin
Service Account'u bulduktan sonra:

1. **Sağ taraftaki "✏️ Edit" (kalem) ikonuna tıklayın**
2. **"PRINCIPALS"** sekmesinde Service Account'u göreceksiniz
3. **Rolleri kontrol edin:**
   - "Editor" rolü var mı?
   - "Owner" rolü var mı?
   - "Service Account User" rolü var mı?

### 4. Rol Yoksa Ekleyin
Eğer "Editor" veya "Owner" rolü YOKSA:

1. **"ADD ANOTHER ROLE"** butonuna tıklayın
2. Rol seçin: **"Editor"** (veya **"Owner"**)
3. **"SAVE"** butonuna tıklayın
4. Birkaç saniye bekleyin (izinler yayılıyor)

### 5. Test Edin
Rol ekledikten sonra:
```bash
node test-api.js
```

## Önemli Notlar

- **"Service Account User"** rolü yeterli DEĞİL - "Editor" veya "Owner" gerekli
- Roller yayılması 1-2 dakika sürebilir
- Eğer Service Account IAM sayfasında görünmüyorsa, farklı bir projede olabilir

## Alternatif: Yeni Rol Ekleme
Eğer "ADD ANOTHER ROLE" butonu görünmüyorsa:

1. Service Account'un üzerine tıklayın
2. **"PERMISSIONS"** sekmesine gidin
3. **"GRANT ACCESS"** butonuna tıklayın
4. **"ADD PRINCIPAL"** tıklayın
5. Email: `sesli2asistan@sesliasistan-479211.iam.gserviceaccount.com`
6. Rol: **"Editor"**
7. **"SAVE"** tıklayın

