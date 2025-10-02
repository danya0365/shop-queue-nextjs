import { createServerSupabaseClient } from "@/src/infrastructure/config/supabase-server-client";
import { ConsoleLogger } from "@/src/infrastructure/loggers/console-logger";
import { NextRequest, NextResponse } from "next/server";

const logger = new ConsoleLogger();

interface SendNotificationRequest {
  type:
    | "new_queue"
    | "queue_confirmed"
    | "queue_serving"
    | "queue_completed"
    | "queue_cancelled"
    | "queue_no_show";
  queueData: {
    id: string;
    shop_id: string;
    customer_id: string;
    queue_number: string;
    status: string;
    priority?: string;
    note?: string;
  };
}

interface NotificationCredential {
  id: string;
  profile_id: string;
  line_notify_token: string | null;
  line_notify_enabled: boolean;
  telegram_bot_token: string | null;
  telegram_chat_id: string | null;
  telegram_enabled: boolean;
  notify_new_queue: boolean;
  notify_queue_confirmed: boolean;
  notify_queue_serving: boolean;
  notify_queue_completed: boolean;
  notify_queue_cancelled: boolean;
  notify_queue_no_show: boolean;
  enable_quiet_hours: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendNotificationRequest = await request.json();
    const { type, queueData } = body;

    logger.info("Notification request received", {
      type,
      queueId: queueData.id,
    });

    const supabase = await createServerSupabaseClient();

    // 1. ดึงข้อมูล shop
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id, name, owner_id")
      .eq("id", queueData.shop_id)
      .single();

