import { useState, useCallback } from "react";

export interface NotificationState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export interface EditFormState {
  openTime: string;
  closeTime: string;
  breakStart: string;
  breakEnd: string;
}

export interface UseOpeningHoursStateReturn {
  // Edit mode state
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  toggleEditMode: () => void;
  
  // Selected day state
  selectedDay: string | null;
  setSelectedDay: (day: string | null) => void;
  
  // Edit form state
  editForm: EditFormState;
  setEditForm: (form: EditFormState) => void;
  updateEditForm: (field: keyof EditFormState, value: string) => void;
  resetEditForm: () => void;
  
  // Notification state
  notification: NotificationState;
  showNotification: (message: string, type: "success" | "error") => void;
  hideNotification: () => void;
}

export function useOpeningHoursState(): UseOpeningHoursStateReturn {
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  
  // Selected day state
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState<EditFormState>({
    openTime: "",
    closeTime: "",
    breakStart: "",
    breakEnd: "",
  });
  
  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: "",
    type: "success",
  });

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setEditMode(prev => !prev);
    if (!editMode) {
      setSelectedDay(null); // Clear selection when entering edit mode
    }
  }, [editMode]);

  // Update edit form field
  const updateEditForm = useCallback((field: keyof EditFormState, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Reset edit form
  const resetEditForm = useCallback(() => {
    setEditForm({
      openTime: "",
      closeTime: "",
      breakStart: "",
      breakEnd: "",
    });
  }, []);

  // Show notification
  const showNotification = useCallback((message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  }, []);

  // Hide notification
  const hideNotification = useCallback(() => {
    setNotification({ show: false, message: "", type: "success" });
  }, []);

  return {
    editMode,
    setEditMode,
    toggleEditMode,
    selectedDay,
    setSelectedDay,
    editForm,
    setEditForm,
    updateEditForm,
    resetEditForm,
    notification,
    showNotification,
    hideNotification,
  };
}
