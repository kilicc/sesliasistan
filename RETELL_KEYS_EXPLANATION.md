# Retell AI Keys Açıklaması

## Key Türleri

### 1. API Key (Zorunlu) ✅
**Kullanım:** Sunucu tarafında Retell AI API'lerine erişim için
- Webhook endpoint'lerine erişim
- REST API çağrıları
- SDK entegrasyonları

**Durum:** ✅ Eklendi (`RETELL_API_KEY`)

### 2. Public Key (Opsiyonel)
**Kullanım:** 
- **Retell Chat Widget** için (client-side) - Bu projede kullanılmıyor
- **Webhook signature verification** için (opsiyonel güvenlik)

**Durum:** ⚠️ Opsiyonel - Sadece webhook signature doğrulaması için gerekli

## Webhook Signature Verification

Retell AI webhook'larına signature ekleyip eklemediği dokümantasyona bağlı. Eğer ekliyorsa:

1. Retell AI Dashboard'dan Public Key alın
2. `.env` dosyasına ekleyin:
   ```
   RETELL_PUBLIC_KEY=your_public_key_here
   ```
3. Sistem otomatik olarak webhook signature'ları doğrulayacak

## Şu Anki Durum

- ✅ **API Key eklendi** - Webhook'lar çalışacak
- ⚠️ **Public Key opsiyonel** - Signature verification için
- 🔒 **Development modu** - Public key yoksa signature kontrolü atlanıyor

## Production Önerisi

Production'a geçerken:
1. Retell AI Dashboard'dan Public Key alın
2. `.env` dosyasına ekleyin
3. Signature verification aktif olacak

## Not

Eğer Retell AI webhook signature göndermiyorsa, public key'e gerek yok. API key yeterli.

