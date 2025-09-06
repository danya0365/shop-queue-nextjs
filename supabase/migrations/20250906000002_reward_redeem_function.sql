CREATE OR REPLACE FUNCTION redeem_customer_reward(
    p_shop_id UUID,
    p_customer_id UUID,
    p_reward_id UUID,
    p_redemption_type redemption_type DEFAULT 'points_redemption',
    p_source_description TEXT DEFAULT NULL,
    p_employee_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_customer_points_record customer_points%ROWTYPE;
    v_reward_record rewards%ROWTYPE;
    v_redemption_code TEXT;
    v_expires_at TIMESTAMP WITH TIME ZONE;
    v_point_transaction_id UUID;
    v_redemption_id UUID;
    v_error_message TEXT;
BEGIN
    -- 1. ตรวจสอบว่ารางวัลยังมีอยู่และพร้อมใช้งาน
    SELECT * INTO v_reward_record
    FROM rewards 
    WHERE id = p_reward_id 
      AND shop_id = p_shop_id 
      AND is_available = true;
      
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Reward not found or not available'
        );
    END IF;

    -- 2. ตรวจสอบ usage_limit ของรางวัล
    IF v_reward_record.usage_limit IS NOT NULL THEN
        DECLARE
            v_used_count INTEGER;
        BEGIN
            SELECT COUNT(*) INTO v_used_count
            FROM customer_reward_redemptions
            WHERE reward_id = p_reward_id 
              AND status IN ('active', 'used');
              
            IF v_used_count >= v_reward_record.usage_limit THEN
                RETURN json_build_object(
                    'success', false,
                    'error', 'Reward usage limit exceeded'
                );
            END IF;
        END;
    END IF;

    -- 3. ตรวจสอบและจัดการคะแนนลูกค้า (สำหรับการแลกแบบใช้คะแนน)
    IF p_redemption_type = 'points_redemption' THEN
        -- ดึงข้อมูลคะแนนลูกค้า
        SELECT * INTO v_customer_points_record
        FROM customer_points 
        WHERE shop_id = p_shop_id 
          AND customer_id = p_customer_id;
          
        IF NOT FOUND THEN
            RETURN json_build_object(
                'success', false,
                'error', 'Customer points record not found'
            );
        END IF;

        -- ตรวจสอบคะแนนเพียงพอ
        IF v_customer_points_record.current_points < v_reward_record.points_required THEN
            RETURN json_build_object(
                'success', false,
                'error', 'Insufficient points',
                'required_points', v_reward_record.points_required,
                'current_points', v_customer_points_record.current_points
            );
        END IF;

        -- อัปเดตคะแนนลูกค้า
        UPDATE customer_points 
        SET 
            current_points = current_points - v_reward_record.points_required,
            total_redeemed = total_redeemed + v_reward_record.points_required,
            updated_at = NOW()
        WHERE id = v_customer_points_record.id;

        -- สร้าง transaction การหักคะแนน
        INSERT INTO customer_point_transactions (
            customer_point_id,
            type,
            points,
            description,
            metadata,
            transaction_date
        ) VALUES (
            v_customer_points_record.id,
            'redeemed',
            -v_reward_record.points_required,
            'Points redeemed for reward: ' || v_reward_record.name,
            json_build_object(
                'reward_id', p_reward_id,
                'reward_name', v_reward_record.name,
                'redemption_type', p_redemption_type
            ),
            NOW()
        ) RETURNING id INTO v_point_transaction_id;
    END IF;

    -- 4. สร้างรหัสแลกรางวัล (Redemption Code) แบบป้องกัน duplicate
    DECLARE
        v_attempt INTEGER := 0;
        v_max_attempts INTEGER := 5;
        v_code_exists BOOLEAN := true;
    BEGIN
        -- ลอง generate code สูงสุด 5 ครั้ง
        WHILE v_code_exists AND v_attempt < v_max_attempts LOOP
            v_attempt := v_attempt + 1;
            
            -- สร้างรหัสใหม่ (เพิ่ม microsecond และ random)
            v_redemption_code := 'RW' || TO_CHAR(NOW(), 'YYMMDD') || 
                               LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0') ||
                               LPAD(EXTRACT(MICROSECONDS FROM NOW())::INTEGER::TEXT, 6, '0');
            
            -- เช็คว่ามีรหัสนี้อยู่แล้วหรือไม่
            SELECT EXISTS(
                SELECT 1 FROM customer_reward_redemptions 
                WHERE redemption_code = v_redemption_code
            ) INTO v_code_exists;
        END LOOP;
        
        -- ถ้าลองแล้ว 5 ครั้งยังซ้ำอยู่ ให้ใช้ UUID
        IF v_code_exists THEN
            v_redemption_code := 'RW' || REPLACE(uuid_generate_v4()::TEXT, '-', '');
        END IF;
    END;

    -- 5. คำนวณวันหมดอายุ
    IF v_reward_record.expiry_days IS NOT NULL AND v_reward_record.expiry_days > 0 THEN
        -- ถ้ามีกำหนดวันหมดอายุ (มากกว่า 0)
        v_expires_at := NOW() + INTERVAL '1 day' * v_reward_record.expiry_days;
    ELSE
        -- ถ้า expiry_days เป็น NULL หรือ 0 = ไม่มีหมดอายุ
        v_expires_at := NULL;
    END IF;

    -- 6. Insert ข้อมูลการแลกรางวัล
    INSERT INTO customer_reward_redemptions (
        shop_id,
        customer_id,
        reward_id,
        customer_point_transaction_id,
        redemption_code,
        redemption_type,
        source_description,
        points_used,
        reward_value,
        status,
        issued_at,
        expires_at,
        notes,
        metadata
    ) VALUES (
        p_shop_id,
        p_customer_id,
        p_reward_id,
        v_point_transaction_id,
        v_redemption_code,
        p_redemption_type,
        p_source_description,
        CASE WHEN p_redemption_type = 'points_redemption' 
             THEN v_reward_record.points_required 
             ELSE 0 END,
        v_reward_record.value,
        'active',
        NOW(),
        v_expires_at,
        CASE WHEN p_employee_id IS NOT NULL 
             THEN 'Issued by employee ID: ' || p_employee_id::TEXT 
             ELSE NULL END,
        json_build_object(
            'issued_by_employee_id', p_employee_id,
            'reward_type', v_reward_record.type,
            'original_points_required', v_reward_record.points_required
        )
    ) RETURNING id INTO v_redemption_id;

    -- 7. บันทึก Activity Log
    INSERT INTO shop_activity_log (
        shop_id,
        type,
        title,
        description,
        metadata
    ) VALUES (
        p_shop_id,
        'reward_claimed',
        'Customer redeemed reward',
        'Customer ' || p_customer_id::TEXT || ' redeemed reward: ' || v_reward_record.name,
        json_build_object(
            'customer_id', p_customer_id,
            'reward_id', p_reward_id,
            'redemption_id', v_redemption_id,
            'redemption_code', v_redemption_code,
            'redemption_type', p_redemption_type,
            'points_used', CASE WHEN p_redemption_type = 'points_redemption' 
                              THEN v_reward_record.points_required 
                              ELSE 0 END,
            'reward_value', v_reward_record.value
        )
    );

    -- 8. Return ผลลัพธ์สำเร็จ
    RETURN json_build_object(
        'success', true,
        'data', json_build_object(
            'redemption_id', v_redemption_id,
            'redemption_code', v_redemption_code,
            'reward_name', v_reward_record.name,
            'reward_value', v_reward_record.value,
            'points_used', CASE WHEN p_redemption_type = 'points_redemption' 
                              THEN v_reward_record.points_required 
                              ELSE 0 END,
            'expires_at', v_expires_at,
            'remaining_points', CASE WHEN p_redemption_type = 'points_redemption' 
                                   THEN v_customer_points_record.current_points - v_reward_record.points_required
                                   ELSE v_customer_points_record.current_points END
        )
    );

EXCEPTION
    WHEN OTHERS THEN
        -- จัดการ Error
        GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
        RETURN json_build_object(
            'success', false,
            'error', 'Database error occurred',
            'details', v_error_message
        );
END;
$$;