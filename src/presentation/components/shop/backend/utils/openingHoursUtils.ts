import { OpeningHourDTO } from "@/src/application/dtos/shop/backend/opening-hour-dto";

export const DAY_ORDER = [
  "monday",
  "tuesday", 
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const DAY_LABELS = {
  monday: "จันทร์",
  tuesday: "อังคาร",
  wednesday: "พุธ",
  thursday: "พฤหัสบดี",
  friday: "ศุกร์",
  saturday: "เสาร์",
  sunday: "อาทิตย์",
} as const;

export function getDayOrder() {
  return DAY_ORDER;
}

export function getDayLabels() {
  return DAY_LABELS;
}

export function formatTime(time: string | null) {
  if (!time) return "-";
  return time;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function calculateWorkingHours(
  openTime: string | null,
  closeTime: string | null,
  breakStart: string | null,
  breakEnd: string | null
): string {
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
}

export function getStatusColor(isOpen: boolean): string {
  return isOpen
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
}

export function calculateAverageOpenHours(
  schedule: Record<string, OpeningHourDTO>
): number {
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
}
