import { http, HttpResponse } from 'msw'

export const enterpriseHandlers = [
  // Mock enterprise user management
  http.get('*/rest/v1/enterprise_users', () => {
    return HttpResponse.json([
      {
        id: '1',
        user_id: 'mock-user-id',
        organization_id: 'org-1',
        role: 'admin',
        status: 'active',
        created_at: new Date().toISOString()
      }
    ])
  }),

  // Mock organization data
  http.get('*/rest/v1/organizations', () => {
    return HttpResponse.json([
      {
        id: 'org-1',
        name: 'Test Corporation',
        tier: 'enterprise',
        settings: {
          white_label: true,
          custom_branding: true
        },
        created_at: new Date().toISOString()
      }
    ])
  }),

  // Mock analytics endpoints
  http.get('*/rest/v1/enterprise_analytics', () => {
    return HttpResponse.json({
      total_users: 150,
      active_users: 120,
      engagement_rate: 0.85,
      wellness_score: 7.2,
      roi_metrics: {
        stress_reduction: 25,
        productivity_increase: 15,
        absenteeism_reduction: 10
      }
    })
  })
]