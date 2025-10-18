import { z } from "zod";

export const PromotionConditionsSchema = z
  .object({
    points_config: z
      .object({
        award_timing: z.enum(["on_completion", "on_payment"]).optional(),
        base_calculation: z.enum(["purchase_amount", "service_count"]).optional(),
        max_points_per_transaction: z.number().int().min(0).nullable().optional(),
        max_points_per_day: z.number().int().min(0).nullable().optional(),
        max_points_per_customer: z.number().int().min(0).nullable().optional(),
        point_expiry_days: z.number().int().min(0).nullable().optional(),
      })
      .optional(),
    eligibility: z
      .object({
        min_purchase_amount: z.number().min(0).nullable().optional(),
        min_services: z.number().int().min(0).nullable().optional(),
        specific_services: z.array(z.string()).nullable().optional(),
        customer_tiers: z.array(z.string()).nullable().optional(),
        days_of_week: z
          .array(
            z.enum([
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ])
          )
          .nullable()
          .optional(),
        time_range: z
          .object({
            start: z.string().min(1),
            end: z.string().min(1),
          })
          .nullable()
          .optional(),
        first_time_only: z.boolean().nullable().optional(),
        min_visits_in_period: z
          .object({
            visits: z.number().int().min(0),
            days: z.number().int().min(0),
          })
          .nullable()
          .optional(),
      })
      .optional(),
    special_conditions: z
      .object({
        birthday_bonus: z.boolean().nullable().optional(),
        consecutive_visits: z
          .object({
            required: z.number().int().min(0),
            bonus_multiplier: z.number().min(0),
          })
          .nullable()
          .optional(),
        referral_bonus: z
          .object({
            referrer_points: z.number().int().min(0),
            referee_points: z.number().int().min(0),
          })
          .nullable()
          .optional(),
      })
      .optional(),
  })
  .optional();
