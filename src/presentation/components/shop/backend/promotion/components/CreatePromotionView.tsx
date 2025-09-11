"use client";

interface CreatePromotionViewProps {
  setShowAddModal: (show: boolean) => void;
  submitCallback: (promotion: Record<string, unknown>) => void;
}

export default function CreatePromotionView({
  setShowAddModal,
  submitCallback,
}: CreatePromotionViewProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const promotion = Object.fromEntries(formData.entries());
    submitCallback(promotion);
    setShowAddModal(false);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            สร้างโปรโมชั่นใหม่
          </h3>
          <button
            onClick={() => setShowAddModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อโปรโมชั่น
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="กรอกชื่อโปรโมชั่น"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              คำอธิบาย
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="กรอกคำอธิบาย"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ประเภทโปรโมชั่น
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">เลือกประเภท</option>
              <option value="percentage">ส่วนลดเปอร์เซ็นต์</option>
              <option value="fixed_amount">ส่วนลดจำนวนคงที่</option>
              <option value="buy_x_get_y">ซื้อ X ฟรี Y</option>
              <option value="service_upgrade">อัพเกรดบริการ</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่เริ่ม
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่สิ้นสุด
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ค่าส่วนลด/จำนวน
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="กรอกค่าส่วนลด"
            />
          </div>
        </form>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            สร้างโปรโมชั่น
          </button>
        </div>
      </div>
    </div>
  );
}
