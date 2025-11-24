# Şirinyer Sürücü Kursu - Retell AI Sesli Asistan

Next.js 16 tabanlı Retell AI entegrasyonlu sesli asistan sistemi. Öğrencileri arayarak haftalık direksiyon dersi programlarını oluşturur ve Google Sheets'e kaydeder.

## Teknolojiler

- **Next.js 16** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Google Sheets API**
- **Retell AI**

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun:
```bash
cp .env.example .env
```

3. Google Sheets Service Account JSON dosyasını proje kök dizinine `service-account.json` olarak ekleyin.

4. `.env` dosyasını düzenleyin:
```
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_PATH=./service-account.json
```

## Google Sheets Yapısı

### Sheet 1: Config
| key | value |
|-----|-------|
| work_start | 09:00 |
| work_end | 17:00 |
| slot_duration | 120 |
| trainer_1 | Ahmet |
| trainer_2 | Mehmet |
| trainer_3 | Ayşe |
| trainer_4 | Zeynep |

### Sheet 2: Schedule_YYYY_WW
| Hafta | Eğitmen | Gün | Başlangıç | Bitiş | Öğrenci | Telefon |

## API Endpoint

### POST /api/schedule

**Request Body:**
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
    ]
  }
}
```

**Response:**
```json
{
  "result": "scheduled",
  "day": "Pazartesi",
  "start": "09:00",
  "end": "11:00",
  "trainerName": "Ahmet"
}
```

veya

```json
{
  "result": "no_availability"
}
```

## Geliştirme

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lisans

Özel proje - Şirinyer Sürücü Kursu

