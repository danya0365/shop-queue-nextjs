-- Migration for Employee-related functions and views
-- This file adds database views and RPC functions for employee management

-- Create employee stats view
CREATE OR REPLACE VIEW employee_stats_view AS
WITH department_counts AS (
  SELECT
    'management' AS department_type,
    COUNT(*) AS count
  FROM employees e
  JOIN departments d ON e.department_id = d.id
  WHERE LOWER(d.name) LIKE '%management%'
  
  UNION ALL
  
  SELECT
    'customer_service' AS department_type,
    COUNT(*) AS count
  FROM employees e
  JOIN departments d ON e.department_id = d.id
  WHERE LOWER(d.name) LIKE '%customer%' OR LOWER(d.name) LIKE '%service%'
  
  UNION ALL
  
  SELECT
    'technical' AS department_type,
    COUNT(*) AS count
  FROM employees e
  JOIN departments d ON e.department_id = d.id
  WHERE LOWER(d.name) LIKE '%technical%' OR LOWER(d.name) LIKE '%tech%' OR LOWER(d.name) LIKE '%it%'
  
  UNION ALL
  
  SELECT
    'sales' AS department_type,
    COUNT(*) AS count
  FROM employees e
  JOIN departments d ON e.department_id = d.id
  WHERE LOWER(d.name) LIKE '%sales%' OR LOWER(d.name) LIKE '%marketing%'
  
  UNION ALL
  
  SELECT
    'other' AS department_type,
    COUNT(*) AS count
  FROM employees e
  JOIN departments d ON e.department_id = d.id
  WHERE LOWER(d.name) NOT LIKE '%management%'
    AND LOWER(d.name) NOT LIKE '%customer%'
    AND LOWER(d.name) NOT LIKE '%service%'
    AND LOWER(d.name) NOT LIKE '%technical%'
    AND LOWER(d.name) NOT LIKE '%tech%'
    AND LOWER(d.name) NOT LIKE '%it%'
    AND LOWER(d.name) NOT LIKE '%sales%'
    AND LOWER(d.name) NOT LIKE '%marketing%'
)
SELECT
  (SELECT COUNT(*) FROM employees) AS total_employees,
  (SELECT COUNT(*) FROM employees WHERE status = 'active') AS active_employees,
  (SELECT COUNT(*) FROM employees WHERE last_login::date = CURRENT_DATE) AS logged_in_today,
  (SELECT COUNT(*) FROM employees WHERE hire_date >= (CURRENT_DATE - INTERVAL '30 days')) AS new_employees_this_month,
  COALESCE((SELECT count FROM department_counts WHERE department_type = 'management'), 0) AS management_count,
  COALESCE((SELECT count FROM department_counts WHERE department_type = 'customer_service'), 0) AS customer_service_count,
  COALESCE((SELECT count FROM department_counts WHERE department_type = 'technical'), 0) AS technical_count,
  COALESCE((SELECT count FROM department_counts WHERE department_type = 'sales'), 0) AS sales_count,
  COALESCE((SELECT count FROM department_counts WHERE department_type = 'other'), 0) AS other_count;

