-- FilmNest Execute SQL Function
-- Created: 2025-06-19
-- Updated: 2025-07-27
-- Author: Marosdee Uma
-- Description: Adds execute_sql RPC function for custom queries

-- Create API function to execute custom SQL queries
-- This function is used by the SupabaseDatasource.customQuery method
CREATE OR REPLACE FUNCTION public.execute_sql(sql_query TEXT, params JSONB DEFAULT '[]')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result JSONB;
  query_params TEXT[];
  i INTEGER;
  is_service_role BOOLEAN;
BEGIN
  -- Check if the request is coming from service role (bypasses RLS)
  -- When using service role, current_setting('role') returns 'service_role'
  is_service_role := (SELECT current_setting('role') = 'service_role');
  
  -- If not service role, check for admin authentication
  IF NOT is_service_role THEN
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
      RAISE EXCEPTION 'Authentication required for executing SQL query';
    END IF;

    -- Check if user has admin role using active profile
    IF public.get_active_profile_role() != 'admin' THEN
      RAISE EXCEPTION 'Admin privileges required for executing SQL query';
    END IF;
  END IF;

  -- Convert JSON array to text array
  IF jsonb_array_length(params) > 0 THEN
    query_params := ARRAY[]::TEXT[];
    FOR i IN 0..jsonb_array_length(params)-1 LOOP
      -- Convert JSONB value to text properly
      query_params := array_append(query_params, (params->i)::text);
    END LOOP;
  END IF;

  -- Execute the query with parameters
  -- Use dynamic SQL with USING clause for parameters
  IF array_length(query_params, 1) > 0 THEN
    -- Use format to properly inject parameters
    EXECUTE format('SELECT to_jsonb((%s)::jsonb)', sql_query) 
    USING query_params
    INTO result;
  ELSE
    -- For queries without parameters
    EXECUTE format('SELECT to_jsonb((%s)::jsonb)', sql_query) 
    INTO result;
  END IF;
  
  -- Return the result as JSONB
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  -- Return error information
  RETURN jsonb_build_object(
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.execute_sql TO authenticated;

-- Revoke execute permission from anon users for security
REVOKE EXECUTE ON FUNCTION public.execute_sql FROM anon;
