import { Database } from "@/src/domain/types/supabase";

/**
 * Database schema types for profiles
 * These types match the actual database structure
 */

/**
 * Profile database schema
 */
export type ProfileSchema = Database["public"]["Tables"]["profiles"]["Row"];
