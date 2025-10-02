# 🔔 คู่มือการใช้งานระบบการแจ้งเตือน

## ✅ สิ่งที่สร้างไว้แล้ว

### 1. Database Migration
📄 `/supabase/migrations/20251002000001_notification_credentials.sql`
- ✅ Table `notification_credentials` สำหรับเก็บ LINE/Telegram tokens
- ✅ RLS Policies เพื่อความปลอดภัย
- ✅ Helper functions สำหรับ query และ validation
- ✅ Quiet hours support (ไม่แจ้งเตือนในช่วงเวลาที่กำหนด)

### 2. API Route
📄 `/app/api/notifications/send/route.ts`
- ✅ รองรับ LINE Notify API
- ✅ รองรับ Telegram Bot API
- ✅ ตรวจสอบ notification preferences
- ✅ ตรวจสอบ quiet hours
- ✅ Error handling และ logging

### 3. Realtime Service
📄 `/src/infrastructure/services/notification/RealtimeNotificationService.ts`
- ✅ Subscribe Supabase Realtime
- ✅ Auto-send notification เมื่อมีคิวใหม่
- ✅ Support custom callbacks
- ✅ Error handling

### 4. UI Component
📄 `/src/presentation/components/shop/employee/NotificationSetup.tsx`
- ✅ ตั้งค่า LINE Notify
- ✅ ตั้งค่า Telegram Bot
- ✅ เลือกประเภทการแจ้งเตือน
- ✅ ตั้งค่า quiet hours
- ✅ ทดสอบส่งข้อความ

---

## 📋 ขั้นตอนการติดตั้ง

### Step 1: Run Migration

```bash
# ไปที่ Supabase Dashboard → SQL Editor
# Copy & Paste ไฟล์ migration แล้วรัน

# หรือใช้ Supabase CLI
supabase db push
```

### Step 2: ตั้งค่า LINE Notify (สำหรับ Shop Owner)

1. ไปที่ https://notify-bot.line.me/
2. Login ด้วย LINE account
3. คลิก **"My page"** → **"Generate token"**
4. ตั้งชื่อ token (เช่น "Shop Queue - ร้านตัดผม")
5. เลือกกลุ่มที่ต้องการรับการแจ้งเตือน
6. คัดลอก token (จะแสดงครั้งเดียว!)
7. นำ token ไปใส่ในหน้าตั้งค่าระบบ

### Step 3: ตั้งค่า Telegram Bot (ถ้าต้องการ)

1. เปิด Telegram และค้นหา **@BotFather**
2. ส่งคำสั่ง `/newbot`
3. ตั้งชื่อ bot (เช่น "Shop Queue Bot")
4. ตั้ง username (เช่น "shopqueue_bot")
5. คัดลอก **Bot Token**

6. หา **Chat ID**:
   ```bash
   # ส่งข้อความหา bot ก่อน แล้วรันคำสั่งนี้
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
   
   ดู `chat.id` จาก response:
   ```json
   {
     "message": {
       "chat": {
         "id": 123456789  ← นี่คือ Chat ID
       }
     }
   }
   ```

7. นำ Bot Token และ Chat ID ไปใส่ในหน้าตั้งค่าระบบ

---

## 🚀 วิธีใช้งาน

### วิธีที่ 1: ใช้ใน Employee/Owner Dashboard (แนะนำ)

```typescript
// /app/shop/[shopId]/employee/page.tsx
'use client';

import { useEffect } from 'react';
import { createBrowserClient } from '@/infrastructure/datasources/supabase/client';
import { RealtimeNotificationService } from '@/infrastructure/services/notification/RealtimeNotificationService';

