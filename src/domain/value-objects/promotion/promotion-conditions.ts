export type PromotionAwardTiming = "on_completion" | "on_payment";

export type PromotionBaseCalculation = "purchase_amount" | "service_count";

export interface PromotionPointsConfig {
  award_timing?: PromotionAwardTiming;
  base_calculation?: PromotionBaseCalculation;
  max_points_per_transaction?: number | null;
  max_points_per_day?: number | null;
  max_points_per_customer?: number | null;
  point_expiry_days?: number | null;
}

export interface PromotionEligibilityTimeRange {
  start: string;
  end: string;
}

export interface PromotionEligibilityMinVisitsInPeriod {
  visits: number;
  days: number;
}

export interface PromotionEligibility {
  min_purchase_amount?: number | null;
  min_services?: number | null;
  specific_services?: string[] | null;
  customer_tiers?: string[] | null;
  days_of_week?: string[] | null;
  time_range?: PromotionEligibilityTimeRange | null;
  first_time_only?: boolean | null;
  min_visits_in_period?: PromotionEligibilityMinVisitsInPeriod | null;
}

export interface PromotionSpecialConditionsConsecutiveVisits {
  required: number;
  bonus_multiplier: number;
}

export interface PromotionSpecialConditionsReferralBonus {
  referrer_points: number;
  referee_points: number;
}

export interface PromotionSpecialConditions {
  birthday_bonus?: boolean | null;
  consecutive_visits?: PromotionSpecialConditionsConsecutiveVisits | null;
  referral_bonus?: PromotionSpecialConditionsReferralBonus | null;
}

export interface PromotionConditions {
  points_config?: PromotionPointsConfig;
  eligibility?: PromotionEligibility;
  special_conditions?: PromotionSpecialConditions;
}
