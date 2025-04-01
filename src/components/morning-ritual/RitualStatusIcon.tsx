
import React from "react";
import { RitualStatus } from "@/context/types";
import { CheckCircle2, XCircle, CircleDashed, Clock } from "lucide-react";

interface RitualStatusIconProps {
  status: RitualStatus;
  className?: string;
}

const RitualStatusIcon: React.FC<RitualStatusIconProps> = ({ status, className = "h-5 w-5" }) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className={`${className} text-green-500`} />;
    case "in_progress":
      return <CircleDashed className={`${className} text-amber-500`} />;
    case "missed":
      return <XCircle className={`${className} text-red-500`} />;
    default:
      return <Clock className={`${className} text-slate-400`} />;
  }
};

export default RitualStatusIcon;
