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

export const LazyOnboardingFlow = lazy(() => 
  import('@/pages/OnboardingFlow')
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
};
