import { http, HttpResponse } from 'msw'

export const meditationHandlers = [
  // Mock meditation content endpoints
  http.get('*/rest/v1/meditation_content', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Meditation',
        description: 'A test meditation session',
        duration: 600,
        category: 'mindfulness',
        subscription_tier: 'free',
        is_active: true,
        created_at: new Date().toISOString()
      }
    ])
  }),

  // Mock session tracking
  http.post('*/rest/v1/meditation_sessions', () => {
    return HttpResponse.json({
      id: 'session-1',
      user_id: 'mock-user-id',
      duration: 600,
      completed: true,
      created_at: new Date().toISOString()
    })
  })
]