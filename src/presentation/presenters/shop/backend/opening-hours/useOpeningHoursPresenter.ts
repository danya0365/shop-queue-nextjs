"use client";

import {
  BulkUpdateOpeningHourInputDTO,
  CreateOpeningHourInputDTO,
  OpeningHourDTO,
  UpdateOpeningHourInputDTO,
} from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { useEffect, useState } from "react";
import { OpeningHoursViewModel } from "./OpeningHoursPresenter";

interface UseOpeningHoursPresenterReturn {
  openingHours: OpeningHourDTO[];
  weeklySchedule: Record<string, OpeningHourDTO>;
  isLoading: boolean;
  error: string | null;
  createOpeningHour: (data: CreateOpeningHourInputDTO) => Promise<void>;
  updateOpeningHour: (
    hourId: string,
    data: UpdateOpeningHourInputDTO
  ) => Promise<void>;
  deleteOpeningHour: (hourId: string) => Promise<void>;
  bulkUpdateOpeningHours: (
    hours: BulkUpdateOpeningHourInputDTO[]
  ) => Promise<void>;
  refreshOpeningHours: () => Promise<void>;
}

export function useOpeningHoursPresenter(
  shopId: string,
  initialViewModel?: OpeningHoursViewModel
): UseOpeningHoursPresenterReturn {
  const [openingHours, setOpeningHours] = useState<OpeningHourDTO[]>(
    initialViewModel?.openingHours || []
  );
  const [weeklySchedule, setWeeklySchedule] = useState<
    Record<string, OpeningHourDTO>
  >(initialViewModel?.weeklySchedule || {});
  const [isLoading, setIsLoading] = useState(
    initialViewModel?.isLoading || false
  );
  const [error, setError] = useState<string | null>(
    initialViewModel?.error || null
  );

  const refreshOpeningHours = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/shop/${shopId}/backend/opening-hours`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch opening hours");
      }

      const viewModel: OpeningHoursViewModel = await response.json();
      setOpeningHours(viewModel.openingHours);
      setWeeklySchedule(viewModel.weeklySchedule);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load opening hours"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createOpeningHour = async (data: CreateOpeningHourInputDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/shop/${shopId}/backend/opening-hours`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create opening hour");
      }

      const newOpeningHour: OpeningHourDTO = await response.json();
      setOpeningHours((prev) => [...prev, newOpeningHour]);
      await refreshOpeningHours(); // Refresh to update weekly schedule
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create opening hour"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOpeningHour = async (
    hourId: string,
    data: UpdateOpeningHourInputDTO
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/shop/${shopId}/backend/opening-hours/${hourId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update opening hour");
      }

      const updatedOpeningHour: OpeningHourDTO = await response.json();
      setOpeningHours((prev) =>
        prev.map((hour) => (hour.id === hourId ? updatedOpeningHour : hour))
      );
      await refreshOpeningHours(); // Refresh to update weekly schedule
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update opening hour"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOpeningHour = async (hourId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/shop/${shopId}/backend/opening-hours/${hourId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete opening hour");
      }

      setOpeningHours((prev) => prev.filter((hour) => hour.id !== hourId));
      await refreshOpeningHours(); // Refresh to update weekly schedule
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete opening hour"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const bulkUpdateOpeningHours = async (
    hours: BulkUpdateOpeningHourInputDTO[]
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/shop/${shopId}/backend/opening-hours/bulk`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hours }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to bulk update opening hours");
      }

      const updatedOpeningHours: OpeningHourDTO[] = await response.json();
      setOpeningHours(updatedOpeningHours);
      await refreshOpeningHours(); // Refresh to update weekly schedule
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to bulk update opening hours"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with data if provided
  useEffect(() => {
    if (initialViewModel) {
      setOpeningHours(initialViewModel.openingHours);
      setWeeklySchedule(initialViewModel.weeklySchedule);
      setError(initialViewModel.error);
    }
  }, [initialViewModel]);

  return {
    openingHours,
    weeklySchedule,
    isLoading,
    error,
    createOpeningHour,
    updateOpeningHour,
    deleteOpeningHour,
    bulkUpdateOpeningHours,
    refreshOpeningHours,
  };
}
