#!/bin/bash

# Load environment variables
export $(cat .env | xargs)

# Run the audit script
npx tsx scripts/supabase-audit.ts
