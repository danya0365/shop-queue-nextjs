
import { Logger } from '@/src/domain/interfaces/logger';
import { createBackendSupabaseClient } from '../config/supabase-backend-client';
import { supabase as supabaseClient } from '../config/supabase-browser-client';
import { createServerSupabaseClient } from '../config/supabase-server-client';
import { SupabaseClientType, SupabaseDatasource } from '../datasources/supabase-datasource';

/**
 * Factory function สำหรับสร้าง SupabaseDatasource ที่ใช้ใน client-side components
 * ใช้ supabase client จาก supabase-client.ts (createBrowserClient)
 * 
 * @param logger Optional logger for additional logging
 * @returns SupabaseDatasource instance with browser client
 */
export function createClientSupabaseDatasource(logger?: Logger): SupabaseDatasource {
  return new SupabaseDatasource(supabaseClient, SupabaseClientType.BROWSER, logger);
}

/**
 * Factory function สำหรับสร้าง SupabaseDatasource ที่ใช้ใน server-side components
 * ใช้ supabase client จาก supabase-server.ts (createServerClient)
 * 
 * ฟังก์ชันนี้เป็น async เนื่องจาก createServerSupabaseClient เป็น async function
 * 
 * @param logger Optional logger for additional logging
 * @returns Promise with SupabaseDatasource instance with server client
 */
export async function createServerSupabaseDatasource(logger?: Logger): Promise<SupabaseDatasource> {
  const serverClient = await createServerSupabaseClient();
  return new SupabaseDatasource(serverClient, SupabaseClientType.SERVER, logger);
}

/**
 * Factory function สำหรับสร้าง SupabaseDatasource ที่ใช้ service role key (admin)
 * ใช้ supabase client จาก supabase-admin-client.ts (createAdminSupabaseClient)
 * 
 * สำคัญ: ฟังก์ชันนี้ควรถูกเรียกใช้เฉพาะบน server-side เท่านั้น และต้องมีการตรวจสอบสิทธิ์ที่เหมาะสมก่อนใช้งาน
 * เนื่องจาก admin client สามารถ bypass RLS และเข้าถึงข้อมูลทั้งหมดได้
 * 
 * @param logger Optional logger for additional logging
 * @returns SupabaseDatasource instance with admin client that can bypass RLS
 */
export function createBackendSupabaseDatasource(logger?: Logger): SupabaseDatasource {
  const adminClient = createBackendSupabaseClient();
  return new SupabaseDatasource(adminClient, SupabaseClientType.ADMIN, logger);
}
