-- Department Stats Views
-- Based on DepartmentStatsDTO interface

-- 1. Department Stats Summary View (รวมทั้งระบบ)
CREATE OR REPLACE VIEW public.department_stats_summary_view AS
SELECT 
    COUNT(DISTINCT d.id) as total_departments,
    COUNT(DISTINCT e.id) as total_employees,
    COUNT(DISTINCT CASE 
        WHEN dept_employee_count.employee_count > 0 
        THEN d.id 
        ELSE NULL 
    END) as active_departments,
    CASE 
        WHEN COUNT(DISTINCT d.id) > 0 
        THEN ROUND(COUNT(DISTINCT e.id)::decimal / COUNT(DISTINCT d.id), 2)
        ELSE 0 
    END as average_employees_per_department
FROM public.departments d
LEFT JOIN public.employees e ON d.id = e.department_id 
    AND e.status = 'active'
LEFT JOIN (
    -- Subquery เพื่อนับจำนวน employee ในแต่ละ department
    SELECT 
        d.id as department_id,
        COUNT(e.id) as employee_count
    FROM public.departments d
    LEFT JOIN public.employees e ON d.id = e.department_id 
        AND e.status = 'active'
    GROUP BY d.id
) dept_employee_count ON d.id = dept_employee_count.department_id;

-- 2. Department Stats By Shop View (แยกตาม shop_id)
CREATE OR REPLACE VIEW public.department_stats_by_shop_view AS
SELECT 
    d.shop_id,
    s.name as shop_name,
    COUNT(DISTINCT d.id) as total_departments,
    COUNT(DISTINCT e.id) as total_employees,
    COUNT(DISTINCT CASE 
        WHEN dept_employee_count.employee_count > 0 
        THEN d.id 
        ELSE NULL 
    END) as active_departments,
    CASE 
        WHEN COUNT(DISTINCT d.id) > 0 
        THEN ROUND(COUNT(DISTINCT e.id)::decimal / COUNT(DISTINCT d.id), 2)
        ELSE 0 
    END as average_employees_per_department
FROM public.departments d
LEFT JOIN public.shops s ON d.shop_id = s.id
LEFT JOIN public.employees e ON d.id = e.department_id 
    AND e.status = 'active'
LEFT JOIN (
    -- Subquery เพื่อนับจำนวน employee ในแต่ละ department ของแต่ละ shop
    SELECT 
        d.shop_id,
        d.id as department_id,
        COUNT(e.id) as employee_count
    FROM public.departments d
    LEFT JOIN public.employees e ON d.id = e.department_id 
        AND e.status = 'active'
    GROUP BY d.shop_id, d.id
) dept_employee_count ON d.id = dept_employee_count.department_id 
    AND d.shop_id = dept_employee_count.shop_id
GROUP BY d.shop_id, s.name
ORDER BY d.shop_id;

CREATE OR REPLACE VIEW department_employee_counts_view AS
SELECT
    d.id AS department_id,
    d.shop_id,
    d.name AS department_name,
    COUNT(e.id) AS employee_count
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id
GROUP BY d.id, d.shop_id, d.name
ORDER BY d.id;
