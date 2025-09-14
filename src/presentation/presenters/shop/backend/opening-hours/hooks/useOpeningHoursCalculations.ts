"use client";

import { OpeningHourDTO } from "@/src/application/dtos/shop/backend/opening-hour-dto";

export interface UseOpeningHoursCalculationsReturn {
  formatTime: (time: string | null) => string;
  getDayOrder: () => string[];
  timeToMinutes: (time: string) => number;
  calculateAverageOpenHours: (schedule: Record<string, OpeningHourDTO>) => number;
  getStatusColor: (isOpen: boolean) => string;
  calculateWorkingHours: (
    openTime: string | null,
    closeTime: string | null,
    breakStart: string | null,
    breakEnd: string | null
  ) => string;
  createViewModel: (
    openingHours: OpeningHourDTO[],
    weeklySchedule: Record<string, OpeningHourDTO>,
    isLoading: boolean,
    error: string | null
  ) => OpeningHoursViewModel;
}

export interface OpeningHoursViewModel {
  openingHours: OpeningHourDTO[];
  weeklySchedule: Record<string, OpeningHourDTO>;
  totalOpenDays: number;
  totalClosedDays: number;
  averageOpenHours: number;
  hasBreakTime: number;
  dayLabels: Record<string, string>;
  isLoading: boolean;
  error: string | null;
}

export function useOpeningHoursCalculations(): UseOpeningHoursCalculationsReturn {
  const formatTime = (time: string | null): string => {
    if (!time) return "-";
    return time;
  };

  const getDayOrder = (): string[] => {
    return [
      "monday",
      "tuesday", 
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const calculateAverageOpenHours = (
    schedule: Record<string, OpeningHourDTO>
  ): number => {
    const openHours = Object.values(schedule).filter((hour) => hour.isOpen);
    if (openHours.length === 0) return 0;

    const totalHours = openHours.reduce((sum, hour) => {
      if (hour.openTime && hour.closeTime) {
        const openMinutes = timeToMinutes(hour.openTime);
        const closeMinutes = timeToMinutes(hour.closeTime);
        let totalMinutes = closeMinutes - openMinutes;

        if (hour.breakStart && hour.breakEnd) {
          const breakStartMinutes = timeToMinutes(hour.breakStart);
          const breakEndMinutes = timeToMinutes(hour.breakEnd);
          totalMinutes -= breakEndMinutes - breakStartMinutes;
        }

        return sum + totalMinutes / 60;
      }
      return sum;
    }, 0);

    return totalHours / openHours.length;
  };

  const getStatusColor = (isOpen: boolean): string => {
    return isOpen
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const calculateWorkingHours = (
    openTime: string | null,
    closeTime: string | null,
    breakStart: string | null,
    breakEnd: string | null
  ): string => {
    if (!openTime || !closeTime) return "0 ชั่วโมง";

    const openMinutes = timeToMinutes(openTime);
    const closeMinutes = timeToMinutes(closeTime);
    let totalMinutes = closeMinutes - openMinutes;

    if (breakStart && breakEnd) {
      const breakStartMinutes = timeToMinutes(breakStart);
      const breakEndMinutes = timeToMinutes(breakEnd);
      totalMinutes -= breakEndMinutes - breakStartMinutes;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
      return `${hours} ชั่วโมง`;
    }
    return `${hours} ชั่วโมง ${minutes} นาที`;
  };

  const createViewModel = (
    openingHours: OpeningHourDTO[],
    weeklySchedule: Record<string, OpeningHourDTO>,
    isLoading: boolean,
    error: string | null
  ): OpeningHoursViewModel => {
    return {
      openingHours,
      weeklySchedule,
      totalOpenDays: Object.values(weeklySchedule).filter((hour) => hour.isOpen)
        .length,
      totalClosedDays: Object.values(weeklySchedule).filter(
        (hour) => !hour.isOpen
      ).length,
      averageOpenHours: calculateAverageOpenHours(weeklySchedule),
      hasBreakTime: Object.values(weeklySchedule).filter(
        (hour) => hour.breakStart && hour.breakEnd
      ).length,
      dayLabels: {
        monday: "จันทร์",
        tuesday: "อังคาร",
        wednesday: "พุธ",
        thursday: "พฤหัสบดี",
        friday: "ศุกร์",
        saturday: "เสาร์",
        sunday: "อาทิตย์",
      },
      isLoading,
      error,
    };
  };

  return {
    formatTime,
    getDayOrder,
    timeToMinutes,
    calculateAverageOpenHours,
    getStatusColor,
    calculateWorkingHours,
    createViewModel,
  };
}