export default function EmployeeDashboard({ params }: { params: { shopId: string } }) {
  useEffect(() => {
    const supabase = createBrowserClient();
    const notificationService = new RealtimeNotificationService(supabase);
    
    // Subscribe to queue changes และส่ง notification อัตโนมัติ
    const channel = notificationService.subscribeToQueueChanges({
      shopId: params.shopId,
      autoSendNotification: true, // ส่งอัตโนมัติ
      onQueueCreated: (payload) => {
        console.log('New queue:', payload);
        // Optional: อัพเดท UI
      },
      onError: (error) => {
        console.error('Notification error:', error);
      }
    });
    
    // Cleanup
    return () => {
      notificationService.unsubscribe();
    };
  }, [params.shopId]);
  
  return <div>Employee Dashboard</div>;
}
```

### วิธีที่ 2: ส่ง Notification แบบ Manual

```typescript
import { RealtimeNotificationService } from '@/infrastructure/services/notification/RealtimeNotificationService';

const notificationService = new RealtimeNotificationService(supabase);

// ส่งเอง
await notificationService.sendNotification('new_queue', {
  id: 'queue-uuid',
  shop_id: 'shop-uuid',
  customer_id: 'customer-uuid',
  queue_number: 'A001',
  status: 'waiting',
  priority: 'normal',
});
```

### วิธีที่ 3: เรียก API Route โดยตรง

```typescript
const response = await fetch('/api/notifications/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'new_queue',
    queueData: {
      id: 'queue-uuid',
      shop_id: 'shop-uuid',
      customer_id: 'customer-uuid',
      queue_number: 'A001',
      status: 'waiting',
    }
  }),
});
```

---

## 🎨 เพิ่ม UI สำหรับตั้งค่าการแจ้งเตือน

```typescript
// /app/shop/[shopId]/settings/notifications/page.tsx
import { NotificationSetup } from '@/presentation/components/shop/employee/NotificationSetup';
import { createServerClient } from '@/infrastructure/datasources/supabase/server';

export default async function NotificationSettingsPage({ 
  params 
}: { 
  params: { shopId: string } 
}) {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return <div>กรุณาเข้าสู่ระบบ</div>;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">ตั้งค่าการแจ้งเตือน</h1>
      <NotificationSetup 
        shopId={params.shopId}
        profileId={user.id}
      />
    </div>
  );
}
```

---

## 🧪 ทดสอบระบบ

### ทดสอบ LINE Notify

```bash
curl -X POST https://notify-api.line.me/api/notify \
  -H "Authorization: Bearer YOUR_LINE_TOKEN" \
  -d "message=ทดสอบการแจ้งเตือน"
```

### ทดสอบ Telegram Bot

```bash
curl -X POST \
  https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "YOUR_CHAT_ID",
    "text": "ทดสอบการแจ้งเตือน"
  }'
```

### ทดสอบ Realtime + API

1. เปิด Employee Dashboard (จะ subscribe realtime อัตโนมัติ)
2. สร้างคิวใหม่ผ่าน Queue Join page
3. ตรวจสอบว่าได้รับ notification ที่ LINE หรือ Telegram

---

## 📊 ประเภทการแจ้งเตือนที่รองรับ

| Type | Description | Emoji | แนะนำเปิด |
|------|-------------|-------|----------|
| `new_queue` | มีคิวใหม่ | 🎫 | ✅ |
| `queue_confirmed` | คิวได้รับการยืนยัน | ✅ | ✅ |
| `queue_serving` | เริ่มให้บริการ | 👨‍💼 | ✅ |
| `queue_completed` | คิวเสร็จสิ้น | ✨ | ❌ |
| `queue_cancelled` | คิวถูกยกเลิก | ❌ | ✅ |
| `queue_no_show` | ลูกค้าไม่มาตามนัด | ⚠️ | ✅ |

---

## 🔐 Security Best Practices

### 1. เข้ารหัส Tokens (แนะนำสำหรับ Production)

```sql
-- ใช้ Supabase Vault สำหรับเก็บ sensitive data
-- https://supabase.com/docs/guides/database/vault

