# Respiro Balance - Production Deployment Checklist

**Status**: Ready for deployment after completing this checklist
**Last Updated**: 2025-10-25

---

## ✅ CRITICAL PRE-DEPLOYMENT FIXES

### 1. Demo Mode Configuration - **COMPLETED** ✅
- [x] Changed default from `true` to `false` in `src/config/environment.ts:50`
- [x] Verified build passes (36.95s)
- [x] Verified TypeScript compilation passes
- [x] `.env.example` correctly shows `VITE_DEMO_MODE=false`

**Production Risk Eliminated**: App will no longer default to demo mode if environment variable is missing.

---

## 🔴 REMAINING CRITICAL BLOCKERS

### 2. PWA Icons - **REQUIRED BEFORE LAUNCH**
**Status**: ❌ Not completed
**Time Required**: 2 hours
**Impact**: PWA install will fail, 40% engagement loss

**Files Needed** (in `public/` directory):
- [ ] `icon-72x72.png`
- [ ] `icon-96x96.png`
- [ ] `icon-128x128.png`
- [ ] `icon-144x144.png`
- [ ] `icon-152x152.png`
- [ ] `icon-192x192.png`
- [ ] `icon-384x384.png`
- [ ] `icon-512x512.png`

**Tools**:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

**Steps**:
1. Create/obtain app logo (512x512 PNG minimum)
2. Use icon generator to create all sizes
3. Download and place in `public/` directory
4. Test PWA manifest: `npx vite-plugin-pwa generate-assets`

---

### 3. Deployment Platform Configuration - **REQUIRED**
**Status**: ❌ Not completed
**Time Required**: 2-3 hours

**Choose ONE platform**:

