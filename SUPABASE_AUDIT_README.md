# Supabase Integration Audit System

## Overview
Comprehensive audit tool to verify frontend-backend Supabase integration.

## What It Checks

### 1. Database Schema
- ✅ All required tables exist
- ✅ Critical tables have correct structure

### 2. Row Level Security (RLS)
- ✅ RLS enabled on sensitive tables
- ✅ Policies configured correctly

### 3. Storage Buckets
- ✅ Required buckets exist
- ✅ Bucket permissions configured

### 4. Edge Functions
- ✅ Edge functions exist
- ✅ Functions have proper structure

### 5. Frontend Integration
- ✅ Supabase client initialized
- ✅ API services exist
- ✅ React hooks implemented
- ✅ Environment variables configured

### 6. Data Flow
- ✅ Auth system functional
- ✅ CRUD operations work
- ✅ Real-time subscriptions active

## How to Run

### Method 1: Using the script (Recommended)
```bash
chmod +x scripts/run-audit.sh
./scripts/run-audit.sh
```

### Method 2: Direct execution
```bash
npx tsx scripts/supabase-audit.ts
```

### Method 3: Add to package.json
Add this to your `package.json` scripts:
```json
"scripts": {
  "audit:supabase": "tsx scripts/supabase-audit.ts"
}
```

Then run:
```bash
npm run audit:supabase
```

## Output

The audit will:
1. Print results to console with emoji indicators:
   - ✅ Pass
   - ❌ Fail
   - ⚠️ Warning

2. Generate a detailed JSON report: `supabase-audit-report.json`

## Interpreting Results

### Pass ✅
Everything is configured correctly.

### Warning ⚠️
Non-critical issues or optional features missing. Your app will work but may be missing some functionality.

### Fail ❌
Critical issues that need to be fixed. Your app may not work correctly.

## Common Issues & Fixes

### Missing Tables
**Issue:** Table does not exist
**Fix:** Run the appropriate migration or create the table in Supabase

### RLS Not Enabled
**Issue:** RLS NOT enabled on table
**Fix:** Run in Supabase SQL Editor:
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Missing Environment Variables
**Issue:** Environment variable not set
**Fix:** Add to your `.env` file:
```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

### Missing Storage Bucket
**Issue:** Bucket does not exist
**Fix:** Create bucket in Supabase Dashboard or via SQL:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('bucket-name', 'bucket-name', true);
```

## When to Run

- ✅ After initial Supabase setup
- ✅ Before deploying to production
- ✅ After major database changes
- ✅ When troubleshooting integration issues
- ✅ As part of CI/CD pipeline

## Continuous Integration

Add to your CI/CD pipeline:
```yaml
- name: Audit Supabase Integration
  run: npm run audit:supabase
  env:
    VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

## Report Format

The JSON report includes:
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "overallStatus": "pass",
  "results": [
    {
      "section": "Database Schema",
      "status": "pass",
      "message": "Table 'user_profiles' exists",
      "details": { "table": "user_profiles" }
    }
  ],
  "summary": {
    "passed": 45,
    "failed": 0,
    "warnings": 3
  }
}
```

## Customization

Edit `scripts/supabase-audit.ts` to:
- Add/remove tables to check
- Add custom validation logic
- Modify report format
- Add new audit sections

## Troubleshooting

### "Cannot find module 'tsx'"
Install tsx:
```bash
npm install -D tsx
```

### "Environment variables not set"
Make sure your `.env` file exists and contains:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Permission Errors
The script needs read access to:
- `.env` file
- `src/` directory
- `supabase/` directory

## Support

For issues or questions about the audit system:
1. Check the generated report for specific error details
2. Review the Supabase dashboard for configuration
3. Consult the Supabase documentation
