
export interface NavItem {
  label: string;
  path: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const meditateSection: NavSection = {
  title: "Meditate",
  items: [
    { label: "All Sessions", path: "/meditate" },
    { label: "Guided Meditation", path: "/meditate?tab=guided" },
    { label: "Quick Sessions", path: "/meditate?tab=quick" },
    { label: "Deep Focus", path: "/meditate?tab=deep" },
    { label: "Sleep", path: "/meditate?tab=sleep" }
  ]
};

export const breathingSection: NavSection = {
  title: "Breathing",
  items: [
    { label: "Breathing Exercises", path: "/breathe" },
    { label: "Breathing Techniques", path: "/breathe?tab=techniques" },
    { label: "Box Breathing", path: "/breathe?tab=techniques&technique=box" },
    { label: "4-7-8 Breathing", path: "/breathe?tab=techniques&technique=478" },
    { label: "Coherent Breathing", path: "/breathe?tab=techniques&technique=coherent" }
  ]
};
