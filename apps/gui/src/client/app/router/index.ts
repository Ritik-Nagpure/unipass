// src/router/routes.tsx
import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
} from '@tanstack/react-router';
import { PublicLayout, AppLayout } from '../layouts';
import HomePage from '../pages/home';
import DashboardPage from '../pages/dashboard';
import ProfilePage from '../pages/profile';
import SettingsPage from '../pages/settings';
import AboutPage from '../pages/extras/about';

// Product pages
import Features from '../pages/extras/features';
import Pricing from '../pages/extras/pricing';
import Documentation from '../pages/extras/documentation';
import Changelog from '../pages/extras/changelog';

// Company pages
import Blog from '../pages/extras/blog';
import Careers from '../pages/extras/careers';
import Contact from '../pages/extras/contact';

// Resource pages
import Community from '../pages/extras/community';
import HelpCenter from '../pages/extras/help-center';
import PrivacyPolicy from '../pages/extras/privacy-policy';
import TermsOfService from '../pages/extras/terms-of-use';
import AuthPage from '../pages/auth';
import ForgotPasswordPage from '../pages/auth/forgot-password';
import { getAuthCookie } from '../../shared/lib/cookies';

// ========================================
// AUTH UTILITY
// ========================================
const isAuthenticated = () => {
  // The backend sets httpOnly session cookies which cannot be read by JS.
  // The client keeps a lightweight marker cookie (set on login success).
  // The actual session is always verified server-side via /api/auth/me.
  return !!getAuthCookie();
};

// ========================================
// ROOT ROUTE
// ========================================
const rootRoute = createRootRoute();

// ========================================
// PUBLIC LAYOUT ROUTE
// ========================================
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public-layout',
  component: PublicLayout,
});

// ========================================
// AUTH ROUTE (Public - accessible without login)
// ========================================
const authRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/auth',
  component: AuthPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

// ========================================
// PUBLIC PAGES (Accessible without login)
// ========================================
const indexRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/about',
  component: AboutPage,
});

const featuresRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/features',
  component: Features,
});

const pricingRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/pricing',
  component: Pricing,
});

const documentationRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/documentation',
  component: Documentation,
});

const changelogRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/changelog',
  component: Changelog,
});

const blogRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/blog',
  component: Blog,
});

const careersRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/careers',
  component: Careers,
});

const contactRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/contact',
  component: Contact,
});

const communityRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/community',
  component: Community,
});

const helpCenterRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/help-center',
  component: HelpCenter,
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/privacy-policy',
  component: PrivacyPolicy,
});

const termsOfServiceRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/terms-of-service',
  component: TermsOfService,
});

// ========================================
// APP LAYOUT ROUTE (Protected)
// ========================================
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app-layout',
  component: AppLayout,
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/',
      });
    }
  },
});

// ========================================
// PROTECTED PAGES (Require login)
// ========================================
const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const profileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/profile',
  component: ProfilePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/settings',
  component: SettingsPage,
});

// ========================================
// ROUTE TREE
// ========================================
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    authRoute,
    forgotPasswordRoute,
    indexRoute,
    aboutRoute,
    featuresRoute,
    pricingRoute,
    documentationRoute,
    changelogRoute,
    blogRoute,
    careersRoute,
    contactRoute,
    communityRoute,
    helpCenterRoute,
    privacyPolicyRoute,
    termsOfServiceRoute,
  ]),
  appLayoutRoute.addChildren([
    dashboardRoute,
    profileRoute,
    settingsRoute,
  ]),
]);

// ========================================
// ROUTER
// ========================================
export const router = createRouter({
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}