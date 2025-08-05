-- =====================================================
-- SUPABASE DATABASE CLEANUP SCRIPT
-- =====================================================
-- WARNING: This will permanently delete ALL user data!
-- Make sure to backup your data before running this script.
-- 
-- Run this in your Supabase SQL Editor:
-- Dashboard > SQL Editor > New Query
-- =====================================================

-- 1. Delete all refresh tokens
DELETE FROM auth.refresh_tokens;

-- 2. Delete all active sessions  
DELETE FROM auth.sessions;

-- 3. Delete all user identities
DELETE FROM auth.identities;

-- 4. Delete all users (this will cascade and remove related data)
DELETE FROM auth.users;

-- 5. Delete any audit log entries (optional)
DELETE FROM auth.audit_log_entries;

-- 6. Reset any custom user profiles table if you created one
-- (Uncomment if you have a custom profiles table)
-- DELETE FROM public.profiles;

-- 7. Verify cleanup - these should all return 0
SELECT 'Users count:' as table_name, COUNT(*) as remaining_records FROM auth.users
UNION ALL
SELECT 'Sessions count:', COUNT(*) FROM auth.sessions  
UNION ALL
SELECT 'Identities count:', COUNT(*) FROM auth.identities
UNION ALL
SELECT 'Refresh tokens count:', COUNT(*) FROM auth.refresh_tokens
UNION ALL
SELECT 'Audit logs count:', COUNT(*) FROM auth.audit_log_entries;

-- =====================================================
-- OPTIONAL: Reset auto-increment sequences
-- =====================================================
-- If you want to reset ID sequences (optional):

-- Reset users sequence (if using auto-increment IDs)
-- ALTER SEQUENCE IF EXISTS auth.users_id_seq RESTART WITH 1;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to confirm everything is cleaned up:

-- Check if any users remain
SELECT COUNT(*) as total_users FROM auth.users;

-- Check if any sessions remain  
SELECT COUNT(*) as total_sessions FROM auth.sessions;

-- Check if any identities remain
SELECT COUNT(*) as total_identities FROM auth.identities;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. This script removes ALL user accounts and authentication data
-- 2. Users will need to re-register after running this
-- 3. All user sessions will be invalidated
-- 4. This cannot be undone without a backup
-- 5. Consider running in a test environment first
-- ===================================================== 