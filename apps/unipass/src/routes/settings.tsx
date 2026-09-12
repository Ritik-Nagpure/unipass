import { createRoute } from '@tanstack/react-router'
import { authenticatedRoute } from './_authenticated'
import SettingsPage from '../app/features/settings'

export const settingsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/settings',
  component: SettingsPage,
})