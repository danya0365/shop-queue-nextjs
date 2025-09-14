import { useMemo } from "react";
import { OpeningHourDTO } from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { 
  calculateAverageOpenHours, 
  calculateWorkingHours, 
  getDayLabels 
} from "../utils/openingHoursUtils";

export interface OpeningHoursStats {
  totalOpenDays: number;
  totalClosedDays: number;
  averageOpenHours: number;
  hasBreakTime: number;
  dayLabels: Record<string, string>;
}

export interface UseOpeningHoursCalculationsReturn {
  // Stats calculations
  stats: OpeningHoursStats;
  
  // Utility functions
  calculateWorkingHours: (
    openTime: string | null,
    closeTime: string | null,
    breakStart: string | null,
    breakEnd: string | null
  ) => string;
}

export function useOpeningHoursCalculations(
  weeklySchedule: Record<string, OpeningHourDTO>
): UseOpeningHoursCalculationsReturn {
  const stats = useMemo(() => {
    const totalOpenDays = Object.values(weeklySchedule).filter((hour) => hour.isOpen).length;
    const totalClosedDays = Object.values(weeklySchedule).filter((hour) => !hour.isOpen).length;
    const averageOpenHours = calculateAverageOpenHours(weeklySchedule);
    const hasBreakTime = Object.values(weeklySchedule).filter(
      (hour) => hour.breakStart && hour.breakEnd
    ).length;
    const dayLabels = getDayLabels();

    return {
      totalOpenDays,
      totalClosedDays,
      averageOpenHours,
      hasBreakTime,
      dayLabels,
    };
  }, [weeklySchedule]);

  return {
    stats,
    calculateWorkingHours,
  };
}
