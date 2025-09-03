-- Function to create activity record
CREATE OR REPLACE FUNCTION public.create_shop_activity(
    p_shop_id UUID,
    p_type activity_type,
    p_title TEXT,
    p_description TEXT,
    p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO shop_activity_log (shop_id, type, title, description, metadata)
    VALUES (p_shop_id, p_type, p_title, p_description, p_metadata)
    RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$;

-- Trigger functions to automatically create activities
CREATE OR REPLACE FUNCTION public.trigger_queue_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    customer_name TEXT;
    queue_number TEXT;
    activity_title TEXT;
    activity_description TEXT;
    activity_metadata JSONB;
    employee_name TEXT;
BEGIN
    -- Get customer name and queue number
    SELECT c.name, COALESCE(NEW.queue_number, OLD.queue_number)
    INTO customer_name, queue_number
    FROM customers c 
    WHERE c.id = COALESCE(NEW.customer_id, OLD.customer_id);
    
    -- Get employee name if available
    IF NEW.served_by_employee_id IS NOT NULL THEN
        SELECT e.name INTO employee_name
        FROM employees e 
        WHERE e.id = NEW.served_by_employee_id;
    END IF;
    
    IF TG_OP = 'INSERT' THEN
        -- Queue created
        activity_title := 'มีคิวใหม่';
        activity_description := customer_name || ' เข้าคิวหมายเลข ' || queue_number;
        activity_metadata := jsonb_build_object(
            'queue_id', NEW.id,
            'customer_id', NEW.customer_id,
            'queue_number', queue_number,
            'priority', NEW.priority
        );
        
        PERFORM public.create_shop_activity(
            NEW.shop_id,
            'queue_created',
            activity_title,
            activity_description,
            activity_metadata
        );
        
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        -- Queue status changed
        activity_metadata := jsonb_build_object(
            'queue_id', NEW.id,
            'customer_id', NEW.customer_id,
            'queue_number', queue_number,
            'old_status', OLD.status,
            'new_status', NEW.status,
            'served_by', NEW.served_by_employee_id,
            'employee_name', employee_name
        );
        
        CASE NEW.status
            WHEN 'confirmed' THEN
                activity_title := 'คิวได้รับการยืนยัน';
                activity_description := 'คิวหมายเลข ' || queue_number || ' ของ ' || customer_name || ' ได้รับการยืนยันแล้ว';
                PERFORM public.create_shop_activity(NEW.shop_id, 'queue_confirmed', activity_title, activity_description, activity_metadata);
                
            WHEN 'serving' THEN
                activity_title := 'เริ่มให้บริการ';
                activity_description := 'เริ่มให้บริการคิวหมายเลข ' || queue_number || ' ของ ' || customer_name || 
                    CASE WHEN employee_name IS NOT NULL THEN ' โดย ' || employee_name ELSE '' END;
                PERFORM public.create_shop_activity(NEW.shop_id, 'queue_served', activity_title, activity_description, activity_metadata);
                
            WHEN 'completed' THEN
                activity_title := 'คิวเสร็จสิ้น';
                activity_description := 'คิวหมายเลข ' || queue_number || ' ของ ' || customer_name || ' เสร็จสิ้นแล้ว' ||
                    CASE WHEN employee_name IS NOT NULL THEN ' โดย ' || employee_name ELSE '' END;
                PERFORM public.create_shop_activity(NEW.shop_id, 'queue_completed', activity_title, activity_description, activity_metadata);
                
            WHEN 'cancelled' THEN
                activity_title := 'คิวถูกยกเลิก';
                activity_description := 'คิวหมายเลข ' || queue_number || ' ของ ' || customer_name || ' ถูกยกเลิก' ||
                    CASE WHEN NEW.cancelled_reason IS NOT NULL THEN ' เหตุผล: ' || NEW.cancelled_reason ELSE '' END;
                activity_metadata := activity_metadata || jsonb_build_object('cancelled_reason', NEW.cancelled_reason, 'cancelled_at', NEW.cancelled_at);
                PERFORM public.create_shop_activity(NEW.shop_id, 'queue_cancelled', activity_title, activity_description, activity_metadata);
        END CASE;
        
    ELSIF TG_OP = 'UPDATE' AND (OLD.note != NEW.note OR OLD.priority != NEW.priority OR OLD.estimated_duration != NEW.estimated_duration) THEN
        -- Queue updated (non-status changes)
        activity_title := 'คิวถูกอัปเดต';
        activity_description := 'คิวหมายเลข ' || queue_number || ' ของ ' || customer_name || ' ถูกอัปเดตข้อมูล';
        activity_metadata := jsonb_build_object(
            'queue_id', NEW.id,
            'customer_id', NEW.customer_id,
            'queue_number', queue_number,
            'changes', jsonb_build_object(
                'note_changed', OLD.note != NEW.note,
                'priority_changed', OLD.priority != NEW.priority,
                'duration_changed', OLD.estimated_duration != NEW.estimated_duration
            )
        );
        
        PERFORM public.create_shop_activity(
            NEW.shop_id,
            'queue_updated',
            activity_title,
            activity_description,
            activity_metadata
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger function for customer activities
CREATE OR REPLACE FUNCTION public.trigger_customer_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    activity_title TEXT;
    activity_description TEXT;
    activity_metadata JSONB;
BEGIN
    IF TG_OP = 'INSERT' THEN
        activity_title := 'ลูกค้าใหม่';
        activity_description := NEW.name || ' ลงทะเบียนเป็นลูกค้าใหม่';
        activity_metadata := jsonb_build_object(
            'customer_id', NEW.id,
            'customer_name', NEW.name,
            'phone', NEW.phone,
            'email', NEW.email
        );
        
        PERFORM public.create_shop_activity(
            NEW.shop_id,
            'customer_registered',
            activity_title,
            activity_description,
            activity_metadata
        );
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Customer updated
        activity_title := 'ข้อมูลลูกค้าถูกอัปเดต';
        activity_description := 'ข้อมูลของ ' || NEW.name || ' ถูกอัปเดต';
        activity_metadata := jsonb_build_object(
            'customer_id', NEW.id,
            'customer_name', NEW.name,
            'changes', jsonb_build_object(
                'name_changed', OLD.name != NEW.name,
                'phone_changed', OLD.phone != NEW.phone,
                'email_changed', OLD.email != NEW.email,
                'status_changed', OLD.is_active != NEW.is_active
            )
        );
        
        PERFORM public.create_shop_activity(
            NEW.shop_id,
            'customer_updated',
            activity_title,
            activity_description,
            activity_metadata
        );
        
        -- Customer visit tracking
        IF OLD.last_visit != NEW.last_visit AND NEW.last_visit IS NOT NULL THEN
            activity_title := 'ลูกค้าเข้าใช้บริการ';
            activity_description := NEW.name || ' เข้าใช้บริการร้าน';
            activity_metadata := jsonb_build_object(
                'customer_id', NEW.id,
                'customer_name', NEW.name,
                'visit_time', NEW.last_visit
            );
            
            PERFORM public.create_shop_activity(
                NEW.shop_id,
                'customer_visit',
                activity_title,
                activity_description,
                activity_metadata
            );
        END IF;
        
    ELSIF TG_OP = 'DELETE' THEN
        activity_title := 'ลูกค้าถูกลบ';
        activity_description := 'ลูกค้า ' || OLD.name || ' ถูกลบออกจากระบบ';
        activity_metadata := jsonb_build_object(
            'customer_id', OLD.id,
            'customer_name', OLD.name,
            'phone', OLD.phone,
            'email', OLD.email
        );
        
        PERFORM public.create_shop_activity(
            OLD.shop_id,
            'customer_deleted',
            activity_title,
            activity_description,
            activity_metadata
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger function for shop activities
CREATE OR REPLACE FUNCTION public.trigger_shop_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    activity_title TEXT;
    activity_description TEXT;
    activity_metadata JSONB;
BEGIN
    IF TG_OP = 'INSERT' THEN
        activity_title := 'ร้านค้าใหม่';
        activity_description := 'ร้าน ' || NEW.name || ' ถูกสร้างขึ้นใหม่';
        activity_metadata := jsonb_build_object(
            'shop_id', NEW.id,
            'shop_name', NEW.name,
            'owner_id', NEW.owner_id,
            'status', NEW.status
        );
        
        PERFORM public.create_shop_activity(
            NEW.id,
            'shop_created',
            activity_title,
            activity_description,
            activity_metadata
        );
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Shop status changed
        IF OLD.status != NEW.status THEN
            activity_title := 'สถานะร้านเปลี่ยนแปลง';
            activity_description := 'สถานะร้าน ' || NEW.name || ' เปลี่ยนจาก ' || OLD.status || ' เป็น ' || NEW.status;
            activity_metadata := jsonb_build_object(
                'shop_id', NEW.id,
                'shop_name', NEW.name,
                'old_status', OLD.status,
                'new_status', NEW.status
            );
            
            PERFORM public.create_shop_activity(
                NEW.id,
                'shop_status_changed',
                activity_title,
                activity_description,
                activity_metadata
            );
        END IF;
        
        -- Shop information updated
        IF OLD.name != NEW.name OR OLD.description != NEW.description OR OLD.address != NEW.address OR 
           OLD.phone != NEW.phone OR OLD.email != NEW.email THEN
            activity_title := 'ข้อมูลร้านถูกอัปเดต';
            activity_description := 'ข้อมูลร้าน ' || NEW.name || ' ถูกอัปเดต';
            activity_metadata := jsonb_build_object(
                'shop_id', NEW.id,
                'shop_name', NEW.name,
                'changes', jsonb_build_object(
                    'name_changed', OLD.name != NEW.name,
                    'description_changed', OLD.description != NEW.description,
                    'address_changed', OLD.address != NEW.address,
                    'phone_changed', OLD.phone != NEW.phone,
                    'email_changed', OLD.email != NEW.email
                )
            );
            
            PERFORM public.create_shop_activity(
                NEW.id,
                'shop_updated',
                activity_title,
                activity_description,
                activity_metadata
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger function for employee activities
CREATE OR REPLACE FUNCTION public.trigger_employee_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    activity_title TEXT;
    activity_description TEXT;
    activity_metadata JSONB;
    shop_name TEXT;
BEGIN
    -- Get shop name
    SELECT s.name INTO shop_name
    FROM shops s 
    WHERE s.id = COALESCE(NEW.shop_id, OLD.shop_id);
    
    IF TG_OP = 'INSERT' THEN
        activity_title := 'พนักงานใหม่';
        activity_description := NEW.name || ' เข้าร่วมทีมงาน';
        activity_metadata := jsonb_build_object(
            'employee_id', NEW.id,
            'employee_name', NEW.name,
            'position', NEW.position_text,
            'department_id', NEW.department_id
        );
        
        PERFORM public.create_shop_activity(
            NEW.shop_id,
            'employee_added',
            activity_title,
            activity_description,
            activity_metadata
        );
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Employee status changed
        IF OLD.status != NEW.status THEN
            activity_title := 'สถานะพนักงานเปลี่ยนแปลง';
            activity_description := 'สถานะของ ' || NEW.name || ' เปลี่ยนจาก ' || OLD.status || ' เป็น ' || NEW.status;
            activity_metadata := jsonb_build_object(
                'employee_id', NEW.id,
                'employee_name', NEW.name,
                'old_status', OLD.status,
                'new_status', NEW.status
            );
            
            PERFORM public.create_shop_activity(
                NEW.shop_id,
                'employee_updated',
                activity_title,
                activity_description,
                activity_metadata
            );
        END IF;
        
        -- Employee duty status changed
        IF OLD.is_on_duty != NEW.is_on_duty THEN
            IF NEW.is_on_duty THEN
                activity_title := 'พนักงานเข้าเวร';
                activity_description := NEW.name || ' เข้าเวรทำงาน';
                PERFORM public.create_shop_activity(NEW.shop_id, 'employee_duty_start', activity_title, activity_description, 
                    jsonb_build_object('employee_id', NEW.id, 'employee_name', NEW.name));
            ELSE
                activity_title := 'พนักงานออกเวร';
                activity_description := NEW.name || ' ออกจากเวรทำงาน';
                PERFORM public.create_shop_activity(NEW.shop_id, 'employee_duty_end', activity_title, activity_description,
                    jsonb_build_object('employee_id', NEW.id, 'employee_name', NEW.name));
            END IF;
        END IF;
        
        -- Employee login tracking
        IF OLD.last_login != NEW.last_login AND NEW.last_login IS NOT NULL THEN
            activity_title := 'พนักงานเข้าสู่ระบบ';
            activity_description := NEW.name || ' เข้าสู่ระบบ';
            activity_metadata := jsonb_build_object(
                'employee_id', NEW.id,
                'employee_name', NEW.name,
                'login_time', NEW.last_login
            );
            
            PERFORM public.create_shop_activity(
                NEW.shop_id,
                'employee_login',
                activity_title,
                activity_description,
                activity_metadata
            );
        END IF;
        
    ELSIF TG_OP = 'DELETE' THEN
        activity_title := 'พนักงานออกจากทีม';
        activity_description := OLD.name || ' ออกจากทีมงาน';
        activity_metadata := jsonb_build_object(
            'employee_id', OLD.id,
            'employee_name', OLD.name,
            'position', OLD.position_text
        );
        
        PERFORM public.create_shop_activity(
            OLD.shop_id,
            'employee_removed',
            activity_title,
            activity_description,
            activity_metadata
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger function for service activities
CREATE OR REPLACE FUNCTION public.trigger_service_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    activity_title TEXT;
    activity_description TEXT;
    activity_metadata JSONB;
BEGIN
    IF TG_OP = 'INSERT' THEN
        activity_title := 'บริการใหม่';
        activity_description := 'เพิ่มบริการ ' || NEW.name || ' ราคา ' || NEW.price || ' บาท';
        activity_metadata := jsonb_build_object(
            'service_id', NEW.id,
            'service_name', NEW.name,
            'price', NEW.price,
            'category', NEW.category
        );
        
        PERFORM public.create_shop_activity(
            NEW.shop_id,
            'service_added',
            activity_title,
            activity_description,
            activity_metadata
        );
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Service availability changed
        IF OLD.is_available != NEW.is_available THEN
            activity_title := CASE WHEN NEW.is_available THEN 'เปิดให้บริการ' ELSE 'ปิดให้บริการ' END;
            activity_description := activity_title || ' ' || NEW.name;
            activity_metadata := jsonb_build_object(
                'service_id', NEW.id,
                'service_name', NEW.name,
                'is_available', NEW.is_available
            );
            
            PERFORM public.create_shop_activity(
                NEW.shop_id,
                'service_availability_changed',
                activity_title,
                activity_description,
                activity_metadata
            );
        END IF;
        
        -- Service information updated
        IF OLD.name != NEW.name OR OLD.price != NEW.price OR OLD.description != NEW.description THEN
            activity_title := 'บริการถูกอัปเดต';
            activity_description := 'บริการ ' || NEW.name || ' ถูกอัปเดตข้อมูล';
            activity_metadata := jsonb_build_object(
                'service_id', NEW.id,
                'service_name', NEW.name,
                'changes', jsonb_build_object(
                    'name_changed', OLD.name != NEW.name,
                    'price_changed', OLD.price != NEW.price,
                    'description_changed', OLD.description != NEW.description
                )
            );
            
            PERFORM public.create_shop_activity(
                NEW.shop_id,
                'service_updated',
                activity_title,
                activity_description,
                activity_metadata
            );
        END IF;
        
    ELSIF TG_OP = 'DELETE' THEN
        activity_title := 'บริการถูกลบ';
        activity_description := 'บริการ ' || OLD.name || ' ถูกลบออกจากระบบ';
        activity_metadata := jsonb_build_object(
            'service_id', OLD.id,
            'service_name', OLD.name,
            'price', OLD.price
        );
        
        PERFORM public.create_shop_activity(
            OLD.shop_id,
            'service_removed',
            activity_title,
            activity_description,
            activity_metadata
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger function for payment activities
CREATE OR REPLACE FUNCTION public.trigger_payment_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    activity_title TEXT;
    activity_description TEXT;
    activity_metadata JSONB;
    customer_name TEXT;
    queue_number TEXT;
    shop_id_val UUID;
BEGIN
    -- Get customer and queue information
    SELECT c.name, q.queue_number, q.shop_id
    INTO customer_name, queue_number, shop_id_val
    FROM queues q
    JOIN customers c ON c.id = q.customer_id
    WHERE q.id = COALESCE(NEW.queue_id, OLD.queue_id);
    
    IF TG_OP = 'INSERT' THEN
        activity_title := 'สร้างใบเสร็จ';
        activity_description := 'สร้างใบเสร็จสำหรับคิว ' || queue_number || ' ของ ' || customer_name || 
                               ' จำนวน ' || NEW.total_amount || ' บาท';
        activity_metadata := jsonb_build_object(
            'payment_id', NEW.id,
            'queue_id', NEW.queue_id,
            'customer_name', customer_name,
            'queue_number', queue_number,
            'total_amount', NEW.total_amount,
            'payment_method', NEW.payment_method
        );
        
        PERFORM public.create_shop_activity(
            shop_id_val,
            'payment_created',
            activity_title,
            activity_description,
            activity_metadata
        );
        
    ELSIF TG_OP = 'UPDATE' AND OLD.payment_status != NEW.payment_status THEN
        activity_metadata := jsonb_build_object(
            'payment_id', NEW.id,
            'queue_id', NEW.queue_id,
            'customer_name', customer_name,
            'queue_number', queue_number,
            'total_amount', NEW.total_amount,
            'paid_amount', NEW.paid_amount,
            'old_status', OLD.payment_status,
            'new_status', NEW.payment_status
        );
        
        CASE NEW.payment_status
            WHEN 'paid' THEN
                activity_title := 'ชำระเงินเสร็จสิ้น';
                activity_description := 'ชำระเงินเสร็จสิ้นสำหรับคิว ' || queue_number || ' ของ ' || customer_name;
                PERFORM public.create_shop_activity(shop_id_val, 'payment_completed', activity_title, activity_description, activity_metadata);
            ELSE
                activity_title := 'สถานะการชำระเงินเปลี่ยนแปลง';
                activity_description := 'สถานะการชำระเงินคิว ' || queue_number || ' เปลี่ยนเป็น ' || NEW.payment_status;
                PERFORM public.create_shop_activity(shop_id_val, 'payment_updated', activity_title, activity_description, activity_metadata);
        END CASE;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger function for promotion activities
CREATE OR REPLACE FUNCTION public.trigger_promotion_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    activity_title TEXT;
    activity_description TEXT;
    activity_metadata JSONB;
BEGIN
    IF TG_OP = 'INSERT' THEN
        activity_title := 'โปรโมชั่นใหม่';
        activity_description := 'สร้างโปรโมชั่น ' || NEW.name || ' ลดราคา ' || NEW.value || 
                               CASE WHEN NEW.type = 'percentage' THEN '%' ELSE ' บาท' END;
        activity_metadata := jsonb_build_object(
            'promotion_id', NEW.id,
            'promotion_name', NEW.name,
            'type', NEW.type,
            'value', NEW.value,
            'start_date', NEW.start_date,
            'end_date', NEW.end_date
        );
        
        PERFORM public.create_shop_activity(
            NEW.shop_id,
            'promotion_created',
            activity_title,
            activity_description,
            activity_metadata
        );
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Promotion status changed
        IF OLD.status != NEW.status THEN
            activity_title := CASE NEW.status
                WHEN 'active' THEN 'เปิดใช้โปรโมชั่น'
                WHEN 'inactive' THEN 'ปิดใช้โปรโมชั่น'
                WHEN 'expired' THEN 'โปรโมชั่นหมดอายุ'
                ELSE 'สถานะโปรโมชั่นเปลี่ยนแปลง'
            END;
            activity_description := activity_title || ' ' || NEW.name;
            activity_metadata := jsonb_build_object(
                'promotion_id', NEW.id,
                'promotion_name', NEW.name,
                'old_status', OLD.status,
                'new_status', NEW.status
            );
            
            CASE NEW.status
                WHEN 'active' THEN
                    PERFORM public.create_shop_activity(NEW.shop_id, 'promotion_activated', activity_title, activity_description, activity_metadata);
                WHEN 'inactive' THEN
                    PERFORM public.create_shop_activity(NEW.shop_id, 'promotion_deactivated', activity_title, activity_description, activity_metadata);
                ELSE
                    PERFORM public.create_shop_activity(NEW.shop_id, 'promotion_updated', activity_title, activity_description, activity_metadata);
            END CASE;
        END IF;
        
        -- Promotion usage tracking
        IF OLD.used_count != NEW.used_count THEN
            activity_title := 'ใช้โปรโมชั่น';
            activity_description := 'มีการใช้โปรโมชั่น ' || NEW.name || ' (' || NEW.used_count || '/' || 
                                   COALESCE(NEW.usage_limit::TEXT, '∞') || ')';
            activity_metadata := jsonb_build_object(
                'promotion_id', NEW.id,
                'promotion_name', NEW.name,
                'used_count', NEW.used_count,
                'usage_limit', NEW.usage_limit
            );
            
            PERFORM public.create_shop_activity(
                NEW.shop_id,
                'promotion_used',
                activity_title,
                activity_description,
                activity_metadata
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger function for shop settings activities
CREATE OR REPLACE FUNCTION public.trigger_shop_settings_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    activity_title TEXT;
    activity_description TEXT;
    activity_metadata JSONB;
    shop_name TEXT;
BEGIN
    -- Get shop name
    SELECT s.name INTO shop_name
    FROM shops s 
    WHERE s.id = NEW.shop_id;
    
    IF TG_OP = 'UPDATE' THEN
        activity_title := 'การตั้งค่าร้านถูกอัปเดต';
        activity_description := 'การตั้งค่าของร้าน ' || shop_name || ' ถูกอัปเดต';
        activity_metadata := jsonb_build_object(
            'shop_id', NEW.shop_id,
            'shop_name', shop_name,
            'changes', jsonb_build_object(
                'max_queue_size_changed', OLD.max_queue_size != NEW.max_queue_size,
                'maintenance_mode_changed', OLD.maintenance_mode != NEW.maintenance_mode,
                'registration_changed', OLD.allow_registration != NEW.allow_registration
            )
        );
        
        PERFORM public.create_shop_activity(
            NEW.shop_id,
            'shop_settings_updated',
            activity_title,
            activity_description,
            activity_metadata
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger function for opening hours activities
CREATE OR REPLACE FUNCTION public.trigger_opening_hours_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    activity_title TEXT;
    activity_description TEXT;
    activity_metadata JSONB;
    shop_name TEXT;
BEGIN
    -- Get shop name
    SELECT s.name INTO shop_name
    FROM shops s 
    WHERE s.id = COALESCE(NEW.shop_id, OLD.shop_id);
    
    IF TG_OP = 'UPDATE' THEN
        activity_title := 'เวลาเปิด-ปิดถูกอัปเดต';
        activity_description := 'เวลาเปิด-ปิดของร้าน ' || shop_name || ' วัน' || NEW.day_of_week || ' ถูกอัปเดต';
        activity_metadata := jsonb_build_object(
            'shop_id', NEW.shop_id,
            'shop_name', shop_name,
            'day_of_week', NEW.day_of_week,
            'is_open', NEW.is_open,
            'open_time', NEW.open_time,
            'close_time', NEW.close_time
        );
        
        PERFORM public.create_shop_activity(
            NEW.shop_id,
            'opening_hours_updated',
            activity_title,
            activity_description,
            activity_metadata
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER trigger_queue_activities
    AFTER INSERT OR UPDATE ON queues
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_queue_activity();

CREATE TRIGGER trigger_customer_activities
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_customer_activity();

CREATE TRIGGER trigger_shop_activities
    AFTER INSERT OR UPDATE ON shops
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_shop_activity();

CREATE TRIGGER trigger_employee_activities
    AFTER INSERT OR UPDATE OR DELETE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_employee_activity();

CREATE TRIGGER trigger_service_activities
    AFTER INSERT OR UPDATE OR DELETE ON services
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_service_activity();

CREATE TRIGGER trigger_payment_activities
    AFTER INSERT OR UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_payment_activity();

CREATE TRIGGER trigger_promotion_activities
    AFTER INSERT OR UPDATE ON promotions
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_promotion_activity();

CREATE TRIGGER trigger_shop_settings_activities
    AFTER UPDATE ON shop_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_shop_settings_activity();

CREATE TRIGGER trigger_opening_hours_activities
    AFTER UPDATE ON shop_opening_hours
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_opening_hours_activity();