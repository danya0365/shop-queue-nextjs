"use client";

import {
  BulkUpdateOpeningHourInputDTO,
  CreateOpeningHourInputDTO,
  OpeningHourDTO,
  UpdateOpeningHourInputDTO,
} from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { useEffect, useState } from "react";
import { OpeningHoursViewModel } from "./OpeningHoursPresenter";
import { useOpeningHoursState } from "./hooks/useOpeningHoursState";
import { useOpeningHoursCalculations } from "./hooks/useOpeningHoursCalculations";
import { useOpeningHoursActions } from "./hooks/useOpeningHoursActions";

interface UseOpeningHoursPresenterReturn {
  // Data
  openingHours: OpeningHourDTO[];
  weeklySchedule: Record<string, OpeningHourDTO>;
  viewModel: OpeningHoursViewModel;
  isLoading: boolean;
  error: string | null;
  
  // State
  editMode: boolean;
  selectedDay: string | null;
  editForm: {
    openTime: string;
    closeTime: string;
    breakStart: string;
    breakEnd: string;
  };
  notification: {
    show: boolean;
    message: string;
    type: "success" | "error";
  };
  
  // CRUD Operations
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
  
  // State Actions
  setEditMode: (editMode: boolean) => void;
  setSelectedDay: (selectedDay: string | null) => void;
  setEditForm: (editForm: {
    openTime: string;
    closeTime: string;
    breakStart: string;
    breakEnd: string;
  }) => void;
  setNotification: (notification: {
    show: boolean;
    message: string;
    type: "success" | "error";
  }) => void;
  resetEditForm: () => void;
  resetNotification: () => void;
  
  // Event Handlers
  handleToggleDayStatus: (day: string, currentStatus: boolean) => Promise<void>;
  handleEditDay: (day: string) => void;
  handleSaveDay: () => Promise<void>;
  handleQuickAction: (action: string) => Promise<void>;
  showNotification: (message: string, type: "success" | "error") => void;
  
  // Utility Functions
  formatTime: (time: string | null) => string;
  getDayOrder: () => string[];
  getStatusColor: (isOpen: boolean) => string;
  calculateWorkingHours: (
    openTime: string | null,
    closeTime: string | null,
    breakStart: string | null,
    breakEnd: string | null
  ) => string;
}

export function useOpeningHoursPresenter(
  shopId: string,
  initialViewModel?: OpeningHoursViewModel
): UseOpeningHoursPresenterReturn {
  // Data state
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
  
  // Custom hooks
  const {
    editMode,
    selectedDay,
    editForm,
    notification,
    setEditMode,
    setSelectedDay,
    setEditForm,
    setNotification,
    resetEditForm,
    resetNotification,
  } = useOpeningHoursState();
  
  const {
    formatTime,
    getDayOrder,
    getStatusColor,
    calculateWorkingHours,
    createViewModel,
  } = useOpeningHoursCalculations();

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
  
  // Initialize actions hook after CRUD operations are defined
  const actions = useOpeningHoursActions({
    weeklySchedule,
    updateOpeningHour,
    bulkUpdateOpeningHours,
    setEditForm,
    setSelectedDay,
    setNotification,
    getDayOrder,
  });

  // Initialize with data if provided
  useEffect(() => {
    if (initialViewModel) {
      setOpeningHours(initialViewModel.openingHours);
      setWeeklySchedule(initialViewModel.weeklySchedule);
      setError(initialViewModel.error);
    }
  }, [initialViewModel]);

  // Create view model
  const viewModel = createViewModel(openingHours, weeklySchedule, isLoading, error);
  
  // Wrapper for handleSaveDay to use current state
  const handleSaveDay = async () => {
    await actions.handleSaveDay(selectedDay, editForm);
  };
  
  return {
    // Data
    openingHours,
    weeklySchedule,
    viewModel,
    isLoading,
    error,
    
    // State
    editMode,
    selectedDay,
    editForm,
    notification,
    
    // CRUD Operations
    createOpeningHour,
    updateOpeningHour,
    deleteOpeningHour,
    bulkUpdateOpeningHours,
    refreshOpeningHours,
    
    // State Actions
    setEditMode,
    setSelectedDay,
    setEditForm,
    setNotification,
    resetEditForm,
    resetNotification,
    
    // Event Handlers
    handleToggleDayStatus: actions.handleToggleDayStatus,
    handleEditDay: actions.handleEditDay,
    handleSaveDay,
    handleQuickAction: actions.handleQuickAction,
    showNotification: actions.showNotification,
    
    // Utility Functions
    formatTime,
    getDayOrder,
    getStatusColor,
    calculateWorkingHours,
  };
}
