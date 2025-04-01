
import React from "react";

interface RitualFilterEmptyStateProps {
  onResetFilters: () => void;
}

const RitualFilterEmptyState: React.FC<RitualFilterEmptyStateProps> = ({ onResetFilters }) => {
  return (
    <div className="text-center py-8 bg-slate-50 rounded-lg">
      <h3 className="text-lg font-medium mb-2">No matching rituals</h3>
      <p className="text-muted-foreground mb-4">
        Try adjusting your filters to see more rituals
      </p>
      <button 
        onClick={onResetFilters}
        className="text-primary hover:underline"
      >
        Reset filters
      </button>
    </div>
  );
};

export default RitualFilterEmptyState;
