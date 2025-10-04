"use client";

import { DayOfWeek } from "@/src/domain/entities/shop/backend/backend-opening-hour.entity";
import { OpeningHourDTO } from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { 
  BulkUpdateOpeningHourInputDTO, 
  UpdateOpeningHourInputDTO 
} from "@/src/application/dtos/shop/backend/opening-hour-dto";

export interface UseOpeningHoursActionsDependencies {
  weeklySchedule: Record<string, OpeningHourDTO>;
  updateOpeningHour: (hourId: string, data: UpdateOpeningHourInputDTO) => Promise<void>;
  bulkUpdateOpeningHours: (hours: BulkUpdateOpeningHourInputDTO[]) => Promise<void>;
  setEditForm: (editForm: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; timezone: string; is24Hours: boolean }) => void;
  setSelectedDay: (selectedDay: string | null) => void;
  setNotification: (notification: { show: boolean; message: string; type: "success" | "error" }) => void;
  getDayOrder: () => string[];
}

export interface UseOpeningHoursActionsReturn {
  handleToggleDayStatus: (day: string, currentStatus: boolean) => Promise<void>;
  handleEditDay: (day: string) => void;
  handleSaveDay: (selectedDay: string | null, editForm: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; timezone: string; is24Hours: boolean }) => Promise<void>;
  handleQuickAction: (action: string) => Promise<void>;
  showNotification: (message: string, type: "success" | "error") => void;
}

export function useOpeningHoursActions(
  dependencies: UseOpeningHoursActionsDependencies
): UseOpeningHoursActionsReturn {
  const {
    weeklySchedule,
    updateOpeningHour,
    bulkUpdateOpeningHours,
    setEditForm,
    setSelectedDay,
    setNotification,
    getDayOrder,
  } = dependencies;

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleToggleDayStatus = async (day: string, currentStatus: boolean) => {
    try {
      const dayData = weeklySchedule[day];
      if (dayData) {
        await updateOpeningHour(dayData.id, {
          id: dayData.id,
          isOpen: !currentStatus,
        });
        const dayLabels = {
          monday: "จันทร์",
          tuesday: "อังคาร",
          wednesday: "พุธ",
          thursday: "พฤหัสบดี",
          friday: "ศุกร์",
          saturday: "เสาร์",
          sunday: "อาทิตย์",
        };
        showNotification(
          `อัปเดตสถานะ${dayLabels[day as keyof typeof dayLabels]}สำเร็จ`,
          "success"
        );
      }
    } catch (error) {
      console.error("Error toggling day status:", error);
      showNotification("ไม่สามารถอัปเดตสถานะได้", "error");
    }
  };

  const handleEditDay = (day: string) => {
    const dayData = weeklySchedule[day];
    if (dayData) {
      const is24 =
        !!dayData.isOpen &&
        (dayData.openTime === "00:00" || dayData.openTime === "00:00:00") &&
        (dayData.closeTime === "23:59" || dayData.closeTime === "23:59:59");
      setEditForm({
        openTime: dayData.openTime || "",
        closeTime: dayData.closeTime || "",
        breakStart: dayData.breakStart || "",
        breakEnd: dayData.breakEnd || "",
        timezone: dayData.timezone || "Asia/Bangkok",
        is24Hours: is24,
      });
      setSelectedDay(day);
    }
  };

  const handleSaveDay = async (selectedDay: string | null, editForm: { openTime: string; closeTime: string; breakStart: string; breakEnd: string; timezone: string; is24Hours: boolean }) => {
    if (!selectedDay) return;

    try {
      const dayData = weeklySchedule[selectedDay];
      if (dayData) {
        const payload: UpdateOpeningHourInputDTO = {
          id: dayData.id,
          timezone: editForm.timezone || undefined,
        };

        if (editForm.is24Hours) {
          payload.isOpen = true;
          payload.openTime = "00:00";
          payload.closeTime = "23:59";
          payload.breakStart = undefined;
          payload.breakEnd = undefined;
        } else {
          payload.openTime = editForm.openTime || undefined;
          payload.closeTime = editForm.closeTime || undefined;
          payload.breakStart = editForm.breakStart || undefined;
          payload.breakEnd = editForm.breakEnd || undefined;
        }

        await updateOpeningHour(dayData.id, payload);
        setSelectedDay(null);
        const dayLabels = {
          monday: "จันทร์",
          tuesday: "อังคาร",
          wednesday: "พุธ",
          thursday: "พฤหัสบดี",
          friday: "ศุกร์",
          saturday: "เสาร์",
          sunday: "อาทิตย์",
        };
        showNotification(
          `บันทึกเวลาทำการ${dayLabels[selectedDay as keyof typeof dayLabels]}สำเร็จ`,
          "success"
        );
      }
    } catch (error) {
      console.error("Error saving day:", error);
      showNotification("ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  const handleQuickAction = async (action: string) => {
    try {
      const updates: BulkUpdateOpeningHourInputDTO[] = [];
      const days = getDayOrder();

      switch (action) {
        case "all-days":
          for (const day of days) {
            updates.push({
              dayOfWeek: day as DayOfWeek,
              isOpen: true,
              openTime: "09:00",
              closeTime: "18:00",
              breakStart: undefined,
              breakEnd: undefined,
            });
          }
          break;
        case "weekdays":
          for (const day of days.slice(0, 5)) {
            updates.push({
              dayOfWeek: day as DayOfWeek,
              isOpen: true,
              openTime: "09:00",
              closeTime: "17:00",
              breakStart: undefined,
              breakEnd: undefined,
            });
          }
          // Close weekends
          for (const day of days.slice(5)) {
            updates.push({
              dayOfWeek: day as DayOfWeek,
              isOpen: false,
              openTime: undefined,
              closeTime: undefined,
              breakStart: undefined,
              breakEnd: undefined,
            });
          }
          break;
        case "monday-saturday":
          for (const day of days.slice(0, 6)) {
            updates.push({
              dayOfWeek: day as DayOfWeek,
              isOpen: true,
              openTime: "10:00",
              closeTime: "19:00",
              breakStart: undefined,
              breakEnd: undefined,
            });
          }
          // Close Sunday
          updates.push({
            dayOfWeek: DayOfWeek.SUNDAY,
            isOpen: false,
            openTime: undefined,
            closeTime: undefined,
            breakStart: undefined,
            breakEnd: undefined,
          });
          break;
        case "close-sunday":
          const sundayData = weeklySchedule["sunday"];
          if (sundayData) {
            await updateOpeningHour(sundayData.id, {
              id: sundayData.id,
              isOpen: false,
              openTime: undefined,
              closeTime: undefined,
              breakStart: undefined,
              breakEnd: undefined,
            });
          }
          showNotification("ปิดทำการวันอาทิตย์สำเร็จ", "success");
          return;
      }

      if (updates.length > 0) {
        await bulkUpdateOpeningHours(updates);
        showNotification("อัปเดตเวลาทำการสำเร็จ", "success");
      }
    } catch (error) {
      console.error("Error in quick action:", error);
      showNotification("ไม่สามารถอัปเดตข้อมูลได้", "error");
    }
  };

  return {
    handleToggleDayStatus,
    handleEditDay,
    handleSaveDay,
    handleQuickAction,
    showNotification,
  };
}
