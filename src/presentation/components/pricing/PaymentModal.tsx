'use client';

import React, { useState } from 'react';
import type { PricingPlanDto } from '@/src/application/dtos/pricing-dto';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlanDto | null;
  isAnnual: boolean;
  currentPlan?: string;
}

export function PaymentModal({ isOpen, onClose, plan, isAnnual, currentPlan }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'promptpay' | 'bank_transfer'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    phone: '',
    address: '',
  });

  if (!isOpen || !plan) return null;

  const calculatePrice = () => {
    if (plan.price === 0) return 0;
    return isAnnual ? plan.price * 10 : plan.price; // 20% discount for annual
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would integrate with actual payment gateway
    alert(`การชำระเงินสำเร็จ! อัปเกรดเป็น ${plan.name} แล้ว`);
    setIsProcessing(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isUpgrade = currentPlan && currentPlan !== plan.type;
  const actionText = isUpgrade ? 'อัปเกรด' : 'สมัคร';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {actionText}เป็น {plan.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">สรุปคำสั่งซื้อ</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">แผน {plan.name}</span>
                <span className="font-medium">฿{plan.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ระยะเวลา</span>
                <span className="font-medium">{isAnnual ? '1 ปี' : '1 เดือน'}</span>
              </div>
              {isAnnual && plan.price > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>ส่วนลดรายปี (20%)</span>
                  <span>-฿{(plan.price * 2).toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>รวมทั้งสิ้น</span>
                <span>฿{calculatePrice().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">เลือกวิธีการชำระเงิน</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  paymentMethod === 'credit_card' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">💳</div>
                <div className="text-sm font-medium">บัตรเครดิต</div>
              </button>
              <button
                onClick={() => setPaymentMethod('promptpay')}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  paymentMethod === 'promptpay' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">📱</div>
                <div className="text-sm font-medium">PromptPay</div>
              </button>
              <button
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  paymentMethod === 'bank_transfer' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">🏦</div>
                <div className="text-sm font-medium">โอนเงิน</div>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>

            {/* Credit Card Fields */}
            {paymentMethod === 'credit_card' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    หมายเลขบัตร *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      วันหมดอายุ *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อบนบัตร *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
              </>
            )}

            {/* PromptPay */}
            {paymentMethod === 'promptpay' && (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="font-medium text-gray-900 mb-2">สแกน QR Code เพื่อชำระเงิน</h3>
                <p className="text-gray-600 mb-4">
                  จำนวนเงิน: ฿{calculatePrice().toLocaleString()}
                </p>
                <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-gray-500">QR Code จะแสดงที่นี่</span>
                </div>
              </div>
            )}

            {/* Bank Transfer */}
            {paymentMethod === 'bank_transfer' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">ข้อมูลการโอนเงิน</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ธนาคาร:</span>
                    <span className="font-medium">กสิกรไทย</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">เลขที่บัญชี:</span>
                    <span className="font-medium">123-4-56789-0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ชื่อบัญชี:</span>
                    <span className="font-medium">บริษัท Shop Queue จำกัด</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">จำนวนเงิน:</span>
                    <span className="font-medium text-blue-600">฿{calculatePrice().toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * กรุณาโอนเงินตามจำนวนที่ระบุและแจ้งชำระเงินผ่านอีเมลที่กรอกไว้
                </p>
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เบอร์โทร *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="08X-XXX-XXXX"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-600">
                ฉันยอมรับ{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  ข้อกำหนดการใช้งาน
                </a>{' '}
                และ{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  นโยบายความเป็นส่วนตัว
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังประมวลผล...
                </div>
              ) : (
                `${actionText}เป็น ${plan.name} (฿${calculatePrice().toLocaleString()})`
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-green-700">
                ข้อมูลการชำระเงินของคุณได้รับการปกป้องด้วยการเข้ารหัส SSL 256-bit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
