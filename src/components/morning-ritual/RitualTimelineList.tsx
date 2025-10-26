

import RitualTimelineItem from './RitualTimelineItem';
import { MorningRitual } from '@/context/types';

interface RitualTimelineListProps {
  rituals: MorningRitual[];
  onComplete: (ritual: MorningRitual) => void;
  onDelete: (ritual: MorningRitual) => void;
  onUpdate: (updatedRitual: MorningRitual) => void;
}

const RitualTimelineList: React.FC<RitualTimelineListProps> = ({
  rituals,
  onComplete,
  onDelete,
  onUpdate
}) => {
  return (
    <div className="space-y-6 relative z-10">
      {rituals.map((ritual) => (
        <RitualTimelineItem
          key={ritual.id}
          ritual={ritual}
          onComplete={() => onComplete(ritual)}
          onDelete={() => onDelete(ritual)}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default RitualTimelineList;
