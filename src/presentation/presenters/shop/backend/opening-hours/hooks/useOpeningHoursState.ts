"use client";

import { useState } from "react";

export interface EditFormState {
  openTime: string;
  closeTime: string;
  breakStart: string;
  breakEnd: string;
}

export interface NotificationState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export interface UseOpeningHoursStateReturn {
  editMode: boolean;
  selectedDay: string | null;
  editForm: EditFormState;
  notification: NotificationState;
  setEditMode: (editMode: boolean) => void;
  setSelectedDay: (selectedDay: string | null) => void;
  setEditForm: (editForm: EditFormState) => void;
  setNotification: (notification: NotificationState) => void;
  resetEditForm: () => void;
  resetNotification: () => void;
}

export function useOpeningHoursState(): UseOpeningHoursStateReturn {
  const [editMode, setEditMode] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    openTime: "",
    closeTime: "",
    breakStart: "",
    breakEnd: "",
  });
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: "",
    type: "success",
  });

  const resetEditForm = () => {
    setEditForm({
      openTime: "",
      closeTime: "",
      breakStart: "",
      breakEnd: "",
    });
  };

  const resetNotification = () => {
    setNotification({
      show: false,
      message: "",
      type: "success",
    });
  };

  return {
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
  };
}