#### Option A: Vercel (Recommended for Vite)
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "NODE_VERSION": "20"
  },
  "headers": [
    {
      "source": "/service-worker.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Environment Variables to Set in Vercel Dashboard**:
- `VITE_SUPABASE_URL` = Your Supabase URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
- `VITE_APP_ENV` = `production`
- `VITE_DEMO_MODE` = `false`
- `VITE_SITE_URL` = Your production URL
- `VITE_ENABLE_BIOMETRIC_INTEGRATION` = `true`
- `VITE_ENABLE_OFFLINE_MODE` = `true`
- `VITE_CSP_ENABLED` = `true`

#### Option B: Netlify
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

---

### 4. Supabase Edge Functions - **VERIFY DEPLOYMENT**
**Status**: ⚠️ Needs verification
**Time Required**: 1 hour

**Required Edge Functions**:
- [ ] `create-checkout-session` - Payment processing
- [ ] `stripe-webhook` - Stripe webhook handler
- [ ] `create-portal-session` - Customer portal

**Supabase Secrets to Set**:
```bash
# Set these in Supabase Dashboard > Edge Functions > Secrets
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SIGNING_SECRET=whsec_...
supabase secrets set STRIPE_STANDARD_MONTHLY_PRICE_ID=price_...
supabase secrets set STRIPE_STANDARD_YEARLY_PRICE_ID=price_...
supabase secrets set STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_...
supabase secrets set STRIPE_PREMIUM_YEARLY_PRICE_ID=price_...
```

**Deployment**:
```bash
cd supabase/functions
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy create-portal-session
```

---

## ⚠️ SECURITY WARNINGS TO ADDRESS

Based on reported issues:

### 1. Leaked Password Protection Disabled
**Action Required**: Investigate and enable password leak protection
- [ ] Review authentication configuration
- [ ] Enable Supabase password leak detection
- [ ] Test signup flow

### 2. Postgres Version Has Security Patches
**Action Required**: Update Postgres version in Supabase
- [ ] Check current Postgres version in Supabase dashboard
- [ ] Schedule maintenance window for upgrade
- [ ] Update to latest patched version

### 3. User Activity Patterns Exposed
**Action Required**: Review privacy/GDPR compliance
- [ ] Audit what user activity data is exposed
- [ ] Implement proper access controls
- [ ] Add privacy controls to user settings

### 4. Challenge System Can Be Manipulated
**Action Required**: Review authorization logic
- [ ] Audit challenge system endpoints
- [ ] Add server-side validation
- [ ] Implement rate limiting

---

## 🔍 PRE-DEPLOYMENT TESTING

### Build Verification
- [x] Production build succeeds: `npm run build` ✅
- [x] TypeScript compilation passes: `npm run typecheck` ✅
- [ ] Bundle size acceptable (page-dashboard at 644KB - consider code splitting)
- [ ] No console errors in production build

### Functional Testing
- [ ] Authentication flow (signup, login, logout)
- [ ] Payment processing (Stripe checkout)
- [ ] Session limit enforcement (free tier: 5 sessions)
- [ ] Module activation (Standard: 2 modules, Premium: unlimited)
- [ ] PWA installation (iOS + Android)
- [ ] Offline mode functionality
- [ ] Biometric integration (if enabled)

### Security Testing
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] Authentication tokens secure
- [ ] Rate limiting active
- [ ] Input validation working

---

## 📋 DEPLOYMENT STEPS

### Phase 1: Platform Setup (30 min)
1. [ ] Create Vercel/Netlify account
2. [ ] Connect GitHub repository
3. [ ] Configure environment variables
4. [ ] Set up custom domain (if applicable)

### Phase 2: Deploy to Staging (1 hour)
1. [ ] Deploy to staging environment
2. [ ] Run smoke tests
3. [ ] Verify all environment variables loaded
4. [ ] Test payment flow with Stripe test keys
5. [ ] Verify PWA installation

### Phase 3: Production Deploy (30 min)
1. [ ] Update Stripe keys to production
2. [ ] Deploy to production
3. [ ] Verify DNS/domain configuration
4. [ ] Run production smoke tests

### Phase 4: Post-Deploy Verification (1 hour)
1. [ ] Test user signup flow
2. [ ] Complete a real payment (small amount)
3. [ ] Verify analytics tracking
4. [ ] Check error logging/monitoring
5. [ ] Test PWA install on real devices

---

## 🚨 EMERGENCY ROLLBACK PLAN

If critical issues occur:

1. **Vercel**: Rollback to previous deployment
   - Dashboard > Deployments > Previous > "Promote to Production"

2. **Netlify**: Restore previous deploy
   - Deploys > Previous deploy > "Publish deploy"

3. **Enable Demo Mode** (Emergency only):
   ```bash
   # In platform dashboard, temporarily set:
   VITE_DEMO_MODE=true
   ```

---

## 📊 POST-LAUNCH MONITORING

### First 24 Hours
- [ ] Monitor error rates (Sentry/LogRocket)
- [ ] Check payment success rate
- [ ] Verify user signup completion rate
- [ ] Monitor API response times
- [ ] Check mobile PWA install rate

### First Week
- [ ] Review user feedback
- [ ] Analyze conversion funnel
- [ ] Check session limit enforcement
- [ ] Monitor subscription churn
- [ ] Review analytics data

---

## ✅ SIGN-OFF

**Deployment Approved By**: _________________
**Date**: _________________
**Environment**: Production
**Version**: _________________

**Critical Fixes Completed**:
- [x] Demo mode default fixed (now defaults to `false`)
- [ ] PWA icons generated and deployed
- [ ] Deployment platform configured
- [ ] Security warnings addressed
- [ ] Payment integration tested in production

---

## 📞 SUPPORT CONTACTS

**Technical Issues**:
- GitHub Issues: https://github.com/karl-netizen/respiro-balance/issues
- Email: karl@knowledgemechanix.com

**Platform Support**:
- Supabase: https://supabase.com/dashboard/support
- Vercel: https://vercel.com/support
- Stripe: https://support.stripe.com

---

**Next Steps**: Complete PWA icons generation and deployment platform configuration to achieve 90/100 launch readiness score.
