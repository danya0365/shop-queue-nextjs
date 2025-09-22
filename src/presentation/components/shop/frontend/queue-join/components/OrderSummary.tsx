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
        <div className="space-y-4">
          {selectedServices.map((serviceId) => {
            const service = services.find((s) => s.id === serviceId);
            const quantity = serviceQuantities[serviceId] || 1;
            if (!service) return null;

            return (
              <div
                key={serviceId}
                className="flex flex-col space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <span className="frontend-text-primary font-medium block truncate">
                      {service.name}
                    </span>
                    <span className="frontend-text-muted text-sm block">
                      ~{service.estimatedTime} นาที/ชิ้น
                    </span>
                  </div>
                  <span className="frontend-service-price font-bold ml-4 flex-shrink-0">
                    ฿{service.price * quantity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() =>
                        decreaseServiceQuantity(serviceId)
                      }
                      className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-xs transition-colors border border-gray-300"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-semibold text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        increaseServiceQuantity(serviceId)
                      }
                      className="w-7 h-7 rounded-md bg-primary hover:bg-primary-dark flex items-center justify-center text-white font-medium text-xs transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="frontend-text-muted text-xs">
                    ฿{service.price}/ชิ้น
                  </span>
                </div>
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