    if (shopError || !shop) {
      logger.error("Shop not found", {
        shopId: queueData.shop_id,
        error: shopError,
      });
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // 2. ดึงข้อมูล notification credentials สำหรับ shop นี้
    const { data: credentials, error: credError } = await supabase
      .from("notification_credentials")
      .select("*")
      .eq("shop_id", shop.id)
      .or("line_notify_enabled.eq.true,telegram_enabled.eq.true");

    if (credError) {
      logger.error("Error fetching credentials", { error: credError });
      return NextResponse.json(
        { error: "Failed to fetch credentials" },
        { status: 500 }
      );
    }

    if (!credentials || credentials.length === 0) {
      logger.info("No notification credentials found for shop", {
        shopId: shop.id,
      });
      return NextResponse.json(
        {
          message: "No notification credentials configured",
        },
        { status: 200 }
      );
    }

    // 3. ดึงข้อมูล queue details
    const { data: queue, error: queueError } = await supabase
      .from("queues")
      .select(
        `
        *,
        customers(name, phone),
        queue_services(
          id,
          quantity,
          price,
          services(name, price, estimated_duration)
        )
      `
      )
      .eq("id", queueData.id)
      .single();

    if (queueError || !queue) {
      logger.error("Queue not found", {
        queueId: queueData.id,
        error: queueError,
      });
      return NextResponse.json({ error: "Queue not found" }, { status: 404 });
    }

    // 4. สร้าง notification message
    const message = createNotificationMessage(type, queue, shop);

    // 5. ส่ง notification ไปยังทุก credentials ที่เปิดใช้งาน
    const results = await Promise.allSettled(
      credentials.map(async (cred: NotificationCredential) => {
        // Check notification preference
        if (!shouldSendNotificationByType(type, cred)) {
          logger.info("Notification disabled for this type", {
            type,
            credentialId: cred.id,
          });
          return { skipped: true, reason: "disabled" };
        }

        // Check quiet hours
        if (
          cred.enable_quiet_hours &&
          isQuietHours(cred.quiet_hours_start, cred.quiet_hours_end)
        ) {
          logger.info("Skipping notification due to quiet hours", {
            credentialId: cred.id,
          });
          return { skipped: true, reason: "quiet_hours" };
        }

        const notificationResults = await Promise.allSettled([
          cred.line_notify_enabled && cred.line_notify_token
            ? sendLineNotification(cred.line_notify_token, message)
            : Promise.resolve(null),
          cred.telegram_enabled &&
          cred.telegram_bot_token &&
          cred.telegram_chat_id
            ? sendTelegramNotification(
                cred.telegram_bot_token,
                cred.telegram_chat_id,
                message
              )
            : Promise.resolve(null),
        ]);

        // Update notification sent count
        await updateNotificationSent(supabase, cred.id);

        return notificationResults;
      })
    );

    logger.info("Notifications sent", {
      total: credentials.length,
      results: results.map((r) => r.status),
    });

    return NextResponse.json({
      success: true,
      credentialsSent: credentials.length,
      results: results.map((r) => r.status),
    });
  } catch (error) {
    logger.error("Notification error", { error });
    return NextResponse.json(
      {
        error: "Failed to send notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper: Create notification message
function createNotificationMessage(
  type: string,
  queue: any,
  shop: any
): string {
  const customerName = queue.customers?.name || "ไม่ระบุชื่อ";
  const queueNumber = queue.queue_number;
  const services =
    queue.queue_services
      ?.map((qs: any) => qs.services?.name)
      .filter(Boolean)
      .join(", ") || "ไม่ระบุบริการ";

  const statusText = getStatusText(type, queue.status);
  const priorityText =
    queue.priority === "high"
      ? "⚡ ด่วน"
      : queue.priority === "urgent"
      ? "🚨 ด่วนมาก"
      : "";

  let emoji = "🔔";
  if (type === "new_queue") emoji = "🎫";
  if (type === "queue_confirmed") emoji = "✅";
  if (type === "queue_serving") emoji = "👨‍💼";
  if (type === "queue_completed") emoji = "✨";
  if (type === "queue_cancelled") emoji = "❌";
  if (type === "queue_no_show") emoji = "⚠️";

  return `
${emoji} ${statusText}

ร้าน: ${shop.name}
คิวหมายเลข: ${queueNumber} ${priorityText}
ลูกค้า: ${customerName}
บริการ: ${services}
เวลา: ${new Date().toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "medium",
    timeStyle: "short",
  })}
${queue.note ? `\n📝 หมายเหตุ: ${queue.note}` : ""}
  `.trim();
}

// Helper: Get status text
function getStatusText(type: string, status: string): string {
  const statusMap: Record<string, string> = {
    new_queue: "มีคิวใหม่!",
    queue_confirmed: "คิวได้รับการยืนยัน",
    queue_serving: "เริ่มให้บริการ",
    queue_completed: "คิวเสร็จสิ้น",
    queue_cancelled: "คิวถูกยกเลิก",
    queue_no_show: "ลูกค้าไม่มาตามนัด",
  };
  return statusMap[type] || "อัพเดทคิว";
}

// Helper: Check if should send notification by type
function shouldSendNotificationByType(
  type: string,
  cred: NotificationCredential
): boolean {
  const typeMap: Record<string, keyof NotificationCredential> = {
    new_queue: "notify_new_queue",
    queue_confirmed: "notify_queue_confirmed",
    queue_serving: "notify_queue_serving",
    queue_completed: "notify_queue_completed",
    queue_cancelled: "notify_queue_cancelled",
    queue_no_show: "notify_queue_no_show",
  };

  const prefKey = typeMap[type];
  return prefKey ? (cred[prefKey] as boolean) : false;
}

// Helper: Check quiet hours
function isQuietHours(startTime: string, endTime: string): boolean {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const start = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;

  if (start < end) {
    // Normal case: quiet hours within same day
    return currentTime >= start && currentTime < end;
  } else {
    // Crosses midnight
    return currentTime >= start || currentTime < end;
  }
}

// Helper: Send LINE notification
async function sendLineNotification(
  token: string,
  message: string
): Promise<any> {
  const response = await fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ message }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error("LINE API error", {
      status: response.status,
      error: errorText,
    });
    throw new Error(`LINE API error: ${response.statusText}`);
  }

  return response.json();
}

// Helper: Send Telegram notification
async function sendTelegramNotification(
  botToken: string,
  chatId: string,
  message: string
): Promise<any> {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    logger.error("Telegram API error", {
      status: response.status,
      error: errorText,
    });
    throw new Error(`Telegram API error: ${response.statusText}`);
  }

  return response.json();
}

// Helper: Update notification sent count
async function updateNotificationSent(
  supabase: any,
  credentialId: string
): Promise<void> {
  await supabase.rpc("update_notification_sent", {
    p_credential_id: credentialId,
  });
}
