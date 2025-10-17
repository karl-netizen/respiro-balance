import { lazy } from 'react';

// Lazy load heavy pages for better performance
export const LazyPricingPage = lazy(() => 
  import('@/pages/PricingPage').then(module => ({
    default: module.default
  }))
);

export const LazyAccountSettings = lazy(() => 
  import('@/pages/AccountSettings')
);

export const LazyModuleLibraryPage = lazy(() =>
  import('@/pages/ModuleLibraryPage')
);

export const LazyBiofeedbackSettings = lazy(() =>
  import('@/pages/BiofeedbackSettings')
);

export const LazyMeditationLibrary = lazy(() =>
  import('@/pages/MeditationLibrary')
);

export const LazyProgressPage = lazy(() =>
  import('@/pages/Progress')
);

export const LazyFocusPage = lazy(() =>
  import('@/pages/FocusPage')
);

export const LazyWorkLifeBalance = lazy(() =>
  import('@/pages/WorkLifeBalance')
);

export const LazyMorningRitual = lazy(() =>
  import('@/pages/MorningRitual')
);

export const LazyBreathePage = lazy(() =>
  import('@/pages/Breathe')
);

export const LazySocialPage = lazy(() =>
  import('@/pages/SocialPage')
);

// Additional lazy-loaded pages
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyProfilePage = lazy(() => import('@/pages/ProfilePage'));
export const LazySettingsPage = lazy(() => import('@/pages/SettingsPage'));
export const LazySystemDashboardPage = lazy(() => import('@/pages/SystemDashboardPage'));
export const LazyMeditate = lazy(() => import('@/pages/Meditate'));
export const LazyBiofeedbackPage = lazy(() => import('@/pages/BiofeedbackPage'));
export const LazySubscriptionPage = lazy(() => import('@/pages/SubscriptionPage'));
export const LazyPremiumPlusPage = lazy(() => import('@/pages/PremiumPlusPage'));
export const LazyMeditateAdvanced = lazy(() => import('@/pages/MeditateAdvanced'));
export const LazyPremiumProPage = lazy(() => import('@/pages/PremiumProPage'));
export const LazyUserJourneyTestingPage = lazy(() => import('@/pages/UserJourneyTestingPage'));
export const LazyMeditationAudioManagement = lazy(() => import('@/pages/MeditationAudioManagement'));
export const LazyMeditationSessionPage = lazy(() => import('@/pages/MeditationSessionPage'));
export const LazyMeditationMonitorPage = lazy(() => import('@/pages/MeditationMonitorPage'));
export const LazySetupGuidePage = lazy(() => import('@/pages/SetupGuidePage'));
export const LazyHelpPage = lazy(() => import('@/pages/HelpPage'));
export const LazyContactPage = lazy(() => import('@/pages/ContactPage'));
export const LazyPrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
export const LazyTermsPage = lazy(() => import('@/pages/TermsPage'));
export const LazyOnboardingPage = lazy(() => import('@/pages/Onboarding'));

// Preload critical routes for faster navigation
export const preloadPricingPage = () => {
  import('@/pages/PricingPage');
};

export const preloadAccountSettings = () => {
  import('@/pages/AccountSettings');
};

export const preloadModuleLibrary = () => {
  import('@/pages/ModuleLibraryPage');
};

export const preloadMeditationLibrary = () => {
  import('@/pages/MeditationLibrary');
};

export const preloadDashboard = () => {
  import('@/pages/Dashboard');
};

export const preloadProgress = () => {
  import('@/pages/Progress');
};

// Preload on user interaction (e.g., hover over link)
export const setupPreloadHooks = () => {
  // Preload pricing page when user hovers over upgrade button
  const upgradeButtons = document.querySelectorAll('[data-preload="pricing"]');
  upgradeButtons.forEach(button => {
    button.addEventListener('mouseenter', preloadPricingPage, { once: true });
  });

  // Preload account settings when user hovers over account menu
  const accountButtons = document.querySelectorAll('[data-preload="account"]');
  accountButtons.forEach(button => {
    button.addEventListener('mouseenter', preloadAccountSettings, { once: true });
  });

  // Preload modules when user hovers over modules button
  const moduleButtons = document.querySelectorAll('[data-preload="modules"]');
  moduleButtons.forEach(button => {
    button.addEventListener('mouseenter', preloadModuleLibrary, { once: true });
  });

  // Preload dashboard for logged-in users
  const dashboardButtons = document.querySelectorAll('[data-preload="dashboard"]');
  dashboardButtons.forEach(button => {
    button.addEventListener('mouseenter', preloadDashboard, { once: true });
  });

  // Preload progress page
  const progressButtons = document.querySelectorAll('[data-preload="progress"]');
  progressButtons.forEach(button => {
    button.addEventListener('mouseenter', preloadProgress, { once: true });
  });
};
