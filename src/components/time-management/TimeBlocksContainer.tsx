
import React from "react";
import TimeBlock, { TimeBlockProps } from "./TimeBlock";

interface TimeMarkerProps {
  hour: number;
}

const TimeMarker = ({ hour }: TimeMarkerProps) => {
  const formattedHour = hour > 12 ? `${hour - 12}PM` : hour === 12 ? "12PM" : `${hour}AM`;
  
  return (
    <div className="relative h-[120px]">
      <div className="absolute top-0 left-0 right-0 border-t border-gray-200 -mt-px">
        <span className="absolute -top-3 -left-14 text-xs text-gray-500 w-12 text-right">
          {formattedHour}
        </span>
      </div>
    </div>
  );
};

interface TimeBlocksContainerProps {
  blocks: TimeBlockProps[];
  startHour?: number;
  endHour?: number;
  onBlockClick?: (blockId: string) => void;
}

const TimeBlocksContainer = ({
  blocks,
  startHour = 6, // Default: 6 AM
  endHour = 22, // Default: 10 PM
  onBlockClick
}: TimeBlocksContainerProps) => {
  // Create time markers for each hour
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  
  return (
    <div className="border rounded-md shadow-sm bg-white p-4">
      <div className="relative min-h-[600px]">
        {/* Time markers */}
        <div className="absolute top-0 left-0 bottom-0 w-14 border-r border-gray-100">
          {hours.map(hour => (
            <TimeMarker key={hour} hour={hour} />
          ))}
        </div>
        
        {/* Blocks container */}
        <div className="relative ml-14 h-full">
          {/* Hour gridlines */}
          {hours.map(hour => (
            <div 
              key={hour} 
              className="h-[120px] border-t border-gray-100"
              aria-hidden="true"
            />
          ))}
          
          {/* Half-hour gridlines */}
          {hours.map(hour => (
            <div 
              key={`half-${hour}`} 
              className="absolute w-full h-px bg-gray-50"
              style={{ top: `${(hour - startHour) * 120 + 60}px` }}
              aria-hidden="true"
            />
          ))}
          
          {/* Time blocks */}
          {blocks.map(block => (
            <TimeBlock
              key={block.id}
              {...block}
              onClick={() => onBlockClick && onBlockClick(block.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeBlocksContainer;
