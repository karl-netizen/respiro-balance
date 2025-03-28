
import React from "react";
import { cn } from "@/lib/utils";

export type TimeBlockCategory = "deep_work" | "shallow_work" | "meetings" | "learning" | "rest" | "personal";

export interface TimeBlockProps {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: TimeBlockCategory;
  description?: string;
  completed?: boolean;
  onClick?: () => void;
}

const categoryStyles: Record<TimeBlockCategory, string> = {
  deep_work: "bg-blue-100 border-blue-500 text-blue-800",
  shallow_work: "bg-gray-100 border-gray-500 text-gray-800",
  meetings: "bg-purple-100 border-purple-500 text-purple-800",
  learning: "bg-green-100 border-green-500 text-green-800",
  rest: "bg-yellow-100 border-yellow-500 text-yellow-800",
  personal: "bg-orange-100 border-orange-500 text-orange-800"
};

const TimeBlock = ({
  title,
  startTime,
  endTime,
  category,
  description,
  completed,
  onClick
}: TimeBlockProps) => {
  // Calculate duration in minutes and height
  const startMinutes = convertTimeToMinutes(startTime);
  const endMinutes = convertTimeToMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;
  
  // Each hour (60 minutes) is represented by 120px height
  const blockHeight = (durationMinutes / 60) * 120;
  
  // Position from top (each minute = 2px from top)
  const topPosition = (startMinutes - convertTimeToMinutes("06:00")) * 2; // Assuming 6am start
  
  return (
    <div
      className={cn(
        "absolute w-full left-0 px-2 rounded border-l-4 transition-all",
        categoryStyles[category],
        completed ? "opacity-70" : "opacity-100",
        "hover:shadow-md cursor-pointer"
      )}
      style={{
        top: `${topPosition}px`,
        height: `${blockHeight}px`,
        maxWidth: "calc(100% - 8px)"
      }}
      onClick={onClick}
    >
      <div className="p-2 h-full flex flex-col overflow-hidden">
        <div className="font-medium text-sm truncate">{title}</div>
        <div className="text-xs opacity-70">
          {startTime} - {endTime}
        </div>
        {description && durationMinutes >= 30 && (
          <div className="text-xs mt-1 line-clamp-2">{description}</div>
        )}
        {completed && (
          <div className="mt-auto text-xs font-medium">✓ Completed</div>
        )}
      </div>
    </div>
  );
};

// Helper function to convert time string (HH:MM) to minutes since midnight
function convertTimeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

export default TimeBlock;
