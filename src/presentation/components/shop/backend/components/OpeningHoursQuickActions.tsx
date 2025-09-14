"use client";

interface OpeningHoursQuickActionsProps {
  editMode: boolean;
  onToggleEditMode: () => void;
  onOpenAllDays: () => void;
  onCloseAllDays: () => void;
  onApplyWeekdays: () => void;
  onApplyWeekends: () => void;
}

export function OpeningHoursQuickActions({
  editMode,
  onToggleEditMode,
  onOpenAllDays,
  onCloseAllDays,
  onApplyWeekdays,
  onApplyWeekends,
}: OpeningHoursQuickActionsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          การจัดการด่วน
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Edit Mode Toggle */}
          <button
            onClick={onToggleEditMode}
            className={`p-4 rounded-lg border transition-colors ${
              editMode
                ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <div className="text-center">
              <svg
                className="w-6 h-6 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <p className="font-medium">
                {editMode ? "ออกจากโหมดแก้ไข" : "แก้ไขเวลาทำการ"}
              </p>
            </div>
          </button>

          {/* Open All Days */}
          <button
            onClick={onOpenAllDays}
            disabled={!editMode}
            className={`p-4 rounded-lg border transition-colors ${
              editMode
                ? "bg-green-50 border-green-500 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
                : "bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500"
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🟢</div>
              <p className="font-medium">เปิดทุกวัน</p>
            </div>
          </button>

          {/* Close All Days */}
          <button
            onClick={onCloseAllDays}
            disabled={!editMode}
            className={`p-4 rounded-lg border transition-colors ${
              editMode
                ? "bg-red-50 border-red-500 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                : "bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500"
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🔴</div>
              <p className="font-medium">ปิดทุกวัน</p>
            </div>
          </button>

          {/* Apply Weekdays */}
          <button
            onClick={onApplyWeekdays}
            disabled={!editMode}
            className={`p-4 rounded-lg border transition-colors ${
              editMode
                ? "bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30"
                : "bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500"
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📅</div>
              <p className="font-medium">ใช้วันธรรมดา</p>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Apply Weekends */}
          <button
            onClick={onApplyWeekends}
            disabled={!editMode}
            className={`p-4 rounded-lg border transition-colors ${
              editMode
                ? "bg-purple-50 border-purple-500 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30"
                : "bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500"
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <p className="font-medium">ใช้วันหยุด</p>
            </div>
          </button>

          {/* Info */}
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="text-center">
              <div className="text-2xl mb-2">ℹ️</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                กดปุ่ม &ldquo;แก้ไขเวลาทำการ&rdquo; เพื่อเริ่มแก้ไข
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
