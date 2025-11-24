# Retell AI Entegrasyon Rehberi

## Genel Bakış

Bu proje, Retell AI'ın sesli asistan özelliklerini kullanarak öğrencileri arayıp haftalık direksiyon dersi programlarını oluşturur.

## Retell AI Webhook Endpoint

### Endpoint URL
```
POST /api/schedule
```

### Request Format

Retell AI, arama sonrasında öğrenciden topladığı bilgileri JSON formatında gönderir:

```json
{
  "student": {
    "name": "Ahmet Yılmaz",
    "phone": "5551234567"
  },
  "weekStart": "2024-01-15",
  "availability": {
    "Pazartesi": [
      { "start": "09:00", "end": "11:00" },
      { "start": "13:00", "end": "15:00" }
    ],
    "Salı": [
      { "start": "11:00", "end": "13:00" }
    ],
    "Çarşamba": [
      { "start": "09:00", "end": "11:00" }
    ],
    "Perşembe": [
      { "start": "14:00", "end": "16:00" }
    ],
    "Cuma": [
      { "start": "10:00", "end": "12:00" }
    ]
  }
}
```

### Response Format

#### Başarılı Randevu
```json
{
  "result": "scheduled",
  "day": "Pazartesi",
  "start": "09:00",
  "end": "11:00",
  "trainerName": "Ahmet"
}
```

#### Uygunluk Yok
```json
{
  "result": "no_availability"
}
```

#### Hata
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Retell AI Konfigürasyonu

### 1. Retell AI Dashboard'da Webhook Ayarlama

1. Retell AI Dashboard'a gidin
2. Agent ayarlarına gidin
3. Webhook URL'ini ayarlayın:
   ```
   https://your-domain.com/api/schedule
   ```
4. Webhook method: `POST`
5. Content-Type: `application/json`

### 2. Retell AI Function Calling

Retell AI'da function calling kullanıyorsanız, şu fonksiyonu tanımlayın:

```json
{
  "name": "schedule_driving_lesson",
  "description": "Öğrenci için haftalık direksiyon dersi programı oluşturur",
  "parameters": {
    "type": "object",
    "properties": {
      "student": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Öğrencinin adı"
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
        "description": "Haftanın başlangıç tarihi (YYYY-MM-DD)"
      },
      "availability": {
        "type": "object",
        "description": "Öğrencinin uygun olduğu günler ve saatler",
        "properties": {
          "Pazartesi": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "start": {"type": "string", "format": "time"},
                "end": {"type": "string", "format": "time"}
              }
            }
          },
          "Salı": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "start": {"type": "string", "format": "time"},
                "end": {"type": "string", "format": "time"}
              }
            }
          },
          "Çarşamba": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "start": {"type": "string", "format": "time"},
                "end": {"type": "string", "format": "time"}
              }
            }
          },
          "Perşembe": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "start": {"type": "string", "format": "time"},
                "end": {"type": "string", "format": "time"}
              }
            }
          },
          "Cuma": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "start": {"type": "string", "format": "time"},
                "end": {"type": "string", "format": "time"}
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

## Test Endpoint

### Test Endpoint URL
```
GET /api/schedule/test
POST /api/schedule/test
```

### Test Etme

1. **GET Request** - Örnek request formatını gösterir:
   ```bash
   curl http://localhost:3000/api/schedule/test
   ```

2. **POST Request** - Gerçek bir test isteği gönderir:
   ```bash
   curl -X POST http://localhost:3000/api/schedule/test \
     -H "Content-Type: application/json" \
     -d '{
       "student": {
         "name": "Test Öğrenci",
         "phone": "5551234567"
       },
       "weekStart": "2024-01-15",
       "availability": {
         "Pazartesi": [{"start": "09:00", "end": "11:00"}]
       }
     }'
   ```

## Environment Variables

`.env` dosyasına ekleyin:

```env
# Retell AI Configuration
RETELL_API_KEY=your_retell_api_key_here
RETELL_AGENT_ID=your_retell_agent_id_here

# Base URL (production için)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Akış

1. **Retell AI Öğrenciyi Arar**
   - Retell AI, öğrenciyi telefon ile arar
   - Öğrenciden uygunluk bilgilerini toplar

2. **Webhook Gönderimi**
   - Retell AI, topladığı bilgileri `/api/schedule` endpoint'ine POST eder

3. **Backend İşleme**
   - Backend, Google Sheets'ten config'i okur
   - Uygun slotu hesaplar
   - Google Sheets'e kaydeder

4. **Response**
   - Backend, Retell AI'a JSON response döner
   - Retell AI, öğrenciye randevu bilgisini söyler

## Hata Yönetimi

- **400 Bad Request**: Eksik veya geçersiz request body
- **500 Internal Server Error**: Backend hatası (Google Sheets erişim sorunu vb.)
- **200 OK**: İşlem başarılı (result: "scheduled" veya "no_availability")

## Güvenlik

- Production'da webhook signature doğrulaması eklenebilir
- Rate limiting uygulanabilir
- CORS ayarları yapılabilir

