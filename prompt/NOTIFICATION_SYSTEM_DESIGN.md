# ระบบการแจ้งเตือนเมื่อมีคิวใหม่ (Queue Notification System)

## สถานะปัจจุบัน

**Schema ที่มีอยู่แล้ว:**
- ✅ `notification_settings` table - มีการตั้งค่า `new_queue` flag
- ✅ `shop_settings` table - มี `line_notify_enabled`, `sms_enabled`, `email_enabled` 
- ✅ `trigger_queue_activity()` - trigger ที่บันทึก activity เมื่อมี queue ใหม่
- ✅ `shop_activity_log` table - เก็บ log กิจกรรมต่างๆ

**สิ่งที่ขาด:**
- ❌ Table เก็บ LINE/Telegram credentials (token, chat_id)
- ❌ Function/Service สำหรับส่ง notification
- ❌ Integration กับ LINE Notify API / Telegram Bot API

---

## วิธีที่ 1: Supabase Realtime + Next.js API Route (แนะนำ ⭐)

### ข้อดี
- ✅ เหมาะกับ Next.js ecosystem
- ✅ ควบคุม business logic ได้ง่าย
- ✅ ทดสอบและ debug ง่าย
- ✅ จัดการ rate limiting ได้ดี
- ✅ รองรับ multiple notification channels (LINE, Telegram, Email, SMS)

### ข้อเสีย
- ⚠️ ต้องมี Next.js server ทำงานอยู่
- ⚠️ อาจมี delay เล็กน้อย (1-2 วินาที)

### สถาปัตยกรรม

```
┌─────────────────┐
│  Supabase DB    │
│   queues table  │
└────────┬────────┘
         │ INSERT
         ├─► Database Trigger (trigger_queue_activity)
         │   บันทึก activity log
         │
         └─► Realtime Broadcast
                    │
                    ▼
         ┌──────────────────────┐
         │ Next.js Server/Client│
         │ Subscribe to Realtime│
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Next.js API Route   │
         │  /api/notifications  │
         └──────────┬───────────┘
                    │
         ┌──────────┴─────────────┐
         ▼                        ▼
┌──────────────┐        ┌─────────────────┐
│ LINE Notify  │        │  Telegram Bot   │
│     API      │        │      API        │
└──────────────┘        └─────────────────┘
```

### Implementation

#### 1. สร้าง Table เก็บ Notification Credentials

```sql
-- Migration: notification_credentials.sql
CREATE TABLE IF NOT EXISTS notification_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    
    -- LINE Notify
    line_notify_token TEXT,
    line_notify_enabled BOOLEAN DEFAULT false,
    
    -- Telegram
    telegram_bot_token TEXT,
    telegram_chat_id TEXT,
    telegram_enabled BOOLEAN DEFAULT false,
    
    -- Notification Preferences
    notify_new_queue BOOLEAN DEFAULT true,
    notify_queue_cancelled BOOLEAN DEFAULT true,
    notify_queue_completed BOOLEAN DEFAULT false,
    notify_daily_summary BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(profile_id, shop_id)
);

CREATE INDEX idx_notification_credentials_profile_id ON notification_credentials(profile_id);
CREATE INDEX idx_notification_credentials_shop_id ON notification_credentials(shop_id);

-- Enable RLS
ALTER TABLE notification_credentials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notification credentials"
    ON notification_credentials FOR SELECT
    USING (profile_id = public.get_active_profile_id());

CREATE POLICY "Users can update their own notification credentials"
    ON notification_credentials FOR UPDATE
    USING (profile_id = public.get_active_profile_id());

CREATE POLICY "Users can insert their own notification credentials"
    ON notification_credentials FOR INSERT
    WITH CHECK (profile_id = public.get_active_profile_id());
```

#### 2. Next.js Realtime Subscription

