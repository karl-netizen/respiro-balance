
import BusinessSelectionStep from "./BusinessSelectionStep";
import WorkScheduleStep from "./WorkScheduleStep";
import StressFocusStep from "./StressFocusStep";
import LunchBreakStep from "./LunchBreakStep";
import ExerciseStep from "./ExerciseStep";
import SleepStep from "./SleepStep";
import MeditationExperienceStep from "./MeditationExperienceStep";
import BiofeedbackStep from "./BiofeedbackStep";
import NotificationPreferencesStep from "./NotificationPreferencesStep";
import FinalStep from "./FinalStep";

// Export all steps
export const onboardingSteps = [
  {
    id: "business",
    title: "Business Selection",
    component: BusinessSelectionStep
  },
  {
    id: "work-schedule",
    title: "Work Schedule",
    component: WorkScheduleStep
  },
  {
    id: "stress-focus",
    title: "Stress & Focus",
    component: StressFocusStep
  },
  {
    id: "lunch-break",
    title: "Lunch Break",
    component: LunchBreakStep
  },
  {
    id: "exercise",
    title: "Exercise",
    component: ExerciseStep
  },
  {
    id: "sleep",
    title: "Sleep",
    component: SleepStep
  },
  {
    id: "meditation-experience",
    title: "Meditation Experience",
    component: MeditationExperienceStep
  },
  {
    id: "biofeedback",
    title: "Biofeedback",
    component: BiofeedbackStep
  },
  {
    id: "notifications",
    title: "Notifications",
    component: NotificationPreferencesStep
  },
  {
    id: "final",
    title: "All Set!",
    component: FinalStep
  }
];

export default onboardingSteps;
