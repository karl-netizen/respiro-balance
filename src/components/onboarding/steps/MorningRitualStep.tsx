

import {
  MorningActivitiesSection,
  MorningDevicesSection,
  EnergyLevelSection,
  useMorningRitual
} from "./morning-ritual";

const MorningRitualStep = () => {
  const {
    morningActivities,
    morningDevices,
    morningEnergyLevel,
    handleActivityChange,
    handleDevicesChange,
    handleEnergyLevelChange
  } = useMorningRitual();

  return (
    <div className="space-y-6">
      <MorningActivitiesSection 
        activities={morningActivities}
        onChange={handleActivityChange}
      />

      <MorningDevicesSection 
        selectedDevice={morningDevices}
        onChange={handleDevicesChange}
      />
      
      <EnergyLevelSection 
        energyLevel={morningEnergyLevel}
        onChange={handleEnergyLevelChange}
      />
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <p>Morning Activities: {morningActivities.length > 0 ? morningActivities.join(", ") : "None selected"}</p>
          <p>Morning Devices: {morningDevices}</p>
          <p>Morning Energy Level: {morningEnergyLevel}/10</p>
        </div>
      )}
    </div>
  );
};

export default MorningRitualStep;
