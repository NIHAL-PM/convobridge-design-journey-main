# Vercel Environment Variables Setup

To deploy this application on Vercel, you need to configure the following environment variables in your Vercel project settings:

## ✨ Architecture: Fully Serverless with Supabase

This application uses **Supabase PostgreSQL** with RPC functions for authentication and data management. There is **no separate backend server** - all database operations run directly in Supabase using Row Level Security (RLS) and custom PostgreSQL functions.

## Required Environment Variables

### Supabase (Database & Auth)
1. **VITE_SUPABASE_URL** (Required)
   - Your Supabase project URL
   - Example: `https://xxxxxxxxxxxxx.supabase.co`
   - Get from: Supabase Dashboard → Settings → API

2. **VITE_SUPABASE_ANON_KEY** (Required)
   - Your Supabase anonymous/public API key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Get from: Supabase Dashboard → Settings → API
   - **Note**: This is safe to expose publicly (RLS protects your data)

### AI Features
1. **VITE_GEMINI_API_KEY** (Required for Live Demo Widget)
   - Your Google Gemini API key
   - Get from: https://aistudio.google.com/app/apikey

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select the appropriate environments (Production, Preview, Development)
5. Click **Save**
6. Redeploy your project for changes to take effect

## Testing Locally

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://nbnzbvchmwytgrxohobh.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Gemini AI (for live demo widget)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Then run the development server:
```bash
npm run dev
```

## Deployment Checklist

- [ ] Set `VITE_SUPABASE_URL` in Vercel environment variables
- [ ] Set `VITE_SUPABASE_ANON_KEY` in Vercel environment variables
- [ ] Set `VITE_GEMINI_API_KEY` in Vercel environment variables
- [ ] Verify Supabase RLS policies are active (see database documentation)
- [ ] Test authentication flow after deployment
- [ ] Verify login with admin credentials: `admin@convobridge.in` / `admin234@#$`
- [ ] Test multi-tenant data isolation
- [ ] Check browser console for errors
- [ ] Test creating agents, calls, and leads

## Troubleshooting

### "Cross-Origin Request Blocked" or CORS errors
- **Cause**: This happens when frontend tries to call a non-existent REST API
- **Solution**: Verify you're using the latest `apiClient.ts` with Supabase RPC functions
- **Check**: Make sure there are NO references to `http://localhost:3001` in your code

### "Missing Supabase environment variables"
- Check that `.env.local` exists locally with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- In Vercel, go to Settings → Environment Variables and verify both are set
- Redeploy after adding environment variables

### Login fails with "Invalid credentials"
- **Check user exists**: Go to Supabase Dashboard → Table Editor → `app_users`
- **Verify email**: Make sure email exactly matches (case-sensitive)
- **Test with admin**: `admin@convobridge.in` / `admin234@#$`
- **Check RPC function**: Verify `custom_login` function exists in SQL Editor

### "Function not found" errors
- Go to Supabase Dashboard → SQL Editor
- Run the database setup scripts to create RPC functions:
  - `custom_login(user_email, user_password)`
  - `update_user_password(user_id_param, new_password)`
  - `add_company_balance(company_id_param, amount_param)`

### Data not loading in Dashboard
- Open browser DevTools → Console to see errors
- Check Supabase RLS policies: Table must have SELECT policies for authenticated users
- Verify user has correct `company_id` in `app_users` table

## Architecture Notes

**No Backend Server Required**
- This application runs entirely in the browser + Supabase
- No Express/Node.js server is deployed
- Authentication uses custom PostgreSQL functions in Supabase
- Row Level Security (RLS) enforces multi-tenant data isolation

**Database Functions (Supabase RPC)**
- `custom_login`: Validates credentials using pgcrypto bf-crypt
- `update_user_password`: Securely updates user password
- `add_company_balance`: Admin function to top up company credits

**Multi-Tenant Security**
- Each database row has `company_id` foreign key
- RLS policies filter data automatically based on logged-in user
- Users can only see data from their own company
