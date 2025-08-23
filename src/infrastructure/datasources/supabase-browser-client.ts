import { createBrowserClient } from '@supabase/ssr';

// ตรวจสอบว่าอยู่ใน browser หรือ server
const isBrowser = typeof window !== 'undefined';

// กำหนดค่าเริ่มต้นสำหรับ Supabase URL และ API key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-for-build.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
