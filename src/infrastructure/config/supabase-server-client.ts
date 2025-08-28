import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * สร้าง Supabase client สำหรับ Server Components
 * ใช้ createServerClient จาก @supabase/ssr เพื่อให้สามารถเข้าถึง cookies ได้อย่างถูกต้อง
 */
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
