// Secure Form Validation
// Extracted from SecureFormComponents.tsx

import { z } from 'zod';
import { sanitizeUserInput } from '@/security/SecureAuthSystem';
import { type Failure } from '@/types/advanced-patterns';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  sanitizedData: Record<string, unknown>;
}

export class SecureFormValidator {
  private schema: z.ZodSchema;

  constructor(schema: z.ZodSchema) {
    this.schema = schema;
  }

  validate(data: unknown): ValidationResult {
    const result = this.schema.safeParse(data);

    if (result.success) {
      return {
        isValid: true,
        errors: {},
        sanitizedData: result.data
      };
    }

    const errors: Record<string, string[]> = {};

    for (const issue of result.error.issues) {
      const field = issue.path.join('.');
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(issue.message);
    }

    return {
      isValid: false,
      errors,
      sanitizedData: {}
    };
  }

  sanitizeAndValidate(data: Record<string, unknown>): ValidationResult {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        const sanitizedResult = sanitizeUserInput(value);
        if (sanitizedResult.success) {
          sanitized[key] = sanitizedResult.data;
        } else {
          return {
            isValid: false,
            errors: { [key]: [(sanitizedResult as Failure<string>).error] },
            sanitizedData: {}
          };
        }
      } else {
        sanitized[key] = value;
      }
    }

    return this.validate(sanitized);
  }
}
