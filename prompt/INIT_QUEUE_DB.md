# 🏪 Shop Queue Management System

## 📋 Database Schema Documentation

### 🏬 Shops Table
```sql
CREATE TABLE shops (
    id UUID PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES profiles(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    qr_code_url TEXT,  -- สำหรับสแกนคิว/สมัครสมาชิก
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 👥 Local Users Table
```sql
CREATE TABLE local_users (
    id UUID PRIMARY KEY,
    shop_id UUID NOT NULL REFERENCES shops(id),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_shop_user UNIQUE (shop_id, id)  -- local_user ไม่ซ้ำกันในแต่ละร้าน
);
```

### 🚶 Queues Table
```sql
CREATE TYPE queue_status AS ENUM ('waiting', 'confirmed', 'served', 'canceled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid');

CREATE TABLE queues (
    id UUID PRIMARY KEY,
    shop_id UUID NOT NULL REFERENCES shops(id),
    local_user_id UUID NOT NULL REFERENCES local_users(id),
    queue_number INTEGER NOT NULL,
    status queue_status NOT NULL,
    note TEXT,
    payment_status payment_status NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 💡 Queue Notes Suggestions Table
```sql
CREATE TABLE queue_notes_suggestions (
    id UUID PRIMARY KEY,
    shop_id UUID NOT NULL REFERENCES shops(id),
    suggestion_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 🎫 Loyalty Points Table
```sql
CREATE TABLE loyalty_points (
    id UUID PRIMARY KEY,
    shop_id UUID NOT NULL REFERENCES shops(id),
    profile_id UUID NOT NULL REFERENCES profiles(id),
    points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 🏷️ Promotions Table
```sql
CREATE TABLE promotions (
    id UUID PRIMARY KEY,
    shop_id UUID NOT NULL REFERENCES shops(id),
    description TEXT NOT NULL,
    condition TEXT NOT NULL,  -- e.g., "spend 10 baht = 1 point"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🔑 Key Features

- **Shops Management**: Store shop information and owner details
- **Local Users**: Manage customers with optional profile linking
- **Queue System**: Track customer queues with status updates
- **Payment Tracking**: Monitor payment status and amounts
- **Loyalty Program**: Implement points-based rewards system
- **Promotions**: Define custom promotion conditions

## 🛠️ Technical Notes

- All tables include `created_at` and `updated_at` timestamps
- UUIDs are used for all primary and foreign keys
- Appropriate indexes should be added for frequently queried columns
- Consider adding triggers for `updated_at` auto-update functionality
