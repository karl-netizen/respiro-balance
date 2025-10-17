// Security Module - Barrel Export
// Consolidated security components, utilities, and validators

// XSS Protection Utilities
export * from './utils/XssProtection';

// CSRF Protection
export * from './context/CsrfProvider';

// Form Validation
export { SecureFormValidator } from './validators/SecureFormValidator';

// Security Components
export { SecurePasswordChangeForm } from './components/SecurePasswordChangeForm';
export { SecureInput } from './components/SecureInput';

// Login Form (still in main file until fully migrated)
export {
  EnhancedSecureLoginForm,
  CSRFProvider,
  useCSRF,
  SecureFormValidator as SecureValidator,
  SecurePasswordChangeForm as PasswordChangeForm,
  SecureInput as SecInput,
  generateCSPHeader,
  encodeHtml,
  decodeHtml,
  sanitizeUrl,
  safeJsonParse
} from './SecureFormComponents';
