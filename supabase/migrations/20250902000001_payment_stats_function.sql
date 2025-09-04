CREATE OR REPLACE VIEW payment_stats_summary_view AS
WITH payment_totals AS (
  SELECT
    p.id,
    p.payment_status,
    p.payment_method,
    p.payment_date,
    SUM(pi.total) AS payment_total
  FROM payments p
  LEFT JOIN payment_items pi ON p.id = pi.payment_id
  GROUP BY p.id, p.payment_status, p.payment_method, p.payment_date
),
most_used_method AS (
  SELECT payment_method
  FROM payment_totals
  GROUP BY payment_method
  ORDER BY COUNT(*) DESC
  LIMIT 1
)
SELECT
  COUNT(*) AS total_payments,
  ROUND(COALESCE(SUM(payment_total), 0)::numeric, 2) AS total_revenue,
  COUNT(*) FILTER (WHERE payment_status = 'paid') AS paid_payments,
  COUNT(*) FILTER (WHERE payment_status = 'unpaid') AS unpaid_payments,
  COUNT(*) FILTER (WHERE payment_status = 'partial') AS partial_payments,
  ROUND(
    COALESCE(SUM(payment_total) FILTER (
      WHERE payment_status = 'paid' AND DATE(payment_date) = CURRENT_DATE
    ), 0)::numeric, 2
  ) AS today_revenue,
  ROUND(COALESCE(AVG(payment_total), 0)::numeric, 2) AS average_payment_amount,
  (SELECT payment_method FROM most_used_method) AS most_used_payment_method
FROM payment_totals;

CREATE OR REPLACE VIEW payment_stats_by_shop_view AS
WITH payment_totals AS (
  SELECT
    q.shop_id,
    p.id,
    p.payment_status,
    p.payment_method,
    p.payment_date,
    SUM(pi.total) AS payment_total
  FROM payments p
  LEFT JOIN payment_items pi ON p.id = pi.payment_id
  LEFT JOIN queues q ON p.queue_id = q.id
  GROUP BY q.shop_id, p.id, p.payment_status, p.payment_method, p.payment_date
),
most_used_method AS (
  SELECT shop_id, payment_method
  FROM (
    SELECT
      shop_id,
      payment_method,
      COUNT(*) AS cnt,
      ROW_NUMBER() OVER (PARTITION BY shop_id ORDER BY COUNT(*) DESC) AS rn
    FROM payment_totals
    GROUP BY shop_id, payment_method
  ) t
  WHERE rn = 1
)
SELECT
  pt.shop_id,
  COUNT(*) AS total_payments,
  ROUND(COALESCE(SUM(pt.payment_total), 0)::numeric, 2) AS total_revenue,
  COUNT(*) FILTER (WHERE pt.payment_status = 'paid') AS paid_payments,
  COUNT(*) FILTER (WHERE pt.payment_status = 'unpaid') AS unpaid_payments,
  COUNT(*) FILTER (WHERE pt.payment_status = 'partial') AS partial_payments,
  ROUND(
    COALESCE(SUM(pt.payment_total) FILTER (
      WHERE pt.payment_status = 'paid' AND DATE(pt.payment_date) = CURRENT_DATE
    ), 0)::numeric, 2
  ) AS today_revenue,
  ROUND(COALESCE(AVG(pt.payment_total), 0)::numeric, 2) AS average_payment_amount,
  mum.payment_method AS most_used_payment_method
FROM payment_totals pt
LEFT JOIN most_used_method mum ON pt.shop_id = mum.shop_id
GROUP BY pt.shop_id, mum.payment_method;
