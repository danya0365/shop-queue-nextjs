"use client";

import {
  BulkUpdateOpeningHourInputDTO,
  CreateOpeningHourInputDTO,
  UpdateOpeningHourInputDTO,
} from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { useCallback, useEffect, useState } from "react";
import { OpeningHoursViewModel } from "./OpeningHoursPresenter";
import { useOpeningHoursActions } from "./hooks/useOpeningHoursActions";
import { useOpeningHoursCalculations } from "./hooks/useOpeningHoursCalculations";
import { useOpeningHoursState } from "./hooks/useOpeningHoursState";

interface UseOpeningHoursPresenterReturn {
  // Data
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
  // Main state - only viewModel
  const [viewModel, setViewModel] = useState<OpeningHoursViewModel | null>(
    initialViewModel || null
  );
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

  const { formatTime, getDayOrder, getStatusColor, calculateWorkingHours } =
    useOpeningHoursCalculations();

  // Function to load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { ClientOpeningHoursPresenterFactory } = await import(
        "./OpeningHoursPresenter"
      );
      const presenter = await ClientOpeningHoursPresenterFactory.create();

      const newViewModel = await presenter.getViewModel(shopId);

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load opening hours"
      );
      console.error("Error loading opening hours:", err);
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  // Refresh data
  const refreshOpeningHours = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const createOpeningHour = async (data: CreateOpeningHourInputDTO) => {
    try {
      setIsLoading(true);
      setError(null);

      const { ClientOpeningHoursPresenterFactory } = await import(
        "./OpeningHoursPresenter"
      );
      const presenter = await ClientOpeningHoursPresenterFactory.create();

      await presenter.createOpeningHour(shopId, data);

      // Refresh data after creation
      await loadData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create opening hour";
      setError(errorMessage);
      console.error("Error creating opening hour:", err);
      throw err; // Re-throw to let UI handle it
    } finally {
      setIsLoading(false);
    }
  };

  const updateOpeningHour = async (
    hourId: string,
    data: UpdateOpeningHourInputDTO
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const { ClientOpeningHoursPresenterFactory } = await import(
        "./OpeningHoursPresenter"
      );
      const presenter = await ClientOpeningHoursPresenterFactory.create();

      await presenter.updateOpeningHour(shopId, hourId, data);

      // Refresh data after update
      await loadData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update opening hour";
      setError(errorMessage);
      console.error("Error updating opening hour:", err);
      throw err; // Re-throw to let UI handle it
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOpeningHour = async (hourId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { ClientOpeningHoursPresenterFactory } = await import(
        "./OpeningHoursPresenter"
      );
      const presenter = await ClientOpeningHoursPresenterFactory.create();

      await presenter.deleteOpeningHour(shopId, hourId);

      // Refresh data after delete
      await loadData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete opening hour";
      setError(errorMessage);
      console.error("Error deleting opening hour:", err);
      throw err; // Re-throw to let UI handle it
    } finally {
      setIsLoading(false);
    }
  };

  const bulkUpdateOpeningHours = async (
    hours: BulkUpdateOpeningHourInputDTO[]
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const { ClientOpeningHoursPresenterFactory } = await import(
        "./OpeningHoursPresenter"
      );
      const presenter = await ClientOpeningHoursPresenterFactory.create();

      await presenter.bulkUpdateOpeningHours(shopId, hours);

      // Refresh data after bulk update
      await loadData();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to bulk update opening hours";
      setError(errorMessage);
      console.error("Error bulk updating opening hours:", err);
      throw err; // Re-throw to let UI handle it
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize actions hook after CRUD operations are defined
  const actions = useOpeningHoursActions({
    weeklySchedule: viewModel?.weeklySchedule || {},
    updateOpeningHour,
    bulkUpdateOpeningHours,
    setEditForm,
    setSelectedDay,
    setNotification,
    getDayOrder,
  });

  // Initialize with initial view model if provided
  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setIsLoading(false);
    }
  }, [initialViewModel]);

  // Load data when dependencies change, but not if we have initial view model
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  // Wrapper for handleSaveDay to use current state
  const handleSaveDay = async () => {
    await actions.handleSaveDay(selectedDay, editForm);
  };

  return {
    // Data
    viewModel: viewModel || {
      openingHours: [],
      weeklySchedule: {},
      totalOpenDays: 0,
      totalClosedDays: 0,
      averageOpenHours: 0,
      hasBreakTime: 0,
      dayLabels: {},
      isLoading: false,
      error: null,
    },
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
