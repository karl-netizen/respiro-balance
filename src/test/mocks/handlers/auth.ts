import { http, HttpResponse } from 'msw'

export const authHandlers = [
  // Mock Supabase auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        email_confirmed_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {}
      }
    })
  }),

  http.get('*/auth/v1/user', () => {
    return HttpResponse.json({
      id: 'mock-user-id',
      email: 'test@example.com',
      email_confirmed_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {}
    })
  })
]