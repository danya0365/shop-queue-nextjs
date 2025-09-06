-- Master Seed File for Shop Queue Application
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Master file to execute all seed files in correct dependency order

-- Execute seed files in dependency order
\i 001-init_seed.sql
\i 002-seed_shop1.sql
\i 003-seed_shop2.sql
\i 004-seed_shop3.sql
\i 005-seed_shop4.sql
\i 006-seed_shop5.sql
\i 007-seed_shop6.sql
\i 007-seed_shop7.sql
\i 008-seed_poster_templates.sql
\i 009-seed_shop_settings.sql
\i 010-seed_notification_settings.sql
\i 011-seed_promotions.sql
\i 012-seed_rewards.sql
\i 013-seed_customer_points.sql
\i 014-seed_customer_point_transactions.sql
\i 015-seed_reward_transactions.sql
\i 016-seed_customer_point_expiry.sql
\i 017-seed_promotion_services.sql
\i 018-seed_promotion_usage_logs.sql
\i 019-seed_shop_activity_log.sql
\i 020-seed_payment_items.sql
\i 021-seed_category_shops.sql
