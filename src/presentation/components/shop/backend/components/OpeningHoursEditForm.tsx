"use client";

import { EditFormState } from "../hooks/useOpeningHoursState";

interface OpeningHoursEditFormProps {
  selectedDay: string | null;
  editForm: EditFormState;
  dayLabels: Record<string, string>;
  onFormChange: (field: keyof EditFormState, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function OpeningHoursEditForm({
  selectedDay,
  editForm,
  dayLabels,
  onFormChange,
  onSave,
  onCancel,
}: OpeningHoursEditFormProps) {
  if (!selectedDay) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          แก้ไขเวลาทำการ - {dayLabels[selectedDay]}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Open Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              เวลาเปิด
            </label>
            <input
              type="time"
              value={editForm.openTime}
              onChange={(e) => onFormChange("openTime", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Close Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              เวลาปิด
            </label>
            <input
              type="time"
              value={editForm.closeTime}
              onChange={(e) => onFormChange("closeTime", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Break Start */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              เวลาพักเริ่ม
            </label>
            <input
              type="time"
              value={editForm.breakStart}
              onChange={(e) => onFormChange("breakStart", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Break End */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              เวลาพักสิ้นสุด
            </label>
            <input
              type="time"
              value={editForm.breakEnd}
              onChange={(e) => onFormChange("breakEnd", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