```typescript
// /src/infrastructure/services/notification/RealtimeNotificationService.ts
import { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

export class RealtimeNotificationService {
  private channel: RealtimeChannel | null = null;

  constructor(private supabase: SupabaseClient) {}

  subscribeToQueueChanges(shopId: string) {
    this.channel = this.supabase
      .channel(`queue-changes-${shopId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'queues',
          filter: `shop_id=eq.${shopId}`,
        },
        async (payload) => {
          console.log('New queue detected:', payload);
          
          // ส่งไปยัง API Route เพื่อจัดการ notification
          await this.sendNotification(payload.new);
        }
      )
      .subscribe();

    return this.channel;
  }

  private async sendNotification(queueData: any) {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_queue',
          queueData,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send notification');
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  unsubscribe() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }
}
```

#### 3. Next.js API Route สำหรับส่ง Notification

```typescript
// /app/api/notifications/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/infrastructure/datasources/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { type, queueData } = await request.json();
    
    const supabase = createServerClient();
    
    // 1. ดึงข้อมูล shop และ owner
    const { data: shop } = await supabase
      .from('shops')
      .select('id, owner_id, name')
      .eq('id', queueData.shop_id)
      .single();
    
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }
    
    // 2. ดึง notification credentials
    const { data: credentials } = await supabase
      .from('notification_credentials')
      .select('*')
      .eq('profile_id', shop.owner_id)
      .eq('shop_id', shop.id)
      .single();
    
    if (!credentials) {
      return NextResponse.json({ 
        message: 'No notification credentials found' 
      }, { status: 200 });
    }
    
    // 3. ดึงข้อมูล customer และ queue details
    const { data: queue } = await supabase
      .from('queues')
      .select(`
        *,
        customers(name, phone),
        queue_services(
          services(name, price)
        )
      `)
      .eq('id', queueData.id)
      .single();
    
    if (!queue) {
      return NextResponse.json({ error: 'Queue not found' }, { status: 404 });
    }
    
    // 4. สร้าง notification message
    const message = createNotificationMessage(queue, shop);
    
    // 5. ส่ง notification
    const results = await Promise.allSettled([
      credentials.line_notify_enabled && credentials.line_notify_token
        ? sendLineNotification(credentials.line_notify_token, message)
        : Promise.resolve(),
      credentials.telegram_enabled && credentials.telegram_bot_token && credentials.telegram_chat_id
        ? sendTelegramNotification(credentials.telegram_bot_token, credentials.telegram_chat_id, message)
        : Promise.resolve(),
    ]);
    
    return NextResponse.json({ 
      success: true, 
      results: results.map(r => r.status) 
    });
    
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ 
      error: 'Failed to send notification' 
    }, { status: 500 });
  }
}

function createNotificationMessage(queue: any, shop: any): string {
  const customerName = queue.customers?.name || 'ไม่ระบุชื่อ';
  const queueNumber = queue.queue_number;
  const services = queue.queue_services
    ?.map((qs: any) => qs.services?.name)
    .filter(Boolean)
    .join(', ') || 'ไม่ระบุบริการ';
  
  return `
🔔 มีคิวใหม่!

ร้าน: ${shop.name}
คิวหมายเลข: ${queueNumber}
ลูกค้า: ${customerName}
บริการ: ${services}
สถานะ: ${queue.status === 'waiting' ? 'รอการยืนยัน' : queue.status}
เวลา: ${new Date().toLocaleString('th-TH')}
  `.trim();
}

async function sendLineNotification(token: string, message: string) {
  const response = await fetch('https://notify-api.line.me/api/notify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ message }),
  });
  
  if (!response.ok) {
    throw new Error(`LINE API error: ${response.statusText}`);
  }
  
  return response.json();
}

async function sendTelegramNotification(
  botToken: string, 
  chatId: string, 
  message: string
) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    }
  );
  
  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.statusText}`);
  }
  
  return response.json();
}
```

#### 4. ใช้งานใน Component

