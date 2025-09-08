/**
 * Database schema types for payments
 * These types match the actual database structure
 */

/**
 * Payment database schema
 */
export interface PaymentSchema {
  id: string;
  queue_id: string;
  queue_number: string;
  customer_name: string;
  total_amount: number;
  paid_amount: number | null;
  payment_method: string | null;
  payment_status: string;
  payment_date: string | null;
  processed_by_employee_id: string | null;
  processed_by_employee_name?: string; // Joined data
  shop_id: string;
  shop_name?: string; // Joined data
  created_at: string;
  updated_at: string;
}

/**
 * Payment stats database schema
 */
export interface PaymentStatsSchema {
  total_payments: number;
  total_revenue: number;
  paid_payments: number;
  unpaid_payments: number;
  partial_payments: number;
  today_revenue: number;
  average_payment_amount: number;
  most_used_payment_method: string;
}

/**
 * Payment method stats database schema
 */
export interface PaymentMethodStatsSchema {
  payment_method: string;
  count: number;
  percentage: number;
  total_amount: number;
}
