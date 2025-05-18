
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export type MorningDevicesType = "phone_first" | "phone_delayed" | "no_devices";

interface MorningDevicesSectionProps {
  selectedDevice: MorningDevicesType;
  onChange: (value: MorningDevicesType) => void;
}

const MorningDevicesSection = ({ selectedDevice, onChange }: MorningDevicesSectionProps) => {
  const handleDevicesChange = (value: MorningDevicesType) => {
    onChange(value);
    
    toast.success("Devices preference updated", {
      description: `Your morning devices preference has been set to ${value.replace('_', ' ')}`,
      duration: 1500
    });
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Morning Devices</h3>
      <p className="text-sm text-muted-foreground mb-3">
        What's your relationship with devices in the morning?
      </p>
      <RadioGroup 
        value={selectedDevice} 
        onValueChange={(value) => handleDevicesChange(value as MorningDevicesType)}
        className="flex flex-col space-y-2"
      >
        <DeviceOption
          id="devices-first"
          value="phone_first"
          label="Check phone immediately after waking up"
          selectedValue={selectedDevice}
          onChange={handleDevicesChange}
        />
        <DeviceOption
          id="devices-delayed"
          value="phone_delayed"
          label="Use phone after morning routine"
          selectedValue={selectedDevice}
          onChange={handleDevicesChange}
        />
        <DeviceOption
          id="devices-none"
          value="no_devices"
          label="Try to avoid devices in the morning"
          selectedValue={selectedDevice}
          onChange={handleDevicesChange}
        />
      </RadioGroup>
    </div>
  );
};

interface DeviceOptionProps {
  id: string;
  value: MorningDevicesType;
  label: string;
  selectedValue: MorningDevicesType;
  onChange: (value: MorningDevicesType) => void;
}

const DeviceOption = ({ id, value, label, selectedValue, onChange }: DeviceOptionProps) => {
  return (
    <div 
      className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
      onClick={() => onChange(value)}
    >
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="cursor-pointer w-full">{label}</Label>
    </div>
  );
};

export default MorningDevicesSection;
