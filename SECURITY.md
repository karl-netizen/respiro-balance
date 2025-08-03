# Security Guide for Respiro Balance

## Overview
This document outlines the security implementation and best practices for the Respiro Balance application.

## ✅ Implemented Security Measures

### 1. Credential Security
- **Environment Variables**: All sensitive credentials moved to environment variables
- **No Hardcoded Secrets**: Removed all hardcoded API keys and URLs from source code
- **Validation**: Environment variable validation at startup with clear error messages
- **Rate Limiting**: Client-side rate limiting for authentication attempts

### 2. Authentication Security
- **Secure Session Management**: Proper cleanup of authentication tokens
- **Password Validation**: Strong password requirements with strength checking
- **Input Sanitization**: XSS prevention through input sanitization
- **Session Cleanup**: Comprehensive clearing of security-sensitive data on logout

### 3. Infrastructure Security
- **Security Headers**: Implemented CSP, X-Frame-Options, X-Content-Type-Options
- **HTTPS Enforcement**: Configuration for HTTPS redirection in production
- **Content Security Policy**: Restrictive CSP preventing XSS attacks

## 🔧 Required Environment Variables

### Development (.env)
```bash
# Required
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_ENV=development
VITE_SITE_URL=http://localhost:8080

# Optional
VITE_DEMO_MODE=true
VITE_ENABLE_BIOMETRIC_INTEGRATION=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_CSP_ENABLED=false
```

### Production
```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_APP_ENV=production
VITE_SITE_URL=https://your-domain.com

# Security
VITE_DEMO_MODE=false
VITE_CSP_ENABLED=true

# Features
VITE_ENABLE_BIOMETRIC_INTEGRATION=true
VITE_ENABLE_OFFLINE_MODE=true
```

## 🚀 Deployment Security Checklist

### Pre-Deployment
- [ ] Set `VITE_APP_ENV=production`
- [ ] Disable demo mode: `VITE_DEMO_MODE=false`
- [ ] Enable CSP: `VITE_CSP_ENABLED=true`
- [ ] Verify all environment variables are set
- [ ] Update Supabase authentication settings (Site URL, Redirect URLs)

### Post-Deployment
- [ ] Verify security headers are present
- [ ] Test authentication flows
- [ ] Confirm HTTPS is enforced
- [ ] Validate CSP is not blocking legitimate resources
- [ ] Monitor for security events in logs

## 🛡️ Security Features by File

### `/src/config/environment.ts`
- Centralized environment variable management
- Startup validation with clear error messages
- Type-safe configuration object
- Production security checks

### `/src/utils/security.ts`
- Input sanitization functions
- Password strength validation
- Rate limiting implementation
- Session cleanup utilities
- Security event logging

### `/src/hooks/useSecureAuth.ts`
- Secure authentication flows
- Rate limiting for login attempts
- Proper session management
- Security event logging

### `/public/.htaccess`
- Security headers configuration
- HTTPS redirection
- Cache control for static assets

## 🔍 Security Monitoring

### Authentication Events
- Login attempts (successful/failed)
- Rate limiting triggers
- Session cleanup events
- Password reset requests

### Security Headers
The application implements the following security headers:
- `Content-Security-Policy`: Prevents XSS attacks
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-XSS-Protection`: Additional XSS protection

## ⚠️ Security Considerations

### Known Limitations
1. **Client-Side Rate Limiting**: Can be bypassed by clearing local storage
2. **CSP Inline Scripts**: Some inline scripts may require nonce implementation
3. **Demo Mode**: Should be disabled in production environments

### Recommended Enhancements
1. **Server-Side Rate Limiting**: Implement in Supabase Edge Functions
2. **IP-Based Blocking**: Add IP-based rate limiting for repeated failures
3. **Security Headers Middleware**: Server-side security header enforcement
4. **Audit Logging**: Centralized security event logging to external service

## 🆘 Security Incident Response

### If Credentials Are Compromised
1. Immediately rotate Supabase keys in dashboard
2. Update environment variables in all environments
3. Force logout all users (if possible)
4. Review access logs for unauthorized activity

### If Security Vulnerability Found
1. Document the vulnerability
2. Assess impact and affected systems
3. Implement fix following this security guide
4. Test fix in staging environment
5. Deploy to production with monitoring

## 📞 Support

For security-related questions or to report vulnerabilities:
- Review this documentation first
- Check Supabase security best practices
- Consult with security team for critical issues

## 🔄 Updates

This security guide should be updated whenever:
- New security features are implemented
- Environment variables change
- Deployment procedures change
- Security vulnerabilities are discovered and fixed