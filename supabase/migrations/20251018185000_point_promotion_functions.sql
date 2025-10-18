-- =====================================================================
-- FUNCTION: คำนวณคะแนนจากโปรโมชั่น
-- =====================================================================

CREATE OR REPLACE FUNCTION public.calculate_points_from_promotions(
    p_queue_id UUID,
    p_payment_amount DECIMAL DEFAULT NULL
)
RETURNS TABLE(
    total_points INTEGER,
    applied_promotions JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_shop_id UUID;
    v_customer_id UUID;
    v_customer_tier membership_tier;
    v_customer_profile_id UUID;
    v_customer_birthdate DATE;
    v_service_ids UUID[];
    v_queue_created_at TIMESTAMPTZ;
    v_base_points INTEGER := 0;
    v_total_points INTEGER := 0;
    v_promotion RECORD;
    v_promotion_details JSONB := '[]'::jsonb;
    v_points_per_baht INTEGER;
    v_conditions JSONB;
    v_eligibility JSONB;
    v_points_config JSONB;
    v_customer_visits INTEGER;
    v_is_birthday_month BOOLEAN := false;
BEGIN
    -- ดึงข้อมูลคิวและลูกค้า
    SELECT 
        q.shop_id, 
        q.customer_id, 
        q.created_at,
        cp.membership_tier,
        c.profile_id,
        c.date_of_birth
    INTO 
        v_shop_id, 
        v_customer_id, 
        v_queue_created_at,
        v_customer_tier,
        v_customer_profile_id,
        v_customer_birthdate
    FROM queues q
    LEFT JOIN customers c ON c.id = q.customer_id
    LEFT JOIN customer_points cp ON cp.customer_id = q.customer_id
    WHERE q.id = p_queue_id;
    
    IF v_shop_id IS NULL THEN
        RAISE EXCEPTION 'queue_not_found: %', p_queue_id;
    END IF;
    
    -- เช็คว่าเป็นเดือนเกิดหรือไม่
    IF v_customer_birthdate IS NOT NULL THEN
        v_is_birthday_month := EXTRACT(MONTH FROM v_customer_birthdate) = EXTRACT(MONTH FROM NOW());
    ELSE
        v_is_birthday_month := false;
    END IF;
    
    -- ดึง service_ids ที่ใช้
    SELECT ARRAY_AGG(service_id)
    INTO v_service_ids
    FROM queue_services
    WHERE queue_id = p_queue_id;
    
    -- คำนวณจำนวนครั้งที่มาใช้บริการใน 30 วันที่ผ่านมา
    SELECT COUNT(*)
    INTO v_customer_visits
    FROM queues
    WHERE customer_id = v_customer_id
    AND shop_id = v_shop_id
    AND status = 'completed'
    AND created_at >= NOW() - INTERVAL '30 days';
    
    -- ดึง points_per_baht จาก shop_settings
    SELECT COALESCE(points_per_baht, 1)
    INTO v_points_per_baht
    FROM shop_settings
    WHERE shop_id = v_shop_id
    LIMIT 1;
    
    -- คำนวณคะแนนพื้นฐาน (ถ้ามี payment_amount)
    IF p_payment_amount IS NOT NULL AND p_payment_amount > 0 THEN
        v_base_points := FLOOR(p_payment_amount * v_points_per_baht);
        v_total_points := v_base_points;
    END IF;
    
    -- วนลูปหาโปรโมชั่นที่เกี่ยวกับคะแนนและ active
    FOR v_promotion IN
        SELECT 
            p.id,
            p.name,
            p.type,
            p.value,
            p.conditions,
            p.min_purchase_amount,
            p.max_discount_amount,
            p.usage_limit
        FROM promotions p
        WHERE p.shop_id = v_shop_id
        AND p.status = 'active'
        AND p.type IN ('points_multiplier', 'bonus_points', 'points_cashback')
        AND p.start_at <= NOW()
        AND p.end_at >= NOW()
        ORDER BY 
            CASE 
                WHEN p.type = 'points_multiplier' THEN 1
                WHEN p.type = 'bonus_points' THEN 2
                WHEN p.type = 'points_cashback' THEN 3
            END
    LOOP
        v_conditions := COALESCE(v_promotion.conditions, '{}'::jsonb);
        v_eligibility := v_conditions->'eligibility';
        v_points_config := v_conditions->'points_config';
        
        -- ============================================================
        -- ตรวจสอบเงื่อนไขความเหมาะสม (Eligibility Checks)
        -- ============================================================
        
        -- 1. ตรวจสอบยอดซื้อขั้นต่ำ
        IF v_eligibility ? 'min_purchase_amount' THEN
            IF p_payment_amount IS NULL OR 
               p_payment_amount < (v_eligibility->>'min_purchase_amount')::DECIMAL THEN
                CONTINUE;
            END IF;
        END IF;
        
        -- 2. ตรวจสอบจำนวนบริการขั้นต่ำ
        IF v_eligibility ? 'min_services' THEN
            IF COALESCE(array_length(v_service_ids, 1), 0) < 
               (v_eligibility->>'min_services')::INTEGER THEN
                CONTINUE;
            END IF;
        END IF;
        
        -- 3. ตรวจสอบบริการเฉพาะ
        IF v_eligibility ? 'specific_services' AND 
           jsonb_array_length(v_eligibility->'specific_services') > 0 THEN
            IF NOT EXISTS (
                SELECT 1 
                FROM jsonb_array_elements_text(v_eligibility->'specific_services') AS service_id
                WHERE service_id::UUID = ANY(v_service_ids)
            ) THEN
                CONTINUE;
            END IF;
        END IF;
        
        -- 4. ตรวจสอบ tier ลูกค้า
        IF v_eligibility ? 'customer_tiers' AND 
           jsonb_array_length(v_eligibility->'customer_tiers') > 0 THEN
            IF NOT EXISTS (
                SELECT 1 
                FROM jsonb_array_elements_text(v_eligibility->'customer_tiers') AS tier
                WHERE tier = v_customer_tier::TEXT
            ) THEN
                CONTINUE;
            END IF;
        END IF;
        
        -- 5. ตรวจสอบวันในสัปดาห์
        IF v_eligibility ? 'days_of_week' AND 
           jsonb_array_length(v_eligibility->'days_of_week') > 0 THEN
            IF NOT EXISTS (
                SELECT 1 
                FROM jsonb_array_elements_text(v_eligibility->'days_of_week') AS day
                WHERE LOWER(day) = LOWER(TO_CHAR(v_queue_created_at, 'Day'))
            ) THEN
                CONTINUE;
            END IF;
        END IF;
        
        -- 6. ตรวจสอบช่วงเวลา
        IF v_eligibility ? 'time_range' THEN
            DECLARE
                v_start_time TIME := (v_eligibility->'time_range'->>'start')::TIME;
                v_end_time TIME := (v_eligibility->'time_range'->>'end')::TIME;
                v_queue_time TIME := v_queue_created_at::TIME;
            BEGIN
                IF v_queue_time < v_start_time OR v_queue_time > v_end_time THEN
                    CONTINUE;
                END IF;
            END;
        END IF;
        
        -- 7. ตรวจสอบจำนวนครั้งที่มาใช้บริการ
        IF v_eligibility ? 'min_visits_in_period' THEN
            DECLARE
                v_required_visits INTEGER := (v_eligibility->'min_visits_in_period'->>'visits')::INTEGER;
            BEGIN
                IF v_customer_visits < v_required_visits THEN
                    CONTINUE;
                END IF;
            END;
        END IF;
        
        -- 8. ตรวจสอบ usage limit
        IF v_promotion.usage_limit IS NOT NULL THEN
            DECLARE
                v_usage_count INTEGER;
            BEGIN
                SELECT COUNT(*) INTO v_usage_count
                FROM promotion_usage_logs
                WHERE promotion_id = v_promotion.id;
                
                IF v_usage_count >= v_promotion.usage_limit THEN
                    CONTINUE;
                END IF;
            END;
        END IF;
        
        -- ============================================================
        -- คำนวณคะแนนตามประเภทโปรโมชั่น
        -- ============================================================
        
        DECLARE
            v_promotion_points INTEGER := 0;
            v_calculated_points INTEGER := 0;
        BEGIN
            CASE v_promotion.type
                -- คูณคะแนน (x2, x3, etc.)
                WHEN 'points_multiplier' THEN
                    v_calculated_points := FLOOR(v_total_points * v_promotion.value);
                    v_promotion_points := v_calculated_points - v_total_points;
                    v_total_points := v_calculated_points;
                
                -- คะแนนโบนัสคงที่
                WHEN 'bonus_points' THEN
                    v_promotion_points := v_promotion.value::INTEGER;
                    v_total_points := v_total_points + v_promotion_points;
                
                -- คืนคะแนนตามเปอร์เซ็นต์
                WHEN 'points_cashback' THEN
                    IF p_payment_amount IS NOT NULL THEN
                        v_promotion_points := FLOOR(p_payment_amount * v_promotion.value / 100);
                        v_total_points := v_total_points + v_promotion_points;
                    END IF;
            END CASE;
            
            -- ตรวจสอบ max_points_per_transaction
            IF v_points_config ? 'max_points_per_transaction' THEN
                DECLARE
                    v_max_points INTEGER := (v_points_config->>'max_points_per_transaction')::INTEGER;
                BEGIN
                    IF v_promotion_points > v_max_points THEN
                        v_total_points := v_total_points - v_promotion_points + v_max_points;
                        v_promotion_points := v_max_points;
                    END IF;
                END;
            END IF;
            
            -- บันทึกรายละเอียดโปรโมชั่นที่ใช้
            IF v_promotion_points > 0 THEN
                v_promotion_details := v_promotion_details || jsonb_build_object(
                    'promotion_id', v_promotion.id,
                    'promotion_name', v_promotion.name,
                    'promotion_type', v_promotion.type,
                    'points_awarded', v_promotion_points,
                    'calculation_method', CASE 
                        WHEN v_promotion.type = 'points_multiplier' THEN 'multiplier'
                        WHEN v_promotion.type = 'bonus_points' THEN 'fixed'
                        WHEN v_promotion.type = 'points_cashback' THEN 'percentage'
                    END
                );
                
                -- บันทึก usage log
                INSERT INTO promotion_usage_logs (
                    promotion_id,
                    customer_id,
                    queue_id,
                    used_at
                ) VALUES (
                    v_promotion.id,
                    v_customer_id,
                    p_queue_id,
                    NOW()
                );
            END IF;
        END;
    END LOOP;
    
    -- คืนค่าผลลัพธ์
    RETURN QUERY SELECT 
        v_total_points,
        jsonb_build_object(
            'base_points', v_base_points,
            'total_points', v_total_points,
            'payment_amount', p_payment_amount,
            'points_per_baht', v_points_per_baht,
            'promotions_applied', v_promotion_details
        );
END;
$$;

-- =====================================================================
-- FUNCTION: เพิ่มคะแนนอัตโนมัติเมื่อคิวเสร็จสิ้น
-- =====================================================================

CREATE OR REPLACE FUNCTION public.auto_award_points_on_completion()
RETURNS TRIGGER AS $$
DECLARE
    v_payment_amount DECIMAL(10,2);
    v_points_result RECORD;
BEGIN
    -- เช็คว่า status เปลี่ยนเป็น completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- ดึงยอดชำระจาก payments
        SELECT total_amount INTO v_payment_amount
        FROM payments
        WHERE queue_id = NEW.id
        LIMIT 1;
        
        -- คำนวณคะแนนจากโปรโมชั่น
        SELECT * INTO v_points_result
        FROM calculate_points_from_promotions(NEW.id, v_payment_amount);
        
        -- เพิ่มคะแนนให้ลูกค้า (ถ้ามีคะแนน)
        IF v_points_result.total_points > 0 THEN
            -- เรียกใช้ function ที่มีอยู่แล้ว
            PERFORM add_customer_points(
                NEW.customer_id,
                v_points_result.total_points,
                'คะแนนจากการใช้บริการ #' || NEW.queue_number,
                NEW.id
            );
            
            -- อัพเดท metadata ใน queue (optional)
            UPDATE queues
            SET note = COALESCE(note, '') || 
                      E'\n[System] ได้รับคะแนน ' || v_points_result.total_points || ' แต้ม'
            WHERE id = NEW.id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- สร้าง Trigger
DROP TRIGGER IF EXISTS trigger_auto_award_points ON queues;
CREATE TRIGGER trigger_auto_award_points
AFTER UPDATE ON queues
FOR EACH ROW
EXECUTE FUNCTION auto_award_points_on_completion();

-- =====================================================================
-- FUNCTION: ตรวจสอบโปรโมชั่นที่ใช้ได้สำหรับลูกค้า
-- =====================================================================

CREATE OR REPLACE FUNCTION public.get_available_point_promotions(
    p_shop_id UUID,
    p_customer_id UUID DEFAULT NULL,
    p_estimated_amount DECIMAL DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    description TEXT,
    type promotion_type,
    value DECIMAL,
    min_purchase_amount DECIMAL,
    estimated_points INTEGER,
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    conditions JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_customer_tier membership_tier;
BEGIN
    -- ดึง tier ของลูกค้า (ถ้ามี)
    IF p_customer_id IS NOT NULL THEN
        SELECT membership_tier INTO v_customer_tier
        FROM customer_points
        WHERE customer_id = p_customer_id;
    END IF;
    
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.type,
        p.value,
        p.min_purchase_amount,
        -- คำนวณคะแนนโดยประมาณ
        CASE 
            WHEN p.type = 'points_multiplier' THEN
                FLOOR(COALESCE(p_estimated_amount, 0) * p.value)
            WHEN p.type = 'bonus_points' THEN
                p.value::INTEGER
            WHEN p.type = 'points_cashback' THEN
                FLOOR(COALESCE(p_estimated_amount, 0) * p.value / 100)
            ELSE 0
        END AS estimated_points,
        p.start_at,
        p.end_at,
        p.conditions
    FROM promotions p
    WHERE p.shop_id = p_shop_id
    AND p.status = 'active'
    AND p.type IN ('points_multiplier', 'bonus_points', 'points_cashback')
    AND p.start_at <= NOW()
    AND p.end_at >= NOW()
    AND (
        p.min_purchase_amount IS NULL 
        OR p_estimated_amount IS NULL 
        OR p_estimated_amount >= p.min_purchase_amount
    )
    ORDER BY 
        CASE 
            WHEN p.type = 'points_multiplier' THEN 1
            WHEN p.type = 'bonus_points' THEN 2
            ELSE 3
        END,
        p.value DESC;
END;
$$;

