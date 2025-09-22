"use client";

import { ServiceOption } from "@/src/presentation/presenters/shop/frontend/CustomerQueueJoinPresenter";

interface OrderSummaryProps {
  selectedServices: string[];
  services: ServiceOption[];
  serviceQuantities: Record<string, number>;
  decreaseServiceQuantity: (serviceId: string) => void;
  increaseServiceQuantity: (serviceId: string) => void;
}

export function OrderSummary({
  selectedServices,
  services,
  serviceQuantities,
  decreaseServiceQuantity,
  increaseServiceQuantity,
}: OrderSummaryProps) {
  if (selectedServices.length === 0) {
    return null;
  }

  const totalPrice = selectedServices.reduce((total, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    const quantity = serviceQuantities[serviceId] || 1;
    return total + (service?.price || 0) * quantity;
  }, 0);

  const totalEstimatedTime = selectedServices.reduce((total, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    const quantity = serviceQuantities[serviceId] || 1;
    return total + (service?.estimatedTime || 0) * quantity;
  }, 0);

  return (
    <div className="frontend-card">
      <div className="p-6 border-b frontend-card-border">
        <h3 className="text-lg font-semibold frontend-text-primary">
          สรุปการสั่ง
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {selectedServices.map((serviceId) => {
            const service = services.find((s) => s.id === serviceId);
            const quantity = serviceQuantities[serviceId] || 1;
            if (!service) return null;

            return (
              <div
                key={serviceId}
                className="flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="frontend-text-primary font-medium">
                      {service.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          decreaseServiceQuantity(serviceId)
                        }
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          increaseServiceQuantity(serviceId)
                        }
                        className="w-6 h-6 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center text-white font-bold text-sm transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <span className="frontend-text-muted text-sm ml-12">
                    ~{service.estimatedTime} นาที/ชิ้น
                  </span>
                </div>
                <span className="frontend-service-price font-bold">
                  ฿{service.price * quantity}
                </span>
              </div>
            );
          })}
        </div>
        <div className="border-t frontend-card-border mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold frontend-text-primary">
              รวมทั้งหมด
            </span>
            <span className="font-bold text-lg frontend-service-price">
              ฿{totalPrice}
            </span>
          </div>
          <div className="text-sm frontend-text-secondary mt-1">
            เวลาโดยประมาณ: {totalEstimatedTime} นาที
          </div>
        </div>
      </div>
    </div>
  );
}