-- Function to get paginated employees with department and shop info
CREATE OR REPLACE FUNCTION get_paginated_employees(
  p_page INTEGER DEFAULT 1,
  p_limit INTEGER DEFAULT 10,
  p_shop_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  employee_code TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  department_id UUID,
  department_name TEXT,
  position_text TEXT,
  shop_id UUID,
  shop_name TEXT,
  status employee_status,
  hire_date DATE,
  last_login TIMESTAMP WITH TIME ZONE,
  permissions TEXT[],
  salary DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  total_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_count BIGINT;
  v_offset INTEGER;
BEGIN
  -- Check if user has admin role or service role
  IF NOT (is_service_role() OR auth.role() = 'authenticated') THEN
    RAISE EXCEPTION 'insufficient_privilege: admin or service role required';
  END IF;

  -- Calculate offset
  v_offset := (p_page - 1) * p_limit;

  -- Get total count for pagination
  IF p_shop_id IS NULL THEN
    SELECT COUNT(*) INTO v_total_count FROM employees;
  ELSE
    SELECT COUNT(*) INTO v_total_count FROM employees WHERE shop_id = p_shop_id;
  END IF;

  -- Return paginated employees with joined data
  RETURN QUERY
  SELECT
    e.id,
    e.employee_code,
    e.name,
    e.email,
    e.phone,
    e.department_id,
    d.name AS department_name,
    e.position_text,
    e.shop_id,
    s.name AS shop_name,
    e.status,
    e.hire_date,
    e.last_login,
    e.permissions,
    e.salary,
    e.notes,
    e.created_at,
    e.updated_at,
    v_total_count
  FROM employees e
  LEFT JOIN departments d ON e.department_id = d.id
  LEFT JOIN shops s ON e.shop_id = s.id
  WHERE (p_shop_id IS NULL OR e.shop_id = p_shop_id)
  ORDER BY e.created_at DESC
  LIMIT p_limit
  OFFSET v_offset;
END;
$$;

-- Function to get employee statistics
CREATE OR REPLACE FUNCTION get_employee_stats(
  p_shop_id UUID DEFAULT NULL
)
RETURNS TABLE (
  total_employees BIGINT,
  active_employees BIGINT,
  logged_in_today BIGINT,
  new_employees_this_month BIGINT,
  management_count BIGINT,
  customer_service_count BIGINT,
  technical_count BIGINT,
  sales_count BIGINT,
  other_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has admin role or service role
  IF NOT (is_service_role() OR auth.role() = 'authenticated') THEN
    RAISE EXCEPTION 'insufficient_privilege: admin or service role required';
  END IF;

  -- Return employee statistics
  RETURN QUERY
  WITH department_counts AS (
    SELECT
      'management' AS department_type,
      COUNT(*) AS count
    FROM employees e
    JOIN departments d ON e.department_id = d.id
    WHERE (p_shop_id IS NULL OR e.shop_id = p_shop_id)
      AND (LOWER(d.name) LIKE '%management%')
    
    UNION ALL
    
    SELECT
      'customer_service' AS department_type,
      COUNT(*) AS count
    FROM employees e
    JOIN departments d ON e.department_id = d.id
    WHERE (p_shop_id IS NULL OR e.shop_id = p_shop_id)
      AND (LOWER(d.name) LIKE '%customer%' OR LOWER(d.name) LIKE '%service%')
    
    UNION ALL
    
    SELECT
      'technical' AS department_type,
      COUNT(*) AS count
    FROM employees e
    JOIN departments d ON e.department_id = d.id
    WHERE (p_shop_id IS NULL OR e.shop_id = p_shop_id)
      AND (LOWER(d.name) LIKE '%technical%' OR LOWER(d.name) LIKE '%tech%' OR LOWER(d.name) LIKE '%it%')
    
    UNION ALL
    
    SELECT
      'sales' AS department_type,
      COUNT(*) AS count
    FROM employees e
    JOIN departments d ON e.department_id = d.id
    WHERE (p_shop_id IS NULL OR e.shop_id = p_shop_id)
      AND (LOWER(d.name) LIKE '%sales%' OR LOWER(d.name) LIKE '%marketing%')
    
    UNION ALL
    
    SELECT
      'other' AS department_type,
      COUNT(*) AS count
    FROM employees e
    JOIN departments d ON e.department_id = d.id
    WHERE (p_shop_id IS NULL OR e.shop_id = p_shop_id)
      AND LOWER(d.name) NOT LIKE '%management%'
      AND LOWER(d.name) NOT LIKE '%customer%'
      AND LOWER(d.name) NOT LIKE '%service%'
      AND LOWER(d.name) NOT LIKE '%technical%'
      AND LOWER(d.name) NOT LIKE '%tech%'
      AND LOWER(d.name) NOT LIKE '%it%'
      AND LOWER(d.name) NOT LIKE '%sales%'
      AND LOWER(d.name) NOT LIKE '%marketing%'
  )
  SELECT
    (SELECT COUNT(*) FROM employees WHERE (p_shop_id IS NULL OR shop_id = p_shop_id)) AS total_employees,
    (SELECT COUNT(*) FROM employees WHERE (p_shop_id IS NULL OR shop_id = p_shop_id) AND status = 'active') AS active_employees,
    (SELECT COUNT(*) FROM employees WHERE (p_shop_id IS NULL OR shop_id = p_shop_id) AND last_login::date = CURRENT_DATE) AS logged_in_today,
    (SELECT COUNT(*) FROM employees WHERE (p_shop_id IS NULL OR shop_id = p_shop_id) AND hire_date >= (CURRENT_DATE - INTERVAL '30 days')) AS new_employees_this_month,
    COALESCE((SELECT count FROM department_counts WHERE department_type = 'management'), 0) AS management_count,
    COALESCE((SELECT count FROM department_counts WHERE department_type = 'customer_service'), 0) AS customer_service_count,
    COALESCE((SELECT count FROM department_counts WHERE department_type = 'technical'), 0) AS technical_count,
    COALESCE((SELECT count FROM department_counts WHERE department_type = 'sales'), 0) AS sales_count,
    COALESCE((SELECT count FROM department_counts WHERE department_type = 'other'), 0) AS other_count;
END;
$$;

-- Function to get employee by ID
CREATE OR REPLACE FUNCTION get_employee_by_id(
  p_employee_id UUID
)
RETURNS TABLE (
  id UUID,
  employee_code TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  department_id UUID,
  department_name TEXT,
  position_text TEXT,
  shop_id UUID,
  shop_name TEXT,
  status employee_status,
  hire_date DATE,
  last_login TIMESTAMP WITH TIME ZONE,
  permissions TEXT[],
  salary DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has admin role or service role
  IF NOT (is_service_role() OR auth.role() = 'authenticated') THEN
    RAISE EXCEPTION 'insufficient_privilege: admin or service role required';
  END IF;

  -- Return employee with joined data
  RETURN QUERY
  SELECT
    e.id,
    e.employee_code,
    e.name,
    e.email,
    e.phone,
    e.department_id,
    d.name AS department_name,
    e.position_text,
    e.shop_id,
    s.name AS shop_name,
    e.status,
    e.hire_date,
    e.last_login,
    e.permissions,
    e.salary,
    e.notes,
    e.created_at,
    e.updated_at
  FROM employees e
  LEFT JOIN departments d ON e.department_id = d.id
  LEFT JOIN shops s ON e.shop_id = s.id
  WHERE e.id = p_employee_id;
END;
$$;

-- Function to create a new employee
CREATE OR REPLACE FUNCTION create_employee(
  p_employee_code TEXT,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_department_id UUID,
  p_position TEXT,
  p_shop_id UUID,
  p_status employee_status,
  p_hire_date DATE,
  p_permissions TEXT[],
  p_salary DECIMAL(10,2),
  p_notes TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_employee_id UUID;
BEGIN
  -- Check if user has admin role or service role
  IF NOT (is_service_role() OR auth.role() = 'authenticated') THEN
    RAISE EXCEPTION 'insufficient_privilege: admin or service role required';
  END IF;

  -- Insert new employee
  INSERT INTO employees (
    employee_code,
    name,
    email,
    phone,
    department_id,
    position_text,
    shop_id,
    status,
    hire_date,
    permissions,
    salary,
    notes,
    profile_id -- This is required in the schema but not in our DTO
  )
  VALUES (
    p_employee_code,
    p_name,
    p_email,
    p_phone,
    p_department_id,
    p_position_text,
    p_shop_id,
    p_status,
    p_hire_date,
    p_permissions,
    p_salary,
    p_notes,
    public.get_active_profile_id() -- Use the current profile ID as a placeholder
  )
  RETURNING id INTO v_employee_id;

  RETURN v_employee_id;
END;
$$;

-- Function to update an existing employee
CREATE OR REPLACE FUNCTION update_employee(
  p_employee_id UUID,
  p_employee_code TEXT DEFAULT NULL,
  p_name TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_department_id UUID DEFAULT NULL,
  p_position_text TEXT DEFAULT NULL,
  p_shop_id UUID DEFAULT NULL,
  p_status employee_status DEFAULT NULL,
  p_hire_date DATE DEFAULT NULL,
  p_permissions TEXT[] DEFAULT NULL,
  p_salary DECIMAL(10,2) DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has admin role or service role
  IF NOT (is_service_role() OR auth.role() = 'authenticated') THEN
    RAISE EXCEPTION 'insufficient_privilege: admin or service role required';
  END IF;

  -- Update employee
  UPDATE employees
  SET
    employee_code = COALESCE(p_employee_code, employee_code),
    name = COALESCE(p_name, name),
    email = COALESCE(p_email, email),
    phone = COALESCE(p_phone, phone),
    department_id = COALESCE(p_department_id, department_id),
    position_text = COALESCE(p_position_text, position_text),
    shop_id = COALESCE(p_shop_id, shop_id),
    status = COALESCE(p_status, status),
    hire_date = COALESCE(p_hire_date, hire_date),
    permissions = COALESCE(p_permissions, permissions),
    salary = COALESCE(p_salary, salary),
    notes = COALESCE(p_notes, notes),
    updated_at = NOW()
  WHERE id = p_employee_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'employee_not_found: %', p_employee_id;
  END IF;

  RETURN TRUE;
END;
$$;

-- Function to delete an employee
CREATE OR REPLACE FUNCTION delete_employee(
  p_employee_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has admin role or service role
  IF NOT (is_service_role() OR auth.role() = 'authenticated') THEN
    RAISE EXCEPTION 'insufficient_privilege: admin or service role required';
  END IF;

  -- Delete employee
  DELETE FROM employees
  WHERE id = p_employee_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'employee_not_found: %', p_employee_id;
  END IF;

  RETURN TRUE;
END;
$$;
