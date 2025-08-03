/**
 * API-related constants
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh'
  },
  MEDITATION: {
    SESSIONS: '/meditation/sessions',
    FAVORITES: '/meditation/favorites',
    PROGRESS: '/meditation/progress'
  },
  BIOFEEDBACK: {
    DEVICES: '/biofeedback/devices',
    DATA: '/biofeedback/data'
  },
  FOCUS: {
    SESSIONS: '/focus/sessions',
    ANALYTICS: '/focus/analytics'
  }
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;