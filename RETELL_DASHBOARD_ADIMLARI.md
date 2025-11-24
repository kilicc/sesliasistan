# 🎯 Retell AI Dashboard - Webhook Ayarlama Adımları

## Webhook URL'iniz
```
https://4c4feede3a5c.ngrok-free.app/api/schedule
```

## Adım Adım Yapılacaklar

### 1. Retell AI Dashboard'a Giriş
1. https://platform.retellai.com/ adresine gidin
2. Giriş yapın

### 2. Agent Oluşturma veya Düzenleme

#### Yeni Agent Oluşturma:
1. Dashboard'da **"Agents"** veya **"Create Agent"** butonuna tıklayın
2. Agent adı: **"Şirinyer Sürücü Kursu Asistanı"** (veya istediğiniz isim)
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
   https://4c4feede3a5c.ngrok-free.app/api/schedule
   ```

   **Method:** `POST`
   
   **Content-Type:** `application/json`

4. **"Save"** veya **"Update"** butonuna tıklayın

### 4. Function Calling Ayarları (Opsiyonel ama Önerilen)

Eğer Retell AI'da function calling kullanıyorsanız:

1. **"Functions"** veya **"Tools"** sekmesine gidin
2. **"Add Function"** butonuna tıklayın
3. Function bilgileri:
   - **Name:** `schedule_driving_lesson`
   - **Description:** `Öğrenci için haftalık direksiyon dersi programı oluşturur`
   - **Webhook URL:** `https://4c4feede3a5c.ngrok-free.app/api/schedule`

4. Function Schema için `RETELL_AI_INTEGRATION.md` dosyasındaki JSON'u kullanın

### 5. Test Etme

1. Retell AI Dashboard'da **"Test Call"** veya **"Make Test Call"** butonuna tıklayın
2. Test telefon numarası girin
3. Arama yapın
4. Agent'ın function'ı çağırdığını ve webhook'un çalıştığını kontrol edin

### 6. Log Kontrolü

Terminal'de Next.js server loglarını kontrol edin:
```bash
# Server loglarında göreceksiniz:
[Schedule API] Request received: { studentName: '...', ... }
[Schedule API] Success: { result: 'scheduled', ... }
```

## Önemli Notlar

⚠️ **ngrok URL Değişebilir:**
- ngrok free plan'da her başlatmada URL değişir
- Production için domain kullanın veya ngrok static domain alın

⚠️ **ngrok Tunnel Aktif Olmalı:**
- `npm run setup:webhook` script'i çalışırken ngrok tunnel aktif kalmalı
- Script'i kapatmayın veya arka planda çalıştırın

## Sorun Giderme

### Webhook çalışmıyor
1. ✅ ngrok tunnel aktif mi? (`npm run setup:webhook` çalışıyor mu?)
2. ✅ Next.js server çalışıyor mu? (`npm run dev`)
3. ✅ Webhook URL doğru mu? (`/api/schedule` ile bitiyor mu?)
4. ✅ Retell AI Dashboard'da webhook kaydedildi mi?

### Test araması yapılamıyor
1. Retell AI API key doğru mu? (`.env` dosyasında)
2. Agent aktif mi?
3. Function tanımlı mı?

