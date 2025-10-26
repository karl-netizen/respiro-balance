/**
 * Secure Admin Authentication Helper
 *
 * CRITICAL: This module provides SERVER-SIDE admin validation
 * DO NOT use client-side app_metadata checks for authorization!
 *
 * All admin operations MUST go through the admin-check Edge Function
 */

import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'user' | 'moderator' | 'admin' | 'super_admin';

interface AdminCheckResponse {
  authorized: boolean;
  userId?: string;
  userEmail?: string;
  roles?: UserRole[];
  operation?: string;
  error?: string;
  requiredRole?: UserRole;
}

/**
 * SERVER-SIDE admin check via Edge Function
 * This is the ONLY secure way to verify admin status
 *
 * @param operation - Description of the operation being performed
 * @param requiredRole - Minimum role required (default: 'admin')
 * @returns Promise with authorization result
 */
export async function checkAdminRole(
  operation: string,
  requiredRole: UserRole = 'admin'
): Promise<AdminCheckResponse> {
  try {
    // Get current session token
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return {
        authorized: false,
        error: 'Not authenticated',
      };
    }

    // Call server-side admin check Edge Function
    const { data, error } = await supabase.functions.invoke('admin-check', {
      body: {
        operation,
        requiredRole,
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('Admin check error:', error);
      return {
        authorized: false,
        error: error.message || 'Failed to verify admin status',
      };
    }

    return data as AdminCheckResponse;
  } catch (error) {
    console.error('Admin check exception:', error);
    return {
      authorized: false,
      error: 'Failed to verify admin status',
    };
  }
}

/**
 * Checks if current user has admin role
 * Uses server-side validation
 */
export async function isAdmin(): Promise<boolean> {
  const result = await checkAdminRole('check_admin_status', 'admin');
  return result.authorized;
}

/**
 * Checks if current user has super_admin role
 * Uses server-side validation
 */
export async function isSuperAdmin(): Promise<boolean> {
  const result = await checkAdminRole('check_super_admin_status', 'super_admin');
  return result.authorized;
}

/**
 * Checks if current user has moderator or higher role
 * Uses server-side validation
 */
export async function isModerator(): Promise<boolean> {
  const result = await checkAdminRole('check_moderator_status', 'moderator');
  return result.authorized;
}

/**
 * Get all roles for the current user
 * Uses server-side query
 */
export async function getCurrentUserRoles(): Promise<UserRole[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .is('revoked_at', null);

    if (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }

    return data.map((r: any) => r.role as UserRole);
  } catch (error) {
    console.error('Error getting current user roles:', error);
    return [];
  }
}

/**
 * Requires admin role or throws error
 * Use in protected admin routes/components
 */
export async function requireAdmin(operation: string): Promise<void> {
  const result = await checkAdminRole(operation, 'admin');

  if (!result.authorized) {
    throw new Error(result.error || 'Unauthorized: Admin access required');
  }
}

/**
 * Requires super_admin role or throws error
 */
export async function requireSuperAdmin(operation: string): Promise<void> {
  const result = await checkAdminRole(operation, 'super_admin');

  if (!result.authorized) {
    throw new Error(result.error || 'Unauthorized: Super Admin access required');
  }
}

/**
 * Upload meditation audio with server-side admin validation
 * This is the SECURE way to upload audio files
 */
export async function uploadMeditationAudio(
  file: File,
  metadata: {
    title: string;
    description?: string;
    duration?: number;
  }
): Promise<{ success: boolean; audio?: any; error?: string }> {
  try {
    // Verify admin status first (client-side check for UX, but server validates)
    const adminCheck = await checkAdminRole('upload_meditation_audio', 'admin');

    if (!adminCheck.authorized) {
      return {
        success: false,
        error: 'Only administrators can upload meditation audio',
      };
    }

    // Get session token
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', metadata.title);
    if (metadata.description) {
      formData.append('description', metadata.description);
    }
    if (metadata.duration) {
      formData.append('duration', metadata.duration.toString());
    }

    // Call Edge Function for secure upload
    const { data, error } = await supabase.functions.invoke('upload-meditation-audio', {
      body: formData,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload audio',
      };
    }

    return {
      success: true,
      audio: data.audio,
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return {
      success: false,
      error: 'Failed to upload audio',
    };
  }
}

/**
 * DEPRECATED: Do NOT use this function
 * Client-side app_metadata checks are NOT secure
 *
 * @deprecated Use checkAdminRole() instead
 */
export function unsafeClientSideAdminCheck(): never {
  throw new Error(
    'SECURITY ERROR: Client-side admin checks are not secure. Use checkAdminRole() instead.'
  );
}
