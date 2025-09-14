import { DayOfWeek } from "@/src/domain/entities/shop/backend/backend-opening-hour.entity";

export interface OpeningHourDTO {
  id: string;
  shopId: string;
  dayOfWeek: string;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  breakStart: string | null;
  breakEnd: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOpeningHourInputDTO {
  shopId: string;
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface UpdateOpeningHourInputDTO {
  isOpen?: boolean;
  openTime?: string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface BulkUpdateOpeningHourInputDTO {
  dayOfWeek: DayOfWeek;
  isOpen?: boolean;
  openTime?: string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface OpeningHoursStatsDTO {
  totalOpenDays: number;
  totalClosedDays: number;
  averageOpenHours: number;
  hasBreakTime: number;
}

export interface OpeningHoursDataDTO {
  openingHours: OpeningHourDTO[];
  weeklySchedule: Record<string, OpeningHourDTO>;
  stats: OpeningHoursStatsDTO;
}

// Use Case Input DTOs
export interface GetOpeningHoursInput {
  shopId: string;
}

export interface GetOpeningHourByIdInput {
  id: string;
}

export interface DeleteOpeningHourInput {
  id: string;
}

export interface BulkUpdateOpeningHoursInput {
  shopId: string;
  openingHours: BulkUpdateOpeningHourInputDTO[];
}

// Use Case Output DTOs
export interface GetOpeningHoursOutput {
  openingHours: OpeningHourDTO[];
}

export interface GetOpeningHourByIdOutput {
  openingHour: OpeningHourDTO | null;
}

export interface CreateOpeningHourOutput {
  openingHour: OpeningHourDTO;
}

export interface UpdateOpeningHourOutput {
  openingHour: OpeningHourDTO;
}

export interface DeleteOpeningHourOutput {
  success: boolean;
}

export interface BulkUpdateOpeningHoursOutput {
  openingHours: OpeningHourDTO[];
}

export interface GetOpeningHoursStatsOutput {
  stats: OpeningHoursStatsDTO;
}
