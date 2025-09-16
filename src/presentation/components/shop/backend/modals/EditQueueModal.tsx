"use client";

import { useServices } from "@/src/presentation/hooks/shop/backend/useServices";
import { QueueItem } from "@/src/presentation/presenters/shop/backend/QueueManagementPresenter";
import { useEffect, useState } from "react";

interface EditQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  queue: QueueItem;
  onSave: (
    queueId: string,
    data: {
      services: {
        serviceId: string;
        quantity: number;
        price?: number;
      }[];
      priority: QueueItem["priority"];
      notes?: string;
    }
  ) => Promise<void>;
  isLoading?: boolean;
}

export function EditQueueModal({
  isOpen,
  onClose,
  queue,
  onSave,
  isLoading = false,
}: EditQueueModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [priority, setPriority] = useState(queue.priority);
  const [notes, setNotes] = useState(queue.notes || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { services, loading: servicesLoading } = useServices(queue.shopId);

  // Effect to set initial selected services when services are loaded
  useEffect(() => {
    if (!servicesLoading && services.length > 0) {
      // Filter and set only services that exist in the available services list
      const validSelectedServices = queue.queueServices.filter((queueService) =>
        services.some((service) => service.id === queueService.serviceId)
      );
      setSelectedServices(
        validSelectedServices.map((queueService) => queueService.serviceId)
      );
    }
  }, [servicesLoading, services, queue.queueServices]);

  if (!isOpen || !queue) return null;

  const filteredServices = services.filter(
    (service) =>
      service.isAvailable &&
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceToggle = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );

    // Clear service error when user selects a service
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedServices.length === 0) {
      newErrors.services = "กรุณาเลือกอย่างน้อย 1 บริการ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // TODO: will implement quantity and price later
    const servicesWithDetails = selectedServices.map((serviceId) => ({
      serviceId,
      quantity: 1,
      price: undefined,
    }));

    try {
      await onSave(queue.id, {
        services: servicesWithDetails,
        priority,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Error saving queue:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const getPriorityColor = (pri: "normal" | "high" | "urgent") => {
    switch (pri) {
      case "high":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
      case "urgent":
        return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
    }
  };

  const getPriorityText = (pri: "normal" | "high" | "urgent") => {
    switch (pri) {
      case "high":
        return "สูง";
      case "urgent":
        return "ด่วน";
      default:
        return "ปกติ";
    }
  };

  const calculateTotalPrice = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            แก้ไขคิว #{queue.queueNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ข้อมูลลูกค้า
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  ชื่อลูกค้า
                </label>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {queue.customerName}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  เบอร์โทร
                </label>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {queue.customerPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Services Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              บริการ <span className="text-red-500">*</span>
            </label>

            {/* Search */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="ค้นหาบริการ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={servicesLoading}
              />
            </div>

            {/* Services Grid */}
            <div
              className={`grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3 ${
                errors.services
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-600"
              }`}
            >
              {servicesLoading ? (
                <div className="col-span-2 flex items-center justify-center py-8">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-600"
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
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    กำลังโหลดบริการ...
                  </span>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                  ไม่พบบริการที่ตรงกับการค้นหา
                </div>
              ) : (
                filteredServices.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      disabled={isLoading || servicesLoading}
                    />
                    <span className="flex-1">{service.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ฿{service.price}
                    </span>
                  </label>
                ))
              )}
            </div>

            {errors.services && (
              <p className="text-sm text-red-500 mt-1">{errors.services}</p>
            )}

            {/* Selected Services Summary */}
            {selectedServices.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    บริการที่เลือก ({selectedServices.length})
                  </span>
                  <span className="text-sm font-bold text-blue-900 dark:text-blue-200">
                    รวม: ฿{calculateTotalPrice()}
                  </span>
                </div>
                <div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  {selectedServices.join(", ")}
                </div>
              </div>
            )}
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ความสำคัญ
            </label>
            <div className="flex space-x-3">
              {(["normal", "high", "urgent"] as const).map((pri) => (
                <label
                  key={pri}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === pri}
                    onChange={() => setPriority(pri)}
                    className="text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              หมายเหตุ
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เพิ่มหมายเหตุ (ไม่บังคับ)..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              disabled={isLoading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 dark:bg-blue-700 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 flex items-center space-x-2"
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
