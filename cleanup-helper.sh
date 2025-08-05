#!/bin/bash

# =====================================================
# Supabase Database Cleanup Helper Script
# =====================================================
# This script helps you safely clean up your Supabase database
# =====================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SUPABASE_PROJECT_ID="${SUPABASE_PROJECT_ID:-}"
SUPABASE_DB_PASSWORD="${SUPABASE_DB_PASSWORD:-}"

echo -e "${BLUE}🧹 Supabase Database Cleanup Helper${NC}"
echo "====================================="
echo ""

# Function to display warning
show_warning() {
    echo -e "${RED}⚠️  WARNING: This will permanently delete data!${NC}"
    echo -e "${RED}   Make sure you have backups if needed.${NC}"
    echo ""
}

# Function to confirm action
confirm_action() {
    local action="$1"
    echo -e "${YELLOW}Are you sure you want to $action? (yes/no):${NC}"
    read -r confirmation
    if [[ "$confirmation" != "yes" ]]; then
        echo "Operation cancelled."
        exit 0
    fi
}

# Function to show menu
show_menu() {
    echo "Choose cleanup option:"
    echo ""
    echo "1) 🧨 Complete Nuclear Cleanup (Remove ALL user data)"
    echo "2) 🧽 Soft Cleanup (Remove users, keep audit logs)"
    echo "3) 🚪 Session Cleanup Only (Log out all users)"
    echo "4) 👤 Remove Specific User"
    echo "5) 📅 Remove Users by Date Range"
    echo "6) 📊 Check Database State"
    echo "7) 💾 Create Backup Before Cleanup"
    echo "8) 🗑️  Clean Up Backup Tables"
    echo "9) ❌ Exit"
    echo ""
    echo -n "Enter your choice (1-9): "
}

# Function to execute SQL
execute_sql() {
    local sql_file="$1"
    local description="$2"
    
    echo -e "${BLUE}Executing: $description${NC}"
    
    if [[ -f "$sql_file" ]]; then
        echo "SQL file: $sql_file"
        echo "You can copy and paste this content into your Supabase SQL Editor:"
        echo "----------------------------------------"
        cat "$sql_file"
        echo "----------------------------------------"
    else
        echo -e "${RED}SQL file not found: $sql_file${NC}"
        echo "Please run this SQL in your Supabase SQL Editor:"
        echo "$3"  # Fallback SQL
    fi
    
    echo ""
    echo -e "${GREEN}✅ Instructions displayed. Execute the SQL in your Supabase dashboard.${NC}"
}

# Function to get user email for specific deletion
get_user_email() {
    echo -n "Enter the email address of the user to remove: "
    read -r user_email
    
    if [[ -z "$user_email" ]]; then
        echo "Email cannot be empty."
        return 1
    fi
    
    echo "$user_email"
}

# Function to get date for date-based cleanup
get_cleanup_date() {
    echo -n "Enter the date (YYYY-MM-DD) to remove users created before: "
    read -r cleanup_date
    
    if [[ ! "$cleanup_date" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
        echo "Invalid date format. Please use YYYY-MM-DD."
        return 1
    fi
    
    echo "$cleanup_date"
}

# Main menu loop
while true; do
    clear
    echo -e "${BLUE}🧹 Supabase Database Cleanup Helper${NC}"
    echo "====================================="
    echo ""
    
    show_menu
    read -r choice
    
    case $choice in
        1)
            clear
            show_warning
            confirm_action "completely wipe all user data"
            execute_sql "database-cleanup.sql" "Complete Nuclear Cleanup" "
-- Complete cleanup
DELETE FROM auth.refresh_tokens;
DELETE FROM auth.sessions;
DELETE FROM auth.identities;
DELETE FROM auth.users;
DELETE FROM auth.audit_log_entries;
"
            ;;
        2)
            clear
            show_warning
            confirm_action "remove all users but keep audit logs"
            echo "SQL to execute in Supabase SQL Editor:"
            echo "
-- Soft cleanup (keep audit logs)
DELETE FROM auth.refresh_tokens;
DELETE FROM auth.sessions;
DELETE FROM auth.identities;
DELETE FROM auth.users;
-- audit_log_entries preserved
"
            ;;
        3)
            clear
            confirm_action "log out all users (invalidate all sessions)"
            echo "SQL to execute in Supabase SQL Editor:"
            echo "
-- Session cleanup only
DELETE FROM auth.refresh_tokens;
DELETE FROM auth.sessions;
"
            ;;
        4)
            clear
            if user_email=$(get_user_email); then
                show_warning
                confirm_action "remove user: $user_email"
                echo "SQL to execute in Supabase SQL Editor:"
                echo "
-- Remove specific user
DO \$\$
DECLARE
    user_id UUID;
BEGIN
    SELECT id INTO user_id FROM auth.users WHERE email = '$user_email';
    
    IF user_id IS NOT NULL THEN
        DELETE FROM auth.refresh_tokens WHERE user_id = user_id;
        DELETE FROM auth.sessions WHERE user_id = user_id;
        DELETE FROM auth.identities WHERE user_id = user_id;
        DELETE FROM auth.users WHERE id = user_id;
        RAISE NOTICE 'User $user_email removed successfully';
    ELSE
        RAISE NOTICE 'User $user_email not found';
    END IF;
END \$\$;
"
            fi
            ;;
        5)
            clear
            if cleanup_date=$(get_cleanup_date); then
                show_warning
                confirm_action "remove users created before $cleanup_date"
                echo "SQL to execute in Supabase SQL Editor:"
                echo "
-- Remove users by date
DELETE FROM auth.users WHERE created_at < '$cleanup_date'::timestamp;
"
            fi
            ;;
        6)
            clear
            echo "SQL to check database state:"
            echo "
-- Check current database state
SELECT 'users' as table_name, COUNT(*) as records FROM auth.users
UNION ALL
SELECT 'sessions', COUNT(*) FROM auth.sessions  
UNION ALL
SELECT 'identities', COUNT(*) FROM auth.identities
UNION ALL
SELECT 'refresh_tokens', COUNT(*) FROM auth.refresh_tokens
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM auth.audit_log_entries;
"
            ;;
        7)
            clear
            echo "SQL to create backups before cleanup:"
            echo "
-- Create backup tables
CREATE TABLE IF NOT EXISTS backup_users AS SELECT * FROM auth.users;
CREATE TABLE IF NOT EXISTS backup_identities AS SELECT * FROM auth.identities;
CREATE TABLE IF NOT EXISTS backup_sessions AS SELECT * FROM auth.sessions;
CREATE TABLE IF NOT EXISTS backup_refresh_tokens AS SELECT * FROM auth.refresh_tokens;
"
            echo -e "${GREEN}✅ Backup tables will be created.${NC}"
            ;;
        8)
            clear
            confirm_action "remove backup tables"
            echo "SQL to clean up backup tables:"
            echo "
-- Remove backup tables
DROP TABLE IF EXISTS backup_users;
DROP TABLE IF EXISTS backup_identities;
DROP TABLE IF EXISTS backup_sessions;
DROP TABLE IF EXISTS backup_refresh_tokens;
"
            ;;
        9)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please choose 1-9.${NC}"
            sleep 2
            ;;
    esac
    
    echo ""
    echo "Press Enter to continue..."
    read -r
done 