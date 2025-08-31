-- Create shop stats view
CREATE OR REPLACE VIEW shop_stats_view AS
SELECT
    COUNT(*) AS total_shops,
    COUNT(*) FILTER (WHERE status = 'active') AS active_shops,
    COUNT(*) FILTER (WHERE status = 'draft') AS pending_approval,
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW())) AS new_this_month
FROM shops;
