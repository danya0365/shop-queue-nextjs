# Shop Queue Seed Data

This directory contains comprehensive seed data for the Shop Queue application database.

## File Structure

### Core Data (Required First)
- `001-init_seed.sql` - Initial users, profiles, and categories
- `002-seed_shop1.sql` to `007-seed_shop7.sql` - Shop-specific data including:
  - Shop owners and employees
  - Customers
  - Services
  - Departments
  - Opening hours
  - Queues and queue services
  - Payments

### Additional Data (Depends on Core Data)
- `008-seed_poster_templates.sql` - Poster templates for shop displays
- `009-seed_shop_settings.sql` - Shop configuration settings
- `010-seed_notification_settings.sql` - Notification preferences per shop
- `011-seed_promotions.sql` - Promotional campaigns
- `012-seed_rewards.sql` - Reward system items
- `013-seed_customer_points.sql` - Customer loyalty points
- `014-seed_customer_point_transactions.sql` - Point transaction history
- `015-seed_reward_transactions.sql` - Reward redemption transactions
- `016-seed_customer_point_expiry.sql` - Point expiration tracking
- `017-seed_promotion_services.sql` - Links promotions to services
- `018-seed_promotion_usage_logs.sql` - Promotion usage tracking
- `019-seed_shop_activity_log.sql` - Shop activity history
- `020-seed_payment_items.sql` - Detailed payment line items
- `021-seed_category_shops.sql` - Links shops to categories

### Master File
- `000-master_seed.sql` - Executes all seed files in correct dependency order

## Key Features

### Reward System Implementation
The seed data includes a complete reward system where:
1. Customers earn points through `customer_point_transactions` (type: 'earned')
2. Customers redeem points through `customer_point_transactions` (type: 'redeemed')
3. Reward redemptions are tracked in `reward_transactions` table
4. Points have expiration dates tracked in `customer_point_expiry`

### Realistic Data Relationships
- All foreign key relationships are properly maintained
- Data includes realistic Thai business names and descriptions
- Multiple membership tiers (bronze, silver, gold, platinum)
- Various service categories (haircut, beauty, repair, restaurant, spa, tailor)
- Different queue statuses and priorities
- Multiple payment methods and statuses

### Business Logic
- Shops have realistic opening hours
- Services have appropriate pricing and duration
- Customers have varied point balances and membership levels
- Promotions have proper date ranges and conditions
- Activity logs track important business events

## Usage

### Run All Seeds
```sql
\i 000-master_seed.sql
```

### Run Individual Seeds
Execute files in dependency order, starting with `001-init_seed.sql`

## Database Schema Coverage

This seed data covers all tables in the Shop Queue schema:
- ✅ categories
- ✅ shops
- ✅ category_shops
- ✅ customers
- ✅ shop_opening_hours
- ✅ services
- ✅ departments
- ✅ employees
- ✅ queues
- ✅ queue_services
- ✅ payments
- ✅ payment_items
- ✅ promotions
- ✅ promotion_services
- ✅ promotion_usage_logs
- ✅ poster_templates
- ✅ customer_points
- ✅ customer_point_transactions
- ✅ customer_point_expiry
- ✅ rewards
- ✅ reward_transactions
- ✅ shop_settings
- ✅ notification_settings
- ✅ shop_activity_log

## Notes

- All seed data uses Thai language for realistic business scenarios
- UUIDs are used consistently for all primary keys
- Timestamps are varied to simulate realistic business activity
- Random data generation ensures variety in testing scenarios
- All enum values are properly utilized across different records
