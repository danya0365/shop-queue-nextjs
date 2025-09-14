"use client";

import { DayOfWeek } from "@/src/domain/entities/shop/backend/backend-opening-hour.entity";
import { OpeningHoursViewModel } from "@/src/presentation/presenters/shop/backend/opening-hours/OpeningHoursPresenter";
import { useOpeningHoursPresenter } from "@/src/presentation/presenters/shop/backend/opening-hours/useOpeningHoursPresenter";
import { useOpeningHoursState } from "./hooks/useOpeningHoursState";
import { useOpeningHoursCalculations } from "./hooks/useOpeningHoursCalculations";
import { OpeningHoursStats } from "./components/OpeningHoursStats";
import { OpeningHoursTable } from "./components/OpeningHoursTable";
import { OpeningHoursEditForm } from "./components/OpeningHoursEditForm";
import { OpeningHoursQuickActions } from "./components/OpeningHoursQuickActions";
import { getDayOrder, getDayLabels } from "./utils/openingHoursUtils";

interface OpeningHoursViewProps {
  shopId: string;
  initialViewModel?: OpeningHoursViewModel;
}

export function OpeningHoursView({
  shopId,
  initialViewModel,
}: OpeningHoursViewProps) {
  // Presenter hook for API operations
  const {
    weeklySchedule,
    isLoading,
    error,
    updateOpeningHour,
    bulkUpdateOpeningHours,
    refreshOpeningHours,
  } = useOpeningHoursPresenter(shopId, initialViewModel);

  // State management hook for UI state
  const {
    editMode,
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
  } = useOpeningHoursState();

  // Calculations hook for business logic
  const { stats, calculateWorkingHours } = useOpeningHoursCalculations(weeklySchedule);
  
  // Day labels for display
  const dayLabels = getDayLabels();

  // Event handlers
  const handleEdit = (day: string) => {
    const dayData = weeklySchedule[day];
    if (dayData) {
      setSelectedDay(day);
      setEditForm({
        openTime: dayData.openTime || "",
        closeTime: dayData.closeTime || "",
        breakStart: dayData.breakStart || "",
        breakEnd: dayData.breakEnd || "",
      });
    }
  };

  const handleSave = async () => {
    if (!selectedDay) return;

    try {
      const hourId = weeklySchedule[selectedDay]?.id;
      if (!hourId) return;

      await updateOpeningHour(hourId, {
        openTime: editForm.openTime || undefined,
        closeTime: editForm.closeTime || undefined,
        breakStart: editForm.breakStart || undefined,
        breakEnd: editForm.breakEnd || undefined,
      });

      showNotification("อัปเดตเวลาทำการสำเร็จ", "success");
      setSelectedDay(null);
      resetEditForm();
    } catch {
      showNotification("เกิดข้อผิดพลาดในการอัปเดตเวลาทำการ", "error");
    }
  };

  const handleCancel = () => {
    setSelectedDay(null);
    resetEditForm();
  };

  const handleToggleStatus = async (day: string, currentStatus: boolean) => {
    try {
      const hourId = weeklySchedule[day]?.id;
      if (!hourId) return;

      await updateOpeningHour(hourId, {
        isOpen: !currentStatus,
      });

      showNotification(
        !currentStatus ? "เปิดวันทำการสำเร็จ" : "ปิดวันทำการสำเร็จ",
        "success"
      );
    } catch {
      showNotification("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ", "error");
    }
  };

  const handleOpenAllDays = async () => {
    try {
      const updates = getDayOrder().map((day) => ({
        dayOfWeek: day as DayOfWeek,
        isOpen: true,
      }));

      await bulkUpdateOpeningHours(updates);
      showNotification("เปิดทุกวันสำเร็จ", "success");
    } catch {
      showNotification("เกิดข้อผิดพลาดในการเปิดทุกวัน", "error");
    }
  };

  const handleCloseAllDays = async () => {
    try {
      const updates = getDayOrder().map((day) => ({
        dayOfWeek: day as DayOfWeek,
        isOpen: false,
      }));

      await bulkUpdateOpeningHours(updates);
      showNotification("ปิดทุกวันสำเร็จ", "success");
    } catch {
      showNotification("เกิดข้อผิดพลาดในการปิดทุกวัน", "error");
    }
  };

  const handleApplyWeekdays = async () => {
    try {
      const updates = getDayOrder().map((day) => ({
        dayOfWeek: day as DayOfWeek,
        isOpen: ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(day),
        openTime: "09:00",
        closeTime: "18:00",
        breakStart: "12:00",
        breakEnd: "13:00",
      }));

      await bulkUpdateOpeningHours(updates);
      showNotification("ใช้เวลาทำการวันธรรมดาสำเร็จ", "success");
    } catch {
      showNotification("เกิดข้อผิดพลาดในการใช้เวลาทำการวันธรรมดา", "error");
    }
  };

  const handleApplyWeekends = async () => {
    try {
      const updates = getDayOrder().map((day) => ({
        dayOfWeek: day as DayOfWeek,
        isOpen: ["saturday", "sunday"].includes(day),
        openTime: "10:00",
        closeTime: "20:00",
        breakStart: "14:00",
        breakEnd: "15:00",
      }));

      await bulkUpdateOpeningHours(updates);
      showNotification("ใช้เวลาทำการวันหยุดสำเร็จ", "success");
    } catch {
      showNotification("เกิดข้อผิดพลาดในการใช้เวลาทำการวันหยุด", "error");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            กำลังโหลดข้อมูลเวลาทำการ...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            เกิดข้อผิดพลาด
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ไม่สามารถโหลดข้อมูลเวลาทำการได้
          </p>
          <button
            onClick={refreshOpeningHours}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`p-4 rounded-lg border ${
            notification.type === "success"
              ? "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:text-green-300"
              : "bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20 dark:text-red-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p>{notification.message}</p>
            <button
              onClick={hideNotification}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <OpeningHoursStats stats={stats} />

      {/* Main Table */}
      <OpeningHoursTable
        weeklySchedule={weeklySchedule}
        editMode={editMode}
        selectedDay={selectedDay}
        stats={stats}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        calculateWorkingHours={calculateWorkingHours}
      />

      {/* Edit Form */}
      {selectedDay && (
        <OpeningHoursEditForm
          selectedDay={selectedDay}
          editForm={editForm}
          dayLabels={dayLabels}
          onFormChange={updateEditForm}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Quick Actions */}
      <OpeningHoursQuickActions
        editMode={editMode}
        onToggleEditMode={toggleEditMode}
        onOpenAllDays={handleOpenAllDays}
        onCloseAllDays={handleCloseAllDays}
        onApplyWeekdays={handleApplyWeekdays}
        onApplyWeekends={handleApplyWeekends}
      />
    </div>
  );
}
