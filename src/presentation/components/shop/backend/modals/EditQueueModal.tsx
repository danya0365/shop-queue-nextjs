"use client";

import { QueueItem } from "@/src/presentation/presenters/shop/backend/QueueManagementPresenter";
import { useState } from "react";

interface EditQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  queue: QueueItem | null;
  onSave: (
    queueId: string,
    data: {
      services: string[];
      priority: "normal" | "high" | "vip";
      notes?: string;
    }
  ) => Promise<void>;
  isLoading?: boolean;
}

// Mock services data - ในอนาคตควรดึงจาก service จริง
const mockServices = [
  { id: "1", name: "กาแฟ", price: 50 },
  { id: "2", name: "กาแฟพิเศษ", price: 70 },
  { id: "3", name: "เค้ก", price: 80 },
  { id: "4", name: "ขนมปัง", price: 30 },
  { id: "5", name: "เซ็ตอาหารเช้า", price: 120 },
  { id: "6", name: "ชาเย็น", price: 40 },
  { id: "7", name: "น้ำผลไม้", price: 60 },
];

export function EditQueueModal({
  isOpen,
  onClose,
  queue,
  onSave,
  isLoading = false,
}: EditQueueModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    queue?.services || []
  );
  const [priority, setPriority] = useState<"normal" | "high" | "vip">(
    queue?.priority || "normal"
  );
  const [notes, setNotes] = useState(queue?.notes || "");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen || !queue) return null;

  const filteredServices = mockServices.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceToggle = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      alert("กรุณาเลือกอย่างน้อย 1 บริการ");
      return;
    }

    try {
      await onSave(queue.id, {
        services: selectedServices,
        priority,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Error saving queue:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const getPriorityColor = (pri: "normal" | "high" | "vip") => {
    switch (pri) {
      case "high":
        return "text-orange-600 bg-orange-100";
      case "vip":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityText = (pri: "normal" | "high" | "vip") => {
    switch (pri) {
      case "high":
        return "สูง";
      case "vip":
        return "VIP";
      default:
        return "ปกติ";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">แก้ไขคิว #{queue.queueNumber}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info (Read-only) */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">ข้อมูลลูกค้า</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">ชื่อลูกค้า</label>
                <p className="font-medium">{queue.customerName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">เบอร์โทร</label>
                <p className="font-medium">{queue.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Services Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              บริการ <span className="text-red-500">*</span>
            </label>

            {/* Search */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="ค้นหาบริการ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
              {filteredServices.map((service) => (
                <label
                  key={service.id}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.name)}
                    onChange={() => handleServiceToggle(service.name)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="flex-1">{service.name}</span>
                  <span className="text-sm text-gray-600">
                    ฿{service.price}
                  </span>
                </label>
              ))}
            </div>

            {selectedServices.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                กรุณาเลือกอย่างน้อย 1 บริการ
              </p>
            )}
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ความสำคัญ
            </label>
            <div className="flex space-x-3">
              {(["normal", "high", "vip"] as const).map((pri) => (
                <label
                  key={pri}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === pri}
                    onChange={() => setPriority(pri)}
                    className="text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                      pri
                    )}`}
                  >
                    {getPriorityText(pri)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมายเหตุ
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เพิ่มหมายเหตุ (ไม่บังคับ)..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
              disabled={isLoading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              disabled={isLoading || selectedServices.length === 0}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>บันทึก</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
