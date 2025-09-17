"use client";

import { useQRCode } from "next-qrcode";

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

  if (!isOpen) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code สำหรับจองคิว - ${shopName}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                background: white;
                color: black;
              }
              .qr-container { 
                max-width: 400px; 
                margin: 0 auto; 
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .shop-name { 
                font-size: 24px; 
                font-weight: bold; 
                margin-bottom: 10px;
                color: #1f2937;
              }
              .shop-desc { 
                font-size: 14px; 
                color: #6b7280; 
                margin-bottom: 20px; 
              }
              .instructions { 
                font-size: 12px; 
                color: #6b7280; 
                margin-top: 20px; 
                text-align: left; 
                background: #f9fafb;
                padding: 15px;
                border-radius: 6px;
              }
              .instructions strong { color: #374151; }
              .instructions p { margin: 5px 0; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="shop-name">${shopName}</div>
              <div class="shop-desc">${shopDescription}</div>
              <div id="qr-code"></div>
              <div class="instructions">
                <p><strong>วิธีการใช้งาน:</strong></p>
                <p>1. สแกน QR Code นี้ด้วยสมาร์ทโฟน</p>
                <p>2. ระบบจะพาคุณไปยังหน้าจองคิว</p>
                <p>3. กรอกข้อมูลและเลือกบริการที่ต้องการ</p>
                <p>4. รับหมายเลขคิวและรอเรียก</p>
              </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
            <script>
              QRCode.toCanvas(document.getElementById('qr-code'), '${window.location.origin}/shop/${shopId}/queue', {
                width: 200,
                margin: 2,
                color: {
                  dark: '#000000',
                  light: '#FFFFFF'
                }
              });
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
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
          <div className="flex justify-center p-6">
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
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
  );
}
