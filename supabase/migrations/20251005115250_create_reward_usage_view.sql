-- View: reward_usage_by_reward_view
-- Purpose: Aggregate usage stats per reward for fast backend queries

CREATE OR REPLACE VIEW public.reward_usage_by_reward_view AS
SELECT
  r.id AS reward_id,
  r.shop_id,
  -- counts by status
  COALESCE(SUM(CASE WHEN ru.status = 'used' THEN 1 ELSE 0 END), 0)               AS used_count,
  COALESCE(SUM(CASE WHEN ru.status = 'active' THEN 1 ELSE 0 END), 0)             AS active_count,
  COALESCE(SUM(CASE WHEN ru.status = 'expired' THEN 1 ELSE 0 END), 0)            AS expired_count,
  COALESCE(SUM(CASE WHEN ru.status = 'cancelled' THEN 1 ELSE 0 END), 0)          AS cancelled_count,
  -- total issued (includes all statuses)
  COALESCE(COUNT(ru.id), 0)                                                      AS issued_count,
  -- reward config
  r.usage_limit,
  -- usage_count = total redeemed (used)
  COALESCE(SUM(CASE WHEN ru.status = 'used' THEN 1 ELSE 0 END), 0)               AS usage_count,
  -- remaining_usage = usage_limit - used_count (NULL when unlimited)
  CASE
    WHEN r.usage_limit IS NULL THEN NULL
    ELSE GREATEST(r.usage_limit - COALESCE(SUM(CASE WHEN ru.status = 'used' THEN 1 ELSE 0 END), 0), 0)
  END                                                                            AS remaining_usage
FROM public.rewards r
LEFT JOIN public.reward_usages ru ON ru.reward_id = r.id
GROUP BY r.id, r.shop_id, r.usage_limit;