```typescript
// /app/shop/[shopId]/employee/page.tsx
'use client';

import { useEffect } from 'react';
import { RealtimeNotificationService } from '@/infrastructure/services/notification/RealtimeNotificationService';
import { createBrowserClient } from '@/infrastructure/datasources/supabase/client';

export default function EmployeeDashboard({ params }: { params: { shopId: string } }) {
  useEffect(() => {
    const supabase = createBrowserClient();
    const notificationService = new RealtimeNotificationService(supabase);
    
    // Subscribe to queue changes
    const channel = notificationService.subscribeToQueueChanges(params.shopId);
    
    return () => {
      notificationService.unsubscribe();
    };
  }, [params.shopId]);
  
  return <div>Employee Dashboard</div>;
}
```

---

## วิธีที่ 2: Database Webhooks + Edge Function

### ข้อดี
- ✅ ไม่ต้องพึ่งพา Next.js server
- ✅ Serverless architecture
- ✅ Real-time notification

### ข้อเสีย
- ⚠️ ต้องตั้งค่า webhook ใน Supabase Dashboard
- ⚠️ จำกัด capabilities ของ Edge Function
- ⚠️ Debug ยากกว่า

### Implementation

```typescript
// /supabase/functions/queue-notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const payload = await req.json();
    const { record } = payload; // queue record
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // ดึงข้อมูล shop และ credentials
    const { data: shop } = await supabase
      .from('shops')
      .select('owner_id, name')
      .eq('id', record.shop_id)
      .single();
    
    const { data: credentials } = await supabase
      .from('notification_credentials')
      .select('*')
      .eq('profile_id', shop.owner_id)
      .eq('shop_id', record.shop_id)
      .single();
    
    if (credentials?.line_notify_enabled && credentials.line_notify_token) {
      await sendLineNotification(credentials.line_notify_token, record);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

**การตั้งค่า:**
1. ไปที่ Supabase Dashboard → Database → Webhooks
2. สร้าง webhook ใหม่:
   - Table: `queues`
   - Events: `INSERT`
   - Type: `Edge Function`
   - Function: `queue-notification`

---

## วิธีที่ 3: pg_net Extension + Database Trigger (Advanced)

### ข้อดี
- ✅ Real-time ที่สุด (ส่งทันทีจาก database)
- ✅ ไม่ต้องพึ่งพา external service
- ✅ ส่งแบบ fire-and-forget

### ข้อเสีย
- ⚠️ ต้อง enable pg_net extension
- ⚠️ จำกัด error handling
- ⚠️ ยาก debug

### Implementation

```sql
-- Enable pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net;

-- สร้าง function สำหรับส่ง notification
CREATE OR REPLACE FUNCTION send_queue_notification()
RETURNS TRIGGER AS $$
DECLARE
    owner_profile_id UUID;
    line_token TEXT;
    telegram_token TEXT;
    telegram_chat_id TEXT;
    notification_message TEXT;
    customer_name TEXT;
