import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import Layout from '../';
import HomePage from '../pages/home';
import DashboardPage from '../pages/dashboard';
import ProfilePage from '../pages/profile';
import SettingsPage from '../pages/settings';
import AboutPage from '../pages/about';

// Root route with Layout
const rootRoute = createRootRoute({
  component: Layout,
});

// Index route (Home)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

// Dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

// Profile route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

// About route
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  profileRoute,
  settingsRoute,
  aboutRoute,
]);

// Create router
export const router = createRouter({
  routeTree,
});

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}