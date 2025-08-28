import { createClient } from '@supabase/supabase-js';

// กำหนดค่าเริ่มต้นสำหรับ Supabase URL, API key และ Service Role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * สร้าง Supabase Backend client ที่ใช้ Service Role key (bypass RLS)
 * สำคัญ: ฟังก์ชันนี้ควรถูกเรียกใช้เฉพาะบน server-side เท่านั้น
 * และต้องมีการตรวจสอบสิทธิ์ที่เหมาะสมก่อนใช้งาน
 */
export const createBackendSupabaseClient = () => {
  // ตรวจสอบว่าอยู่ใน server-side environment หรือไม่
  if (typeof window !== 'undefined') {
    throw new Error('Backend Supabase client can only be created on the server side');
  }

  // ตรวจสอบว่ามี service role key หรือไม่
  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
  }

  // สร้าง client ด้วย service role key (bypasses RLS)
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    }
  });
};
