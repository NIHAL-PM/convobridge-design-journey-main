# Quick Fix for Login & Admin Panel Issues

## Problem Summary
1. **Login fails with "Invalid credentials"** - Missing Supabase anon key
2. **Admin panel 500 error** - RLS policies were blocking queries

## ✅ Already Fixed (Database)
- Created `get_companies_with_stats()` RPC function (bypasses RLS)
- Created `create_topup()` RPC function (handles balance updates)
- Updated `apiClient.ts` to use new RPC functions

## ⚠️ Action Required: Add Supabase Credentials

### Step 1: Get Your Supabase Anon Key
1. Go to: https://supabase.com/dashboard/project/nbnzbvchmwytgrxohobh
2. Click **Settings** (gear icon in sidebar)
3. Click **API** section
4. Find the **anon** **public** key (long string starting with `eyJ...`)
5. Copy it (DO NOT copy the service_role key!)

### Step 2: Update `.env.local`
Edit the file and replace `your_supabase_anon_key_here` with your actual key:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://nbnzbvchmwytgrxohobh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXB... (paste your real key)

# Gemini AI (for live demo widget)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Restart Dev Server
```bash
# Stop the server (Ctrl+C) then restart:
npm run dev
```

### Step 4: Test Login
Use admin credentials:
- **Email**: `admin@convobridge.in`
- **Password**: `admin234@#$`

Or company credentials:
- **Nilgiri College**: `ai@nilgiricollege.edu` / `nilgiri123`
- **KSRTC**: `ops@ksrtc.in` / `ksrtc123`
- **SM Soft**: `contact@smsoft.in` / `smsoft123`

## Expected Results After Fix
✅ Login should work without CORS errors  
✅ Admin panel should load all 3 companies with call/lead counts  
✅ Top-up functionality should work  
✅ Dashboard should load user-specific data

## Technical Summary of Changes

### Database Functions Created:
```sql
-- Bypasses RLS to return all companies with aggregated stats
CREATE FUNCTION public.get_companies_with_stats()

-- Creates topup and updates balance in one transaction
CREATE FUNCTION public.create_topup(p_company_id, p_amount, p_method, p_reference)
```

### Frontend Changes:
- `apiClient.getCompanies()` - Now uses `supabase.rpc('get_companies_with_stats')`
- `apiClient.createTopup()` - Now uses `supabase.rpc('create_topup', ...)`

## Why RLS Was Blocking Queries

Your database uses **Row Level Security (RLS)** with policies like:
```sql
WHERE (app_users.id = auth.uid())
```

But `auth.uid()` only works with **Supabase Auth**. Since you're using **custom PSQL authentication**, `auth.uid()` returns `NULL`, blocking all queries.

**Solution**: Use `SECURITY DEFINER` RPC functions that run with elevated privileges and handle permission checks internally.

## Troubleshooting

### Still getting "Invalid credentials"?
- Check that `.env.local` has correct anon key (no placeholder text)
- Make sure dev server was restarted after changing `.env.local`
- Open browser DevTools → Network tab to see the actual error

### Still getting 500 errors?
- Go to Supabase Dashboard → SQL Editor
- Run: `SELECT * FROM public.get_companies_with_stats();`
- Should return 3 companies (Nilgiri, KSRTC, SM Soft)
- If function doesn't exist, I can recreate it

### Admin sees empty panel?
- Check browser console for errors
- Verify user has `role = 'admin'` in `app_users` table
- Check that `get_companies_with_stats()` function exists
