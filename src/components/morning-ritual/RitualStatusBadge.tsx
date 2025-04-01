
import React from "react";
import { RitualStatus } from "@/context/types";
import { Badge } from "@/components/ui/badge";

interface RitualStatusBadgeProps {
  status: RitualStatus;
}

const RitualStatusBadge: React.FC<RitualStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "completed":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
    case "in_progress":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>;
    case "missed":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Missed</Badge>;
    default:
      return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Planned</Badge>;
  }
};

export default RitualStatusBadge;
