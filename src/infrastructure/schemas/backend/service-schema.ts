import { z } from 'zod';

// Database schema for services table
export const ServiceSchema = z.object({
  id: z.string().uuid(),
  shop_id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  price: z.number().min(0),
  estimated_duration: z.number().int().min(1).nullable(), // minutes
  category: z.string().nullable(),
  is_available: z.boolean().nullable(),
  icon: z.string().nullable(),
  popularity_rank: z.number().int().min(0).nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const ServiceStatsSchema = z.object({
  total_services: z.number().int().min(0),
  available_services: z.number().int().min(0),
  unavailable_services: z.number().int().min(0),
  average_price: z.number().min(0),
  total_revenue: z.number().min(0),
  services_by_category: z.record(z.string(), z.number().int().min(0)),
  popular_services: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    booking_count: z.number().int().min(0),
  })),
});

export type ServiceRow = z.infer<typeof ServiceSchema>;
export type ServiceStatsRow = z.infer<typeof ServiceStatsSchema>;
