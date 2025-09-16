"use client";

import { useServices } from "@/src/presentation/hooks/shop/backend/useServices";
import { QueueItem } from "@/src/presentation/presenters/shop/backend/QueueManagementPresenter";
import { useState } from "react";

interface CreateQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    customerName: string;
    customerPhone: string;
    services: {
      serviceId: string;
      price?: number;
      quantity: number;
    }[];
    priority: QueueItem["priority"];
    notes?: string;
  }) => Promise<void>;
  isLoading?: boolean;
  shopId?: string;
}

export function CreateQueueModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  shopId,
}: CreateQueueModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    priority: "normal" as QueueItem["priority"],
    notes: "",
  });
  const [selectedServices, setSelectedServices] = useState<
    {
      serviceId: string;
      quantity: number;
      price?: number;
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { services, loading: servicesLoading } = useServices(shopId);

  if (!isOpen) return null;

  const filteredServices = services.filter(
    (service) =>
      service.isAvailable &&
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) => {
      const existingIndex = prev.findIndex((s) => s.serviceId === serviceId);
      if (existingIndex >= 0) {
        // Remove service if already selected
        return prev.filter((s) => s.serviceId !== serviceId);
      } else {
        // Add new service with default quantity 1 and no custom price
        return [
          ...prev,
          {
            serviceId,
            quantity: 1,
            price: undefined,
          },
        ];
      }
    });

    // Clear service error when user selects a service
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: "" }));
    }
  };

  const handleServicePriceChange = (
    serviceId: string,
    price: number | undefined
  ) => {
    setSelectedServices((prev) =>
      prev.map((s) => (s.serviceId === serviceId ? { ...s, price } : s))
    );
  };

  const handleServiceQuantityChange = (serviceId: string, quantity: number) => {
    if (quantity < 1) quantity = 1;
    if (quantity > 99) quantity = 99; // Set reasonable max limit

    setSelectedServices((prev) =>
      prev.map((s) => (s.serviceId === serviceId ? { ...s, quantity } : s))
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "กรุณากรอกชื่อลูกค้า";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "กรุณากรอกเบอร์โทร";
    } else if (!/^0[0-9]{9}$/.test(formData.customerPhone)) {
      newErrors.customerPhone =
        "เบอร์โทรไม่ถูกต้อง (ต้องขึ้นต้นด้วย 0 และมี 10 หลัก)";
    }

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

    try {
      await onSave({
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        services: selectedServices.map((s) => ({
          serviceId: s.serviceId,
          price: s.price,
          quantity: s.quantity,
        })),
        priority: formData.priority,
        notes: formData.notes.trim() || undefined,
      });

      // Reset form
      setFormData({
        customerName: "",
        customerPhone: "",
        priority: "normal",
        notes: "",
      });
      setSelectedServices([]);
      setSearchTerm("");
      setErrors({});

      onClose();
    } catch (error) {
      console.error("Error creating queue:", error);
      alert("เกิดข้อผิดพลาดในการสร้างคิว");
    }
  };

  const getPriorityColor = (pri: "normal" | "high" | "urgent") => {
    switch (pri) {
      case "high":
        return "text-orange-600 dark:text-orange-200 bg-orange-100 dark:bg-orange-900";
      case "urgent":
        return "text-purple-600 dark:text-purple-200 bg-purple-100 dark:bg-purple-900";
      default:
        return "text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-700";
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
    return selectedServices.reduce((total, selectedService) => {
      const service = services.find((s) => s.id === selectedService.serviceId);
      const price = selectedService.price || service?.price || 0;
      return total + price * selectedService.quantity;
    }, 0);
  };

  const getServicePrice = (serviceId: string) => {
    const selectedService = selectedServices.find(
      (s) => s.serviceId === serviceId
    );
    const service = services.find((s) => s.id === serviceId);
    return selectedService?.price || service?.price || 0;
  };

  const getServiceQuantity = (serviceId: string) => {
    return (
      selectedServices.find((s) => s.serviceId === serviceId)?.quantity || 1
    );
  };

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((s) => s.serviceId === serviceId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            สร้างคิวใหม่
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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
          {/* Customer Information */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
              ข้อมูลลูกค้า
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ชื่อลูกค้า <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) =>
                    handleInputChange("customerName", e.target.value)
                  }
                  placeholder="กรอกชื่อลูกค้า"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.customerName
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  disabled={isLoading}
                />
                {errors.customerName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  เบอร์โทร <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    handleInputChange("customerPhone", e.target.value)
                  }
                  placeholder="0xxxxxxxxx"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.customerPhone
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  disabled={isLoading}
                />
                {errors.customerPhone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.customerPhone}
                  </p>
                )}
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
                disabled={isLoading}
              />
            </div>

            {/* Services Grid */}
            <div
              className={`grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-md p-3 ${
                errors.services
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-600"
              }`}
            >
              {filteredServices.map((service) => {
                const isSelected = isServiceSelected(service.id);
                const currentPrice = getServicePrice(service.id);
                const quantity = getServiceQuantity(service.id);

                return (
                  <div key={service.id} className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleServiceToggle(service.id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      <span className="flex-1 font-medium">{service.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ราคาพื้นฐาน: ฿{service.price}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="ml-6 grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {/* Custom Price Input */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ราคาต่อหน่วย (฿)
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={currentPrice}
                              onChange={(e) =>
                                handleServicePriceChange(
                                  service.id,
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                              placeholder={service.price.toString()}
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleServicePriceChange(service.id, undefined)
                              }
                              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                              disabled={isLoading}
                            >
                              ค่าเริ่มต้น
                            </button>
                          </div>
                        </div>

                        {/* Quantity Input */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            จำนวน
                          </label>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleServiceQuantityChange(
                                  service.id,
                                  quantity - 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50"
                              disabled={isLoading || quantity <= 1}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={quantity}
                              onChange={(e) =>
                                handleServiceQuantityChange(
                                  service.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleServiceQuantityChange(
                                  service.id,
                                  quantity + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50"
                              disabled={isLoading || quantity >= 99}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {errors.services && (
              <p className="text-sm text-red-500 mt-1">{errors.services}</p>
            )}

            {/* Selected Services Summary */}
            {selectedServices.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    บริการที่เลือก ({selectedServices.length})
                  </span>
                  <span className="text-sm font-bold text-blue-900 dark:text-blue-200">
                    รวม: ฿{calculateTotalPrice()}
                  </span>
                </div>
                <div className="space-y-1">
                  {selectedServices.map((selectedService) => {
                    const service = services.find(
                      (s) => s.id === selectedService.serviceId
                    );
                    const price = getServicePrice(selectedService.serviceId);
                    const quantity = selectedService.quantity;
                    const subtotal = price * quantity;

                    return (
                      <div
                        key={selectedService.serviceId}
                        className="flex justify-between items-center text-sm text-blue-700 dark:text-blue-300"
                      >
                        <span>
                          {service?.name} x{quantity}
                          {selectedService.price !== undefined && (
                            <span className="text-xs text-orange-600 dark:text-orange-400 ml-1">
                              (฿{price}/หน่วย)
                            </span>
                          )}
                        </span>
                        <span className="font-medium">฿{subtotal}</span>
                      </div>
                    );
                  })}
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
                    checked={formData.priority === pri}
                    onChange={() => handleInputChange("priority", pri)}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              หมายเหตุ
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
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
              className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              disabled={isLoading}
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
              <span>สร้างคิว</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
