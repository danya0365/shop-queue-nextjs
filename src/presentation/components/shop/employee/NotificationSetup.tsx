"use client";

import { supabase } from "@/src/infrastructure/config/supabase-browser-client";
import { useEffect, useState } from "react";

interface NotificationCredentials {
  id?: string;
  profile_id: string;
  shop_id: string;

  // LINE
  line_notify_token: string;
  line_notify_enabled: boolean;

  // Telegram
  telegram_bot_token: string;
  telegram_chat_id: string;
  telegram_enabled: boolean;

  // Preferences
  notify_new_queue: boolean;
  notify_queue_confirmed: boolean;
  notify_queue_serving: boolean;
  notify_queue_completed: boolean;
  notify_queue_cancelled: boolean;
  notify_queue_no_show: boolean;

  // Quiet Hours
  enable_quiet_hours: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

interface NotificationSetupProps {
  shopId: string;
  profileId: string;
}

export function NotificationSetup({
  shopId,
  profileId,
}: NotificationSetupProps) {
  const [credentials, setCredentials] = useState<NotificationCredentials>({
    profile_id: profileId,
    shop_id: shopId,
    line_notify_token: "",
    line_notify_enabled: false,
    telegram_bot_token: "",
    telegram_chat_id: "",
    telegram_enabled: false,
    notify_new_queue: true,
    notify_queue_confirmed: true,
    notify_queue_serving: true,
    notify_queue_completed: false,
    notify_queue_cancelled: true,
    notify_queue_no_show: true,
    enable_quiet_hours: false,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [testingLine, setTestingLine] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, [shopId, profileId]);

  async function loadCredentials() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("notification_credentials")
        .select("*")
        .eq("profile_id", profileId)
        .eq("shop_id", shopId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setCredentials(data);
      }
    } catch (error) {
      console.error("Error loading credentials:", error);
      setMessage({ type: "error", text: "ไม่สามารถโหลดข้อมูลได้" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage(null);

      const { error } = await supabase
        .from("notification_credentials")
        .upsert(credentials, {
          onConflict: "profile_id,shop_id",
        });

      if (error) throw error;

      setMessage({ type: "success", text: "บันทึกการตั้งค่าเรียบร้อย" });

      // Reload to get the ID if it was an insert
      await loadCredentials();
    } catch (error) {
      console.error("Error saving credentials:", error);
      setMessage({ type: "error", text: "ไม่สามารถบันทึกได้ กรุณาลองใหม่" });
    } finally {
      setSaving(false);
    }
  }

  async function testLineNotification() {
    if (!credentials.line_notify_token) {
      setMessage({ type: "error", text: "กรุณาใส่ LINE Notify Token" });
      return;
    }

    try {
      setTestingLine(true);

      const response = await fetch("https://notify-api.line.me/api/notify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${credentials.line_notify_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          message:
            "✅ ทดสอบการแจ้งเตือน LINE Notify จากระบบคิว\n\nหากคุณเห็นข้อความนี้ แสดงว่าการตั้งค่าถูกต้อง!",
        }),
      });

      if (!response.ok) {
        throw new Error("LINE API Error");
      }

      setMessage({
        type: "success",
        text: "ส่งข้อความทดสอบไปยัง LINE สำเร็จ!",
      });
    } catch (error) {
      console.error("Error testing LINE:", error);
      setMessage({
        type: "error",
        text: "ไม่สามารถส่งข้อความไปยัง LINE ได้ กรุณาตรวจสอบ Token",
      });
    } finally {
      setTestingLine(false);
    }
  }

  async function testTelegramNotification() {
    if (!credentials.telegram_bot_token || !credentials.telegram_chat_id) {
      setMessage({ type: "error", text: "กรุณาใส่ Bot Token และ Chat ID" });
      return;
    }

    try {
      setTestingTelegram(true);

      const response = await fetch(
        `https://api.telegram.org/bot${credentials.telegram_bot_token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: credentials.telegram_chat_id,
            text: "✅ ทดสอบการแจ้งเตือน Telegram Bot จากระบบคิว\n\nหากคุณเห็นข้อความนี้ แสดงว่าการตั้งค่าถูกต้อง!",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Telegram API Error");
      }

      setMessage({
        type: "success",
        text: "ส่งข้อความทดสอบไปยัง Telegram สำเร็จ!",
      });
    } catch (error) {
      console.error("Error testing Telegram:", error);
      setMessage({
        type: "error",
        text: "ไม่สามารถส่งข้อความไปยัง Telegram ได้ กรุณาตรวจสอบ Bot Token และ Chat ID",
      });
    } finally {
      setTestingTelegram(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">ตั้งค่าการแจ้งเตือน</h2>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* LINE Notify Section */}
        <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-green-500">📱</span> LINE Notify
            </h3>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={credentials.line_notify_enabled}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    line_notify_enabled: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium">เปิดใช้งาน</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                LINE Notify Token
              </label>
              <input
                type="text"
                value={credentials.line_notify_token}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    line_notify_token: e.target.value,
                  })
                }
                placeholder="ใส่ LINE Notify Token ของคุณ"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                disabled={!credentials.line_notify_enabled}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <a
                  href="https://notify-bot.line.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  คลิกที่นี่เพื่อสร้าง LINE Notify Token
                </a>
              </p>
            </div>

            <button
              onClick={testLineNotification}
              disabled={
                !credentials.line_notify_enabled ||
                !credentials.line_notify_token ||
                testingLine
              }
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {testingLine ? "⏳ กำลังทดสอบ..." : "🧪 ทดสอบส่งข้อความ"}
            </button>
          </div>
        </div>

        {/* Telegram Section */}
        <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-blue-500">✈️</span> Telegram Bot
            </h3>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={credentials.telegram_enabled}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    telegram_enabled: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium">เปิดใช้งาน</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Bot Token
              </label>
              <input
                type="text"
                value={credentials.telegram_bot_token}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    telegram_bot_token: e.target.value,
                  })
                }
                placeholder="ใส่ Telegram Bot Token"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                disabled={!credentials.telegram_enabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Chat ID</label>
              <input
                type="text"
                value={credentials.telegram_chat_id}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    telegram_chat_id: e.target.value,
                  })
                }
                placeholder="ใส่ Chat ID ของคุณ"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                disabled={!credentials.telegram_enabled}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                วิธีหา Chat ID: ส่งข้อความหา Bot แล้วเปิด{" "}
                <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                  https://api.telegram.org/bot{"<YOUR_BOT_TOKEN>"}/getUpdates
                </code>
              </p>
            </div>

            <button
              onClick={testTelegramNotification}
              disabled={
                !credentials.telegram_enabled ||
                !credentials.telegram_bot_token ||
                !credentials.telegram_chat_id ||
                testingTelegram
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {testingTelegram ? "⏳ กำลังทดสอบ..." : "🧪 ทดสอบส่งข้อความ"}
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">ประเภทการแจ้งเตือน</h3>
          <div className="space-y-3">
            {[
              {
                key: "notify_new_queue",
                label: "🎫 มีคิวใหม่",
                recommended: true,
              },
              {
                key: "notify_queue_confirmed",
                label: "✅ คิวได้รับการยืนยัน",
                recommended: true,
              },
              {
                key: "notify_queue_serving",
                label: "👨‍💼 เริ่มให้บริการ",
                recommended: true,
              },
              {
                key: "notify_queue_completed",
                label: "✨ คิวเสร็จสิ้น",
                recommended: false,
              },
              {
                key: "notify_queue_cancelled",
                label: "❌ คิวถูกยกเลิก",
                recommended: true,
              },
              {
                key: "notify_queue_no_show",
                label: "⚠️ ลูกค้าไม่มาตามนัด",
                recommended: true,
              },
            ].map(({ key, label, recommended }) => (
              <label key={key} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    credentials[key as keyof NotificationCredentials] as boolean
                  }
                  onChange={(e) =>
                    setCredentials({ ...credentials, [key]: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3">
                  {label}
                  {recommended && (
                    <span className="ml-2 text-xs text-blue-600">(แนะนำ)</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">🌙 เวลาพักเงียบ</h3>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={credentials.enable_quiet_hours}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    enable_quiet_hours: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium">เปิดใช้งาน</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                เริ่มเวลา
              </label>
              <input
                type="time"
                value={credentials.quiet_hours_start}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    quiet_hours_start: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                disabled={!credentials.enable_quiet_hours}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                สิ้นสุดเวลา
              </label>
              <input
                type="time"
                value={credentials.quiet_hours_end}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    quiet_hours_end: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                disabled={!credentials.enable_quiet_hours}
              />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            ระบบจะไม่ส่งการแจ้งเตือนในช่วงเวลานี้
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            {saving ? "⏳ กำลังบันทึก..." : "💾 บันทึกการตั้งค่า"}
          </button>
        </div>
      </div>
    </div>
  );
}
