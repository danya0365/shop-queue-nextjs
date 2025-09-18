"use client";

import { useQRCode } from "next-qrcode";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
  shopDescription: string;
  shopId: string;
}

export function QRCodeModal({
  isOpen,
  onClose,
  shopName,
  shopDescription,
  shopId,
}: QRCodeModalProps) {
  const { Canvas } = useQRCode();
  const qrPrintRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: qrPrintRef,
    documentTitle: `QR Code สำหรับจองคิว - ${shopName}`,
    onBeforePrint: async () => {
      console.log("Preparing to print QR Code...");
    },
    onAfterPrint: async () => {
      console.log("QR Code printed successfully");
    },
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                QR Code สำหรับจองคิว
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* QR Code Preview */}
            <div className="flex justify-center p-6" ref={qrPrintRef}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {shopName}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {shopDescription}
                  </p>
                </div>

                {/* QR Code Area */}
                <div className="flex items-center justify-center mb-6">
                  <Canvas
                    text={`${window.location.origin}/shop/${shopId}/queue`}
                    options={{
                      errorCorrectionLevel: "M",
                      margin: 3,
                      scale: 4,
                      width: 200,
                    }}
                    logo={{
                      src: "/qr-logo.png",
                      options: { width: 50 },
                    }}
                  />
                </div>

                {/* Instructions */}
                <div className="flex flex-col items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    วิธีการใช้งาน:
                  </p>
                  <p>1. สแกน QR Code นี้ด้วยสมาร์ทโฟน</p>
                  <p>2. ระบบจะพาคุณไปยังหน้าจองคิว</p>
                  <p>3. กรอกข้อมูลและเลือกบริการที่ต้องการ</p>
                  <p>4. รับหมายเลขคิวและรอเรียก</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                ปิด
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors"
              >
                🖨️ ปริ้น QR Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
