# Supabase Setup Guide

This document explains how to set up Supabase authentication for your CloudBucks application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your CloudBucks project

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in your project details:
   - Name: `cloudbucks` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose the closest to your users
5. Click "Create new project"

### 2. Configure Environment Variables

1. In your Supabase project dashboard, go to **Settings > API**
2. Copy the following values:
   - Project URL
   - Anon (public) key

3. Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Replace the placeholder values with your actual Supabase project URL and anon key.

### 3. Enable Authentication

1. In your Supabase dashboard, go to **Authentication > Settings**
2. Configure your site URL:
   - For development: `http://localhost:5173`
   - For production: `https://yourdomain.com`
3. Enable email confirmations if desired
4. Configure any additional auth providers as needed

### 4. User Data Structure

The application stores the following user metadata:
- `first_name` - User's first name
- `last_name` - User's last name  
- `full_name` - Combined first and last name
- `company` - Optional company name

This data is collected during signup and included in generated reports and invoices.

## Features Included

### Authentication
- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Password validation (8+ chars, uppercase, lowercase, number)
- ✅ User profile display in header
- ✅ Logout functionality
- ✅ Session persistence

### User Data Integration
- ✅ User information in PDF reports
- ✅ User information in PDF invoices
- ✅ Customer details instead of placeholder data
- ✅ User ID tracking for reports

### Security
- ✅ Protected routes (auth required)
- ✅ Secure session management
- ✅ Environment variable configuration

## Usage

1. Start your development server: `npm run dev`
2. Navigate to your app - you'll see the authentication page
3. Create an account or sign in
4. Once authenticated, you'll access the main CloudBucks interface
5. Generate reports/invoices - they'll include your user information

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**
   - Ensure `.env.local` exists with correct values
   - Restart your development server after adding env vars

2. **Authentication not working**
   - Check your Supabase project URL and anon key
   - Verify your site URL is configured in Supabase settings

3. **Reports don't show user info**
   - Ensure you're logged in before generating reports
   - Check browser console for any errors

### Getting Help

If you encounter issues:
1. Check your Supabase project logs
2. Verify environment variables are loaded
3. Check browser developer tools for errors
4. Ensure your Supabase project is active

## Production Deployment

When deploying to production:
1. Add your production domain to Supabase auth settings
2. Update your environment variables for production
3. Consider enabling email confirmations for security
4. Set up proper error monitoring

## Security Notes

- Never commit your `.env.local` file to version control
- Use different Supabase projects for development and production
- Regularly rotate your API keys
- Monitor auth usage in your Supabase dashboard 