-- =====================================================
-- ALTERNATIVE CLEANUP OPTIONS
-- =====================================================
-- Choose the appropriate cleanup level for your needs
-- =====================================================

-- =====================================================
-- OPTION 1: COMPLETE NUCLEAR CLEANUP (Everything)
-- =====================================================
-- Use this for complete fresh start
DO $$
BEGIN
    -- Delete all auth data
    DELETE FROM auth.refresh_tokens;
    DELETE FROM auth.sessions;
    DELETE FROM auth.identities;
    DELETE FROM auth.users;
    DELETE FROM auth.audit_log_entries;
    
    -- If you have custom tables, add them here
    -- DELETE FROM public.profiles;
    -- DELETE FROM public.user_preferences;
    
    RAISE NOTICE 'Complete cleanup completed. All user data removed.';
END $$;

-- =====================================================
-- OPTION 2: SOFT CLEANUP (Keep audit logs)
-- =====================================================
-- Removes users but keeps audit trail
DO $$
BEGIN
    DELETE FROM auth.refresh_tokens;
    DELETE FROM auth.sessions;
    DELETE FROM auth.identities;
    DELETE FROM auth.users;
    -- Keep audit_log_entries for tracking
    
    RAISE NOTICE 'Soft cleanup completed. Audit logs preserved.';
END $$;

-- =====================================================
-- OPTION 3: SESSION CLEANUP ONLY
-- =====================================================
-- Just invalidate all sessions (users remain)
DO $$
BEGIN
    DELETE FROM auth.refresh_tokens;
    DELETE FROM auth.sessions;
    
    RAISE NOTICE 'Session cleanup completed. All users logged out.';
END $$;

-- =====================================================
-- OPTION 4: REMOVE SPECIFIC USER
-- =====================================================
-- Replace 'user@example.com' with the actual email
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO user_id FROM auth.users WHERE email = 'user@example.com';
    
    IF user_id IS NOT NULL THEN
        -- Remove user-specific data
        DELETE FROM auth.refresh_tokens WHERE user_id = user_id;
        DELETE FROM auth.sessions WHERE user_id = user_id;
        DELETE FROM auth.identities WHERE user_id = user_id;
        DELETE FROM auth.users WHERE id = user_id;
        
        RAISE NOTICE 'User % removed successfully', 'user@example.com';
    ELSE
        RAISE NOTICE 'User % not found', 'user@example.com';
    END IF;
END $$;

-- =====================================================
-- OPTION 5: CLEANUP BY DATE RANGE
-- =====================================================
-- Remove users created before a specific date
DO $$
BEGIN
    DELETE FROM auth.users WHERE created_at < '2024-01-01'::timestamp;
    -- This will cascade to related tables
    
    RAISE NOTICE 'Users created before 2024-01-01 have been removed';
END $$;

-- =====================================================
-- VERIFICATION FUNCTIONS
-- =====================================================

-- Function to check database state
CREATE OR REPLACE FUNCTION check_auth_state()
RETURNS TABLE(
    table_name TEXT,
    record_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 'users'::TEXT, COUNT(*) FROM auth.users
    UNION ALL
    SELECT 'sessions'::TEXT, COUNT(*) FROM auth.sessions
    UNION ALL
    SELECT 'identities'::TEXT, COUNT(*) FROM auth.identities
    UNION ALL
    SELECT 'refresh_tokens'::TEXT, COUNT(*) FROM auth.refresh_tokens
    UNION ALL
    SELECT 'audit_logs'::TEXT, COUNT(*) FROM auth.audit_log_entries;
END;
$$ LANGUAGE plpgsql;

-- Usage: SELECT * FROM check_auth_state();

-- =====================================================
-- BACKUP SCRIPT (Run BEFORE cleanup)
-- =====================================================
-- Create backup tables before cleanup
CREATE TABLE IF NOT EXISTS backup_users AS SELECT * FROM auth.users;
CREATE TABLE IF NOT EXISTS backup_identities AS SELECT * FROM auth.identities;
CREATE TABLE IF NOT EXISTS backup_sessions AS SELECT * FROM auth.sessions;
CREATE TABLE IF NOT EXISTS backup_refresh_tokens AS SELECT * FROM auth.refresh_tokens;

-- To restore from backup:
-- INSERT INTO auth.users SELECT * FROM backup_users;
-- INSERT INTO auth.identities SELECT * FROM backup_identities;
-- (etc.)

-- =====================================================
-- CLEANUP BACKUP TABLES (after confirming cleanup worked)
-- =====================================================
-- DROP TABLE IF EXISTS backup_users;
-- DROP TABLE IF EXISTS backup_identities;
-- DROP TABLE IF EXISTS backup_sessions;
-- DROP TABLE IF EXISTS backup_refresh_tokens; 