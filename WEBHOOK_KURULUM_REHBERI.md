# Retell AI Webhook Kurulum Rehberi

## Adım 1: Webhook URL'ini Hazırlama

### Development (Local)
Webhook'u test etmek için local tunnel kullanmanız gerekir:

#### Option 1: ngrok (Önerilen)
```bash
# ngrok kurulumu
npm install -g ngrok

# Next.js server'ı başlatın (başka bir terminal)
npm run dev

# ngrok tunnel oluşturun
ngrok http 3000
```

ngrok size bir URL verecek, örneğin:
```
https://abc123.ngrok.io
```

Webhook URL'iniz:
```
https://abc123.ngrok.io/api/schedule
```

#### Option 2: Cloudflare Tunnel
```bash
# Cloudflare Tunnel kurulumu
npm install -g cloudflared

# Tunnel oluşturun
cloudflared tunnel --url http://localhost:3000
```

### Production
Production'da domain'iniz varsa:
```
https://your-domain.com/api/schedule
```

## Adım 2: Retell AI Dashboard'da Webhook Ayarlama

### 1. Retell AI Dashboard'a Giriş
1. https://platform.retellai.com/ adresine gidin
2. Giriş yapın

### 2. Agent Oluşturma veya Mevcut Agent'ı Düzenleme

#### Yeni Agent Oluşturma:
1. Dashboard'da **"Agents"** veya **"Create Agent"** butonuna tıklayın
2. Agent adını girin: **"Şirinyer Sürücü Kursu Asistanı"**
3. Agent ayarlarını yapılandırın

#### Mevcut Agent'ı Düzenleme:
1. **"Agents"** listesinden agent'ınızı seçin
2. **"Settings"** veya **"Configuration"** sekmesine gidin

### 3. Webhook Ayarları

1. **"Webhooks"** veya **"Functions"** sekmesine gidin
2. **"Add Webhook"** veya **"Configure Webhook"** butonuna tıklayın
3. Şu bilgileri girin:

   **Webhook URL:**
   ```
   https://your-domain.com/api/schedule
   ```
   veya development için:
   ```
   https://abc123.ngrok.io/api/schedule
   ```

   **Method:** `POST`
   
   **Content-Type:** `application/json`

### 4. Function Calling Ayarları (Opsiyonel)

Eğer Retell AI'da function calling kullanıyorsanız:

1. **"Functions"** veya **"Tools"** sekmesine gidin
2. **"Add Function"** butonuna tıklayın
3. Function adı: `schedule_driving_lesson`
4. Function description: `Öğrenci için haftalık direksiyon dersi programı oluşturur`
5. Webhook URL'i yukarıdaki gibi ayarlayın

### 5. Function Schema (JSON)

Retell AI'da function schema tanımlarken şu JSON'u kullanın:

```json
{
  "name": "schedule_driving_lesson",
  "description": "Öğrenci için haftalık direksiyon dersi programı oluşturur. Öğrenciden toplanan uygunluk bilgilerine göre en uygun slotu bulur ve randevu oluşturur.",
  "parameters": {
    "type": "object",
    "properties": {
      "student": {
        "type": "object",
        "description": "Öğrenci bilgileri",
        "properties": {
          "name": {
            "type": "string",
            "description": "Öğrencinin adı soyadı"
          },
          "phone": {
            "type": "string",
            "description": "Öğrencinin telefon numarası"
          }
        },
        "required": ["name", "phone"]
      },
      "weekStart": {
        "type": "string",
        "format": "date",
        "description": "Haftanın başlangıç tarihi (YYYY-MM-DD formatında)"
      },
      "availability": {
        "type": "object",
        "description": "Öğrencinin uygun olduğu günler ve saat aralıkları",
        "properties": {
          "Pazartesi": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "start": {"type": "string", "description": "Başlangıç saati (HH:mm)"},
                "end": {"type": "string", "description": "Bitiş saati (HH:mm)"}
              }
            }
          },
          "Salı": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "start": {"type": "string"},
                "end": {"type": "string"}
              }
            }
          },
          "Çarşamba": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "start": {"type": "string"},
                "end": {"type": "string"}
              }
            }
          },
          "Perşembe": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "start": {"type": "string"},
                "end": {"type": "string"}
              }
            }
          },
          "Cuma": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "start": {"type": "string"},
                "end": {"type": "string"}
              }
            }
          }
        }
      }
    },
    "required": ["student", "weekStart", "availability"]
  }
}
```

## Adım 3: Test Etme

### 1. Local Test
```bash
# Terminal 1: Next.js server
npm run dev

# Terminal 2: ngrok tunnel
ngrok http 3000

# Terminal 3: Test script
node test-retell-webhook.js
```

### 2. Retell AI'dan Test Arama
1. Retell AI Dashboard'da **"Test Call"** veya **"Make Test Call"** butonuna tıklayın
2. Test telefon numarası girin
3. Arama yapın ve agent'ın function'ı çağırdığını kontrol edin

### 3. Webhook Loglarını Kontrol
```bash
# Next.js server loglarında göreceksiniz:
[Schedule API] Request received: { studentName: '...', ... }
[Schedule API] Success: { result: 'scheduled', ... }
```

## Adım 4: Production Deployment

### Vercel Deployment (Önerilen)
```bash
# Vercel CLI kurulumu
npm install -g vercel

# Deploy
vercel

# Production URL'i alın
# Örnek: https://sesliasistan.vercel.app
```

### Webhook URL'i Güncelleme
1. Retell AI Dashboard'a gidin
2. Agent ayarlarından webhook URL'ini güncelleyin:
   ```
   https://sesliasistan.vercel.app/api/schedule
   ```

## Sorun Giderme

### Webhook Çalışmıyor
1. ✅ Next.js server çalışıyor mu? (`npm run dev`)
2. ✅ ngrok tunnel aktif mi? (development için)
3. ✅ Webhook URL doğru mu? (`/api/schedule`)
4. ✅ Retell AI'dan test arama yapıldı mı?

### 401 Unauthorized Hatası
- Retell AI Public Key'i `.env` dosyasına ekleyin (opsiyonel)
- Veya signature verification'ı devre dışı bırakın (development)

### 400 Bad Request
- Request format'ını kontrol edin
- `test-retell-webhook.js` scriptini çalıştırın

### 500 Internal Server Error
- Google Sheets erişimini kontrol edin
- Server loglarını kontrol edin

## Önemli Notlar

1. **Development:** ngrok veya benzeri tunnel tool kullanın
2. **Production:** Domain ve SSL sertifikası gerekli
3. **Security:** Production'da webhook signature verification aktif edin
4. **Testing:** Her zaman test endpoint'i ile başlayın (`/api/schedule/test`)

