// Customer Schema types for database operations
// Based on Supabase RPC function return types

import { Database } from "@/src/domain/types/supabase";

// Schema for get_customer_by_id RPC function
export type GetCustomerByIdSchema =
  Database["public"]["Functions"]["get_customer_by_id"]["Returns"][0];

// Schema for register_customer_with_phone RPC function return type
export type RegisterCustomerSchema =
  Database["public"]["Functions"]["register_customer_with_phone"]["Returns"];

// Schema for link_customer_to_profile RPC function return type
export type LinkCustomerToProfileSchema =
  Database["public"]["Functions"]["link_customer_to_profile"]["Returns"];

// Schema for get_customer_by_profile_id RPC function (not found in types, using Json as fallback)
export type GetCustomerByProfileIdSchema =
  Database["public"]["Functions"]["get_customer_by_profile_id"]["Returns"][0];
