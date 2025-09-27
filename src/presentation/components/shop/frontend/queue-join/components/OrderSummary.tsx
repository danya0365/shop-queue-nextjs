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
    <div className="shop-frontend-card">
      <div className="p-4 sm:p-6 border-b shop-frontend-card-border">
        <h3 className="text-base sm:text-lg font-semibold shop-frontend-text-primary">
          สรุปการสั่ง
        </h3>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-4">
          {selectedServices.map((serviceId) => {
            const service = services.find((s) => s.id === serviceId);
            const quantity = serviceQuantities[serviceId] || 1;
            if (!service) return null;

            return (
              <div key={serviceId} className="flex flex-col space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <span className="shop-frontend-text-primary font-medium block truncate text-base sm:text-sm">
                      {service.name}
                    </span>
                    <span className="shop-frontend-text-muted text-sm sm:text-xs block">
                      ~{service.estimatedTime} นาที/ชิ้น
                    </span>
                  </div>
                  <span className="shop-frontend-service-price font-bold ml-4 flex-shrink-0 text-base sm:text-sm">
                    ฿{service.price * quantity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decreaseServiceQuantity(serviceId)}
                      className="w-10 h-10 sm:w-7 sm:h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm sm:text-xs transition-colors border border-gray-300 active:scale-95"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-base sm:text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => increaseServiceQuantity(serviceId)}
                      className="w-10 h-10 sm:w-7 sm:h-7 rounded-md bg-primary hover:bg-primary-dark flex items-center justify-center text-white font-medium text-sm sm:text-xs transition-colors active:scale-95"
                    >
                      +
                    </button>
                  </div>
                  <span className="shop-frontend-text-muted text-xs sm:text-xs">
                    ฿{service.price}/ชิ้น
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t shop-frontend-card-border mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold shop-frontend-text-primary text-base sm:text-sm">
              รวมทั้งหมด
            </span>
            <span className="font-bold text-lg sm:text-base shop-frontend-service-price">
              ฿{totalPrice}
            </span>
          </div>
          <div className="text-sm sm:text-xs shop-frontend-text-secondary mt-1">
            เวลาโดยประมาณ: {totalEstimatedTime} นาที
          </div>
        </div>
      </div>
    </div>
  );
}