-- ตัวอย่าง
INSERT INTO vault.secrets (secret)
VALUES ('your-line-token')
RETURNING id;
```

### 2. Rate Limiting

```typescript
// เพิ่มการตรวจสอบใน API Route
const { data: cred } = await supabase
  .from('notification_credentials')
  .select('notification_count_today')
  .eq('id', credentialId)
  .single();

if (cred.notification_count_today >= 100) {
  return NextResponse.json({ 
    error: 'Rate limit exceeded' 
  }, { status: 429 });
}
```

### 3. Logging

```typescript
// บันทึก notification history
await supabase
  .from('notification_logs')
  .insert({
    credential_id: cred.id,
    type: 'new_queue',
    success: true,
    sent_at: new Date(),
  });
```

---

## 🐛 Troubleshooting

### ไม่ได้รับการแจ้งเตือน

1. ✅ ตรวจสอบว่า token ถูกต้อง
2. ✅ ตรวจสอบว่าเปิดใช้งานการแจ้งเตือน (`line_notify_enabled = true`)
3. ✅ ตรวจสอบว่าเปิดการแจ้งเตือนประเภทนั้นๆ (`notify_new_queue = true`)
4. ✅ ตรวจสอบ quiet hours (อาจอยู่ในช่วงเวลาพักเงียบ)
5. ✅ ดู logs ใน console หรือ Supabase Dashboard

### LINE Notify Error

- **401 Unauthorized**: Token ไม่ถูกต้องหรือหมดอายุ
- **400 Bad Request**: Format ของข้อความไม่ถูกต้อง
- **500 Internal Error**: ปัญหาของ LINE Notify API

### Telegram Bot Error

- **401 Unauthorized**: Bot Token ไม่ถูกต้อง
- **400 Bad Request**: Chat ID ไม่ถูกต้องหรือ Bot ยังไม่ได้รับข้อความจาก user
- **429 Too Many Requests**: ส่งข้อความมากเกินไป (rate limit)

---

## 📈 การขยายในอนาคต

### 1. Email Notifications

```typescript
// เพิ่มใน API Route
if (credentials.email_enabled && credentials.email) {
  await sendEmail(credentials.email, message);
}
```

### 2. SMS Notifications

```typescript
// ใช้ Twilio หรือ Thai Bulk SMS
if (credentials.sms_enabled && credentials.phone) {
  await sendSMS(credentials.phone, message);
}
```

### 3. Push Notifications (Web Push)

```typescript
// ใช้ Web Push API
if (credentials.push_enabled && credentials.push_subscription) {
  await sendPushNotification(credentials.push_subscription, message);
}
```

### 4. Daily Summary

```typescript
// สร้าง cron job ส่งสรุปรายวัน
// ใช้ pg_cron หรือ Vercel Cron

export async function sendDailySummary() {
  const summary = await getQueueSummary();
  await sendNotification('daily_summary', summary);
}
```

---

## 🎯 Checklist

- [ ] Run migration สร้าง `notification_credentials` table
- [ ] สร้าง LINE Notify token
- [ ] (Optional) สร้าง Telegram bot
- [ ] เพิ่ม NotificationSetup component ในหน้าตั้งค่า
- [ ] Subscribe Realtime ใน Employee/Owner Dashboard
- [ ] ทดสอบส่ง notification
- [ ] ตรวจสอบ quiet hours
- [ ] ตรวจสอบ notification preferences
- [ ] เพิ่ม error handling และ logging
- [ ] (Optional) เพิ่ม rate limiting
- [ ] (Optional) เพิ่ม notification history/logs

---

## 📚 เอกสารเพิ่มเติม

- [LINE Notify API Documentation](https://notify-bot.line.me/doc/en/)
- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)

---

**หากมีปัญหาหรือข้อสงสัย สามารถดูเพิ่มเติมได้ที่:**
- 📄 `/prompt/NOTIFICATION_SYSTEM_DESIGN.md` - สถาปัตยกรรมและการออกแบบ
- 📄 Documentation นี้ - คู่มือการใช้งาน