BEGIN
    -- ดึงข้อมูล owner_id
    SELECT owner_id INTO owner_profile_id
    FROM shops
    WHERE id = NEW.shop_id;
    
    -- ดึง notification credentials
    SELECT 
        nc.line_notify_token,
        nc.telegram_bot_token,
        nc.telegram_chat_id
    INTO line_token, telegram_token, telegram_chat_id
    FROM notification_credentials nc
    WHERE nc.profile_id = owner_profile_id
      AND nc.shop_id = NEW.shop_id
      AND (nc.line_notify_enabled = true OR nc.telegram_enabled = true);
    
    -- ถ้าไม่มี credentials ให้ return
    IF line_token IS NULL AND telegram_token IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- ดึงชื่อลูกค้า
    SELECT name INTO customer_name
    FROM customers
    WHERE id = NEW.customer_id;
    
    -- สร้าง message
    notification_message := format(
        E'🔔 มีคิวใหม่!\n\nคิวหมายเลข: %s\nลูกค้า: %s\nสถานะ: %s',
        NEW.queue_number,
        COALESCE(customer_name, 'ไม่ระบุชื่อ'),
        NEW.status
    );
    
    -- ส่ง LINE Notify
    IF line_token IS NOT NULL THEN
        PERFORM net.http_post(
            url := 'https://notify-api.line.me/api/notify',
            headers := jsonb_build_object(
                'Authorization', 'Bearer ' || line_token,
                'Content-Type', 'application/x-www-form-urlencoded'
            ),
            body := jsonb_build_object('message', notification_message)
        );
    END IF;
    
    -- ส่ง Telegram
    IF telegram_token IS NOT NULL AND telegram_chat_id IS NOT NULL THEN
        PERFORM net.http_post(
            url := 'https://api.telegram.org/bot' || telegram_token || '/sendMessage',
            headers := jsonb_build_object('Content-Type', 'application/json'),
            body := jsonb_build_object(
                'chat_id', telegram_chat_id,
                'text', notification_message
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- สร้าง trigger
CREATE TRIGGER trigger_send_queue_notification
    AFTER INSERT ON queues
    FOR EACH ROW
    EXECUTE FUNCTION send_queue_notification();
```

---

## การตั้งค่า LINE Notify

### 1. สร้าง LINE Notify Token

1. ไปที่ https://notify-bot.line.me/
2. เข้าสู่ระบบด้วย LINE account
3. คลิก "My page" → "Generate token"
4. ตั้งชื่อ token และเลือกกลุ่มที่ต้องการส่ง notification
5. คัดลอก token (จะแสดงครั้งเดียว)
6. บันทึก token ใน `notification_credentials` table

### 2. Test LINE Notify

```bash
curl -X POST https://notify-api.line.me/api/notify \
  -H "Authorization: Bearer YOUR_LINE_TOKEN" \
  -d "message=Test notification from Shop Queue"
```

---

## การตั้งค่า Telegram Bot

### 1. สร้าง Telegram Bot

1. เปิด Telegram และค้นหา @BotFather
2. ส่งคำสั่ง `/newbot`
3. ตั้งชื่อ bot และ username
4. คัดลอก bot token

### 2. หา Chat ID

```bash
# ส่งข้อความให้ bot ก่อน แล้วรันคำสั่งนี้
curl https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
```

### 3. Test Telegram Bot

```bash
curl -X POST https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"YOUR_CHAT_ID","text":"Test notification"}'
```

---

## สรุปและคำแนะนำ

### ✅ แนะนำ: วิธีที่ 1 - Supabase Realtime + Next.js API Route

**เหตุผล:**
1. ✅ เหมาะกับ Next.js ecosystem ที่คุณใช้อยู่
2. ✅ ควบคุม business logic ได้เต็มที่
3. ✅ ทดสอบและ debug ง่าย
4. ✅ รองรับ multiple channels (LINE, Telegram, Email, SMS)
5. ✅ สามารถเพิ่ม rate limiting, retry logic, และ error handling
6. ✅ จัดการ sensitive data (tokens) ได้ปลอดภัย

### 📋 Checklist การ Implement

- [ ] สร้าง `notification_credentials` table
- [ ] สร้าง RealtimeNotificationService
- [ ] สร้าง API Route `/api/notifications/send`
- [ ] สร้าง UI สำหรับตั้งค่า LINE/Telegram token
- [ ] ทดสอบการส่ง notification
- [ ] เพิ่ม error handling และ logging
- [ ] เพิ่ม rate limiting (ป้องกันส่ง notification มากเกินไป)
- [ ] สร้าง notification history/log

### 🔐 Security Best Practices

1. **เข้ารหัส tokens**: ใช้ Supabase Vault หรือ environment variables
2. **RLS Policies**: ตั้งค่า RLS ให้ user เข้าถึงได้เฉพาะ credentials ของตัวเอง
3. **Rate Limiting**: จำกัดจำนวน notification ต่อชั่วโมง
4. **Validation**: ตรวจสอบ token format ก่อนบันทึก
5. **Audit Log**: บันทึกการส่ง notification ทุกครั้ง
