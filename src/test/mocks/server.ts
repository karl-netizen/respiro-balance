import { setupServer } from 'msw/node'
import { authHandlers } from './handlers/auth'
import { meditationHandlers } from './handlers/meditation'
import { enterpriseHandlers } from './handlers/enterprise'

export const server = setupServer(
  ...authHandlers,
  ...meditationHandlers,
  ...enterpriseHandlers
)