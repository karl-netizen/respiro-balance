
import React from "react";
import WorkScheduleStep from "../steps/WorkScheduleStep";
import StressFocusStep from "../steps/StressFocusStep";
import MeditationExperienceStep from "../steps/MeditationExperienceStep";
import BiofeedbackStep from "../steps/BiofeedbackStep";
import NotificationPreferencesStep from "../steps/NotificationPreferencesStep";
import SleepStep from "../steps/SleepStep";
import MorningRitualStep from "../steps/MorningRitualStep";
import TimeManagementStep from "../steps/TimeManagementStep";
import BusinessSelectionStep from "../steps/BusinessSelectionStep";
import FinalStep from "../steps/FinalStep";
import LunchBreakStep from "../steps/LunchBreakStep";
import ExerciseStep from "../steps/ExerciseStep";

export interface OnboardingStep {
  title: string;
  component: React.ReactNode;
  description: string;
}

export const onboardingSteps: OnboardingStep[] = [
  {
    title: "Welcome",
    component: <BusinessSelectionStep />,
    description: "Let's personalize your Respiro Balance experience",
  },
  {
    title: "Work Schedule",
    component: <WorkScheduleStep />,
    description: "Tell us about your typical work schedule",
  },
  {
    title: "Lunch Break",
    component: <LunchBreakStep />,
    description: "Let us know about your lunch break habits",
  },
  {
    title: "Exercise",
    component: <ExerciseStep />,
    description: "Tell us about your exercise routine",
  },
  {
    title: "Time Management",
    component: <TimeManagementStep />,
    description: "How do you currently manage your time during the day?",
  },
  {
    title: "Stress & Focus",
    component: <StressFocusStep />,
    description: "Help us understand your stress levels and focus challenges",
  },
  {
    title: "Morning Ritual",
    component: <MorningRitualStep />,
    description: "How do you start your day?",
  },
  {
    title: "Sleep Patterns",
    component: <SleepStep />,
    description: "Tell us about your sleep habits",
  },
  {
    title: "Meditation Experience",
    component: <MeditationExperienceStep />,
    description: "Share your experience with meditation and goals",
  },
  {
    title: "Biofeedback & Tracking",
    component: <BiofeedbackStep />,
    description: "Customize how you track your progress",
  },
  {
    title: "Notification Preferences",
    component: <NotificationPreferencesStep />,
    description: "Set up reminders to help you stay consistent",
  },
  {
    title: "Your Profile",
    component: <FinalStep />,
    description: "Review your personalized settings",
  },
];
