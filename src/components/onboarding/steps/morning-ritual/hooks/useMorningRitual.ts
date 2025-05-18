
import { useState, useEffect } from "react";
import { useUserPreferences } from "@/context";
import { MorningDevicesType } from "../MorningDevicesSection";

export const useMorningRitual = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  // Local state for immediate UI feedback
  const [morningActivities, setMorningActivities] = useState<string[]>(
    Array.isArray(preferences.morningActivities) ? preferences.morningActivities : []
  );
  const [morningDevices, setMorningDevices] = useState<MorningDevicesType>(
    (preferences.morningDevices as MorningDevicesType) || "phone_delayed"
  );
  const [morningEnergyLevel, setMorningEnergyLevel] = useState<number>(
    preferences.morningEnergyLevel || 5
  );

  // Sync local state with preferences when they change
  useEffect(() => {
    setMorningActivities(Array.isArray(preferences.morningActivities) ? preferences.morningActivities : []);
    setMorningDevices((preferences.morningDevices as MorningDevicesType) || "phone_delayed");
    setMorningEnergyLevel(preferences.morningEnergyLevel || 5);
  }, [preferences.morningActivities, preferences.morningDevices, preferences.morningEnergyLevel]);

  const handleActivityChange = (value: string, checked: boolean) => {
    // Update local state for immediate feedback
    let updatedActivities = checked 
      ? [...morningActivities, value]
      : morningActivities.filter(activity => activity !== value);
    
    setMorningActivities(updatedActivities);
    
    // Update preferences
    updatePreferences({ morningActivities: updatedActivities });
  };

  const handleDevicesChange = (value: MorningDevicesType) => {
    setMorningDevices(value);
    updatePreferences({ morningDevices: value });
  };

  const handleEnergyLevelChange = (energyLevel: number) => {
    setMorningEnergyLevel(energyLevel);
    updatePreferences({ morningEnergyLevel: energyLevel });
  };

  return {
    morningActivities,
    morningDevices,
    morningEnergyLevel,
    handleActivityChange,
    handleDevicesChange,
    handleEnergyLevelChange
  };
};
