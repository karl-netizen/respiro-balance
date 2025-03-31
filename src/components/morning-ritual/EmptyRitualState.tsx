
import React from "react";

const EmptyRitualState: React.FC = () => {
  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-medium mb-2">No morning rituals yet</h3>
      <p className="text-muted-foreground mb-4">
        Create your first ritual to start building a mindful morning routine.
      </p>
    </div>
  );
};

export default EmptyRitualState;
