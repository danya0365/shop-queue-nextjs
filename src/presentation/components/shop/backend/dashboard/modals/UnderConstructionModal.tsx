"use client";

interface UnderConstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export function UnderConstructionModal({
  isOpen,
  onClose,
  featureName,
}: UnderConstructionModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                ฟีเจอร์นี้กำลังอยู่ระหว่างการพัฒนา
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                ฟีเจอร์ <span className="font-semibold text-gray-900 dark:text-gray-100">&ldquo;{featureName}&rdquo;</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                กำลังอยู่ระหว่างการพัฒนาเพื่อปรับปรุงประสบการณ์การใช้งานให้ดียิ่งขึ้น
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 เรากำลังทำงานอย่างหนักเพื่อนำฟีเจอร์นี้มาให้คุณได้ใช้งานเร็วๆ นี้
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
