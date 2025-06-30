
export interface NavItem {
  label: string;
  path: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const homeSection: NavSection = {
  title: "Home",
  items: [
    { label: "Landing Page", path: "/" },
    { label: "Dashboard", path: "/dashboard" }
  ]
};

export const meditateSection: NavSection = {
  title: "Meditate",
  items: [
    { label: "Guided Meditation", path: "/meditation?tab=guided" },
    { label: "Quick Sessions", path: "/meditation?tab=quick" },
    { label: "Deep Focus", path: "/meditation?tab=deep" },
    { label: "Sleep", path: "/meditation?tab=sleep" }
  ]
};

export const breathingSection: NavSection = {
  title: "Breathing",
  items: [
    { label: "Breathing Exercises", path: "/breathe" },
    { label: "Breathing Techniques", path: "/breathe?tab=techniques" },
    { label: "Box Breathing", path: "/breathe?tab=techniques&technique=box" },
    { label: "4-7-8 Breathing", path: "/breathe?tab=techniques&technique=478" },
    { label: "Coherent Breathing", path: "/breathe?tab=techniques&technique=coherent" },
    { label: "Alternate Nostril", path: "/breathe?tab=techniques&technique=alternate" }
  ]
};

export const workLifeBalanceSection: NavSection = {
  title: "Work-Life Balance",
  items: [
    { label: "Balance Tools", path: "/work-life-balance" },
    { label: "Break Reminders", path: "/work-life-balance#breaks" },
    { label: "Focus Mode", path: "/work-life-balance#focus" },
    { label: "Biofeedback", path: "/work-life-balance#biofeedback" }
  ]
};
