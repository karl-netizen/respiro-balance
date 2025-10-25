/**
 * Zod Validation Schemas for Database Operations
 *
 * SECURITY: All database mutations MUST use these schemas
 * to prevent XSS, injection, and data corruption attacks.
 */

import { z } from 'zod';

// ==========================================
// SOCIAL POSTS VALIDATION
// ==========================================

export const socialPostSchema = z.object({
  content: z.string()
    .min(1, 'Post content cannot be empty')
    .max(5000, 'Post content cannot exceed 5000 characters')
    .trim()
    // Remove potential XSS
    .transform(str => str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')),

  post_type: z.enum(['text', 'achievement', 'challenge', 'milestone'])
    .default('text'),

  image_url: z.string()
    .url('Invalid image URL')
    .startsWith('https://', 'Image URL must use HTTPS')
    .optional()
    .nullable(),

  tags: z.array(z.string().max(50))
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .default([]),
});

export type SocialPostInput = z.infer<typeof socialPostSchema>;

// ==========================================
// MEDITATION SESSION VALIDATION
// ==========================================

export const meditationSessionSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),

  description: z.string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .trim()
    .optional()
    .nullable(),

  duration: z.number()
    .int('Duration must be a whole number')
    .positive('Duration must be positive')
    .min(60, 'Minimum session duration is 1 minute')
    .max(10800, 'Maximum session duration is 3 hours'),

  audio_url: z.string()
    .url('Invalid audio URL')
    .refine(
      (url) => {
        // Only allow HTTPS URLs from Supabase storage or approved CDNs
        const allowedHosts = [
          'supabase.co',
          'amazonaws.com',
          'cloudfront.net',
        ];
        try {
          const urlObj = new URL(url);
          return urlObj.protocol === 'https:' &&
                 allowedHosts.some(host => urlObj.hostname.includes(host));
        } catch {
          return false;
        }
      },
      'Audio URL must be from approved storage provider'
    )
    .optional()
    .nullable(),

  category: z.enum([
    'stress_relief',
    'focus',
    'sleep',
    'mindfulness',
    'breathwork',
    'body_scan',
    'loving_kindness',
    'walking',
    'eating',
    'work',
  ]).optional().nullable(),

  difficulty: z.enum(['beginner', 'intermediate', 'advanced'])
    .default('beginner'),

  tags: z.array(z.string().max(50))
    .max(15, 'Maximum 15 tags allowed')
    .optional()
    .default([]),

  mood_before: z.number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .nullable(),

  mood_after: z.number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .nullable(),
});

export type MeditationSessionInput = z.infer<typeof meditationSessionSchema>;

// ==========================================
// AUDIO FILE UPLOAD VALIDATION
// ==========================================

export const audioFileUploadSchema = z.object({
  file_name: z.string()
    .min(1, 'File name is required')
    .max(255, 'File name too long')
    .regex(/^[a-zA-Z0-9_\-. ]+$/, 'File name contains invalid characters'),

  file_path: z.string()
    .min(1, 'File path is required')
    .max(500, 'File path too long'),

  file_size: z.number()
    .int()
    .positive()
    .max(100 * 1024 * 1024, 'File size cannot exceed 100MB'),

  duration: z.number()
    .int()
    .positive()
    .max(7200, 'Audio duration cannot exceed 2 hours')
    .optional()
    .nullable(),

  file_type: z.string()
    .regex(/^audio\/(mpeg|mp3|wav|ogg|m4a)$/, 'Invalid audio file type'),

  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title too long')
    .trim(),

  description: z.string()
    .max(1000, 'Description too long')
    .trim()
    .optional()
    .nullable(),
});

export type AudioFileUploadInput = z.infer<typeof audioFileUploadSchema>;

// ==========================================
// USER PROFILE UPDATE VALIDATION
// ==========================================

export const userProfileUpdateSchema = z.object({
  display_name: z.string()
    .min(1, 'Display name is required')
    .max(100, 'Display name too long')
    .trim()
    .optional(),

  bio: z.string()
    .max(500, 'Bio cannot exceed 500 characters')
    .trim()
    .optional()
    .nullable(),

  avatar_url: z.string()
    .url('Invalid avatar URL')
    .startsWith('https://', 'Avatar URL must use HTTPS')
    .optional()
    .nullable(),

  meditation_goal: z.enum([
    'stress_relief',
    'better_sleep',
    'focus',
    'anxiety',
    'mindfulness',
    'habit_building',
  ]).optional().nullable(),

  daily_goal_minutes: z.number()
    .int()
    .min(5, 'Daily goal must be at least 5 minutes')
    .max(180, 'Daily goal cannot exceed 3 hours')
    .optional()
    .nullable(),
});

export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;

// ==========================================
// CHALLENGE PROGRESS UPDATE VALIDATION
// ==========================================

export const challengeProgressUpdateSchema = z.object({
  challenge_id: z.string()
    .uuid('Invalid challenge ID'),

  progress: z.number()
    .int('Progress must be a whole number')
    .min(0, 'Progress cannot be negative')
    .max(100, 'Progress cannot exceed 100'),

  increment: z.number()
    .int()
    .positive('Increment must be positive')
    .max(100, 'Increment too large')
    .optional(),
});

export type ChallengeProgressUpdateInput = z.infer<typeof challengeProgressUpdateSchema>;

// ==========================================
// COMMENT VALIDATION
// ==========================================

export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment cannot exceed 2000 characters')
    .trim()
    .transform(str => str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')),

  post_id: z.string()
    .uuid('Invalid post ID'),

  parent_comment_id: z.string()
    .uuid('Invalid parent comment ID')
    .optional()
    .nullable(),
});

export type CommentInput = z.infer<typeof commentSchema>;

// ==========================================
// FRIEND REQUEST VALIDATION
// ==========================================

export const friendRequestSchema = z.object({
  friend_email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),

  message: z.string()
    .max(500, 'Message cannot exceed 500 characters')
    .trim()
    .optional()
    .nullable(),
});

export type FriendRequestInput = z.infer<typeof friendRequestSchema>;

// ==========================================
// PRIVACY SETTINGS VALIDATION
// ==========================================

export const privacySettingsSchema = z.object({
  profile_visibility: z.enum(['public', 'friends', 'private'])
    .default('friends'),

  activity_visibility: z.enum(['public', 'friends', 'private'])
    .default('friends'),

  stats_visibility: z.enum(['public', 'friends', 'private'])
    .default('friends'),

  leaderboard_visible: z.boolean()
    .default(true),
});

export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>;

// ==========================================
// NOTIFICATION PREFERENCES VALIDATION
// ==========================================

export const notificationPreferencesSchema = z.object({
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(true),
  daily_reminder: z.boolean().default(true),
  reminder_time: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (use HH:MM)')
    .optional()
    .nullable(),
  achievement_notifications: z.boolean().default(true),
  social_notifications: z.boolean().default(true),
  challenge_notifications: z.boolean().default(true),
});

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Validates data against a schema and throws descriptive errors
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validation failed: ${messages}`);
    }
    throw error;
  }
}

/**
 * Validates data and returns success/error result
 */
export function validateSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
  };
}

/**
 * Sanitizes HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

/**
 * Validates URL is safe for use
 */
export function isSafeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Only allow http(s) protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    // Block javascript: and data: URLs
    if (urlObj.protocol === 'javascript:' || urlObj.protocol === 'data:') {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
