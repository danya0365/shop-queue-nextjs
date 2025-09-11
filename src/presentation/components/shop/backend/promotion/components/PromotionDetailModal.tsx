"use client";

import type {
  Promotion,
  PromotionsViewModel,
} from "@/src/presentation/presenters/shop/backend/PromotionsPresenter";

interface PromotionDetailModalProps {
  selectedPromotion: Promotion;
  viewModel: PromotionsViewModel;
  setShowDetailsModal: (show: boolean) => void;
}

export default function PromotionDetailModal({
  selectedPromotion,
  viewModel,
  setShowDetailsModal,
}: PromotionDetailModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "inactive":
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
      case "expired":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "scheduled":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "ใช้งานอยู่";
      case "inactive":
        return "ปิดใช้งาน";
      case "expired":
        return "หมดอายุ";
      case "scheduled":
        return "กำหนดการ";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "percentage":
        return "ส่วนลดเปอร์เซ็นต์";
      case "fixed_amount":
        return "ส่วนลดจำนวนคงที่";
      case "buy_x_get_y":
        return "ซื้อ X ฟรี Y";
      case "service_upgrade":
        return "อัพเกรดบริการ";
      default:
        return type;
    }
  };

  const formatPromotionValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case "percentage":
        return `${promotion.value}%`;
      case "fixed_amount":
        return `฿${promotion.value}`;
      case "buy_x_get_y":
        return `ฟรี ${promotion.value} ชิ้น`;
      case "service_upgrade":
        return "อัพเกรดฟรี";
      default:
        return promotion.value.toString();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            รายละเอียดโปรโมชั่น
          </h3>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              {selectedPromotion.name}
            </h4>
            <p className="text-gray-600 mb-4">
              {selectedPromotion.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ประเภท</p>
                <p className="font-medium">
                  {getTypeText(selectedPromotion.type)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ค่าส่วนลด</p>
                <p className="font-medium text-blue-600">
                  {formatPromotionValue(selectedPromotion)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">สถานะ</p>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedPromotion.status
                  )}`}
                >
                  {getStatusText(selectedPromotion.status)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">การใช้งาน</p>
                <p className="font-medium">
                  {selectedPromotion.usedCount}
                  {selectedPromotion.usageLimit &&
                    ` / ${selectedPromotion.usageLimit}`}
                </p>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">ระยะเวลา</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">วันที่เริ่ม</p>
                <p className="font-medium">{selectedPromotion.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">วันที่สิ้นสุด</p>
                <p className="font-medium">{selectedPromotion.endDate}</p>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">
              เงื่อนไขการใช้งาน
            </h5>
            {selectedPromotion.minOrderAmount && (
              <p className="text-sm text-gray-600 mb-1">
                ยอดขั้นต่ำ: ฿{selectedPromotion.minOrderAmount.toLocaleString()}
              </p>
            )}
            {selectedPromotion.maxDiscountAmount && (
              <p className="text-sm text-gray-600 mb-1">
                ส่วนลดสูงสุด: ฿
                {selectedPromotion.maxDiscountAmount.toLocaleString()}
              </p>
            )}
            <div className="space-y-1">
              {selectedPromotion.conditions.map((condition, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-gray-600"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {condition}
                </div>
              ))}
            </div>
          </div>

          {/* Applicable Services */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">บริการที่ใช้ได้</h5>
            <div className="flex flex-wrap gap-2">
              {selectedPromotion.applicableServices.includes("all") ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ทุกบริการ
                </span>
              ) : (
                selectedPromotion.applicableServices.map((serviceId) => {
                  const service = viewModel.services.find(
                    (s) => s.id === serviceId
                  );
                  return service ? (
                    <span
                      key={service.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {service.name}
                    </span>
                  ) : null;
                })
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>สร้างเมื่อ: {selectedPromotion.createdAt}</p>
              </div>
              <div>
                <p>สร้างโดย: {selectedPromotion.createdBy}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setShowDetailsModal(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ปิด
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            แก้ไข
          </button>
        </div>
      </div>
    </div>
  );
}
