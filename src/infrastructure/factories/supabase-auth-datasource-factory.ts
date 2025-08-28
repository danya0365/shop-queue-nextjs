
import { Logger } from '@/src/domain/interfaces/logger';
import { supabase as supabaseClient } from '../config/supabase-browser-client';
import { createServerSupabaseClient } from '../config/supabase-server-client';
import { SupabaseAuthDataSource } from '../datasources/supabase-auth-datasource';

/**
 * Factory function สำหรับสร้าง SupabaseAuthDataSource ที่ใช้ใน client-side components
 * ใช้ supabase client จาก supabase-client.ts (createBrowserClient)
 */
export function createClientSupabaseAuthDataSource(logger: Logger): SupabaseAuthDataSource {
  return new SupabaseAuthDataSource(logger, supabaseClient);
}

/**
 * Factory function สำหรับสร้าง SupabaseAuthDataSource ที่ใช้ใน server-side components
 * ใช้ supabase client จาก supabase-server.ts (createServerClient)
 * 
 * ฟังก์ชันนี้เป็น async เนื่องจาก createServerSupabaseClient เป็น async function
 */
export async function createServerSupabaseAuthDataSource(logger: Logger): Promise<SupabaseAuthDataSource> {
  const serverClient = await createServerSupabaseClient();
  return new SupabaseAuthDataSource(logger, serverClient);
}
