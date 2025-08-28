'use client';

import { useState } from 'react';
import type { PostersViewModel, PosterTemplate, PosterCustomization } from '@/src/presentation/presenters/shop/backend/PostersPresenter';
import { SubscriptionUpgradeButton } from '../../shared/SubscriptionUpgradeButton';
import { PaymentModal } from '../../pricing/PaymentModal';

interface PostersViewProps {
  viewModel: PostersViewModel;
}

export function PostersView({ viewModel }: PostersViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PosterTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customization, setCustomization] = useState<Partial<PosterCustomization>>({
    showServices: true,
    showOpeningHours: true,
    showPhone: true,
    showAddress: true,
    qrCodeSize: 'medium',
    customText: ''
  });

  const handleTemplateSelect = (template: PosterTemplate) => {
    if (template.isPremium && !viewModel.userSubscription.isPremium) {
      alert('โปสเตอร์นี้ต้องสมัครแพ็คเกจ Premium เท่านั้น');
      return;
    }
    setSelectedTemplate(template);
  };

  const handleCreatePoster = () => {
    if (!selectedTemplate) return;
    
    const { usage, limits } = viewModel.userSubscription;
    
    // Check if user can create free poster
    if (usage.canCreateFree || limits.hasUnlimitedPosters) {
      handlePrint();
      return;
    }
    
    // Show payment modal for paid poster
    setShowPaymentModal(true);
  };

  const handlePreview = () => {
    if (!selectedTemplate) return;
    setShowPreview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'minimal': return '✨';
      case 'colorful': return '🎨';
      case 'professional': return '💼';
      case 'creative': return '🎭';
      default: return '📄';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'minimal': return 'เรียบง่าย';
      case 'colorful': return 'สีสันสดใส';
      case 'professional': return 'มืออาชีพ';
      case 'creative': return 'สร้างสรรค์';
      default: return category;
    }
  };

  const groupedTemplates = viewModel.templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, PosterTemplate[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">จัดการโปสเตอร์</h1>
                <p className="text-sm text-gray-600">สร้างและปรินต์โปสเตอร์พร้อม QR Code สำหรับร้านค้าของคุณ</p>
              </div>
              
              {/* Subscription Status & Poster Usage */}
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg ${
                  viewModel.userSubscription.isPremium 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span>{viewModel.userSubscription.isPremium ? '👑' : '📦'}</span>
                    <span className="font-medium">{viewModel.userSubscription.planName}</span>
                  </div>
                </div>
                
                {/* Poster Usage Counter */}
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium">โปสเตอร์ฟรี:</span>
                    <span className="ml-1">
                      {viewModel.userSubscription.usage.remainingFreePosters} / {viewModel.userSubscription.limits.maxFreePosters}
                      {viewModel.userSubscription.limits.hasUnlimitedPosters && ' (ไม่จำกัด)'}
                    </span>
                  </div>
                  {viewModel.userSubscription.usage.paidPostersUsed > 0 && (
                    <div className="text-xs text-blue-600">
                      ซื้อเพิ่ม: {viewModel.userSubscription.usage.paidPostersUsed} ใบ
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Shop Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลร้านค้า</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">ชื่อร้าน</p>
              <p className="font-medium">{viewModel.shopInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">คำอธิบาย</p>
              <p className="font-medium">{viewModel.shopInfo.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">เบอร์โทร</p>
              <p className="font-medium">{viewModel.shopInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">เวลาทำการ</p>
              <p className="font-medium">{viewModel.shopInfo.openingHours}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">ที่อยู่</p>
              <p className="font-medium">{viewModel.shopInfo.address}</p>
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div className="space-y-8">
          {Object.entries(groupedTemplates).map(([category, templates]) => (
            <div key={category} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <h3 className="text-xl font-semibold text-gray-900">
                  {getCategoryName(category)}
                </h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                  {templates.length} แบบ
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${
                      template.isPremium && !viewModel.userSubscription.isPremium
                        ? 'opacity-60'
                        : ''
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {/* Premium Badge */}
                    {template.isPremium && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <span>👑</span>
                        Premium
                      </div>
                    )}

                    {/* Template Preview */}
                    <div 
                      className={`w-full h-32 rounded-lg mb-3 flex items-center justify-center text-white font-bold ${
                        template.layout === 'landscape' ? 'aspect-[4/3]' : 'aspect-[3/4]'
                      }`}
                      style={{ 
                        background: template.backgroundColor,
                        color: template.textColor 
                      }}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">{viewModel.shopInfo.name}</div>
                        <div className="text-xs opacity-80">QR Code</div>
                        <div className="w-8 h-8 bg-white/20 rounded mx-auto mt-1"></div>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      
                      {/* Features */}
                      <div className="space-y-1">
                        {template.features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-500">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Layout Badge */}
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          template.layout === 'portrait' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {template.layout === 'portrait' ? '📱 แนวตั้ง' : '🖥️ แนวนอน'}
                        </span>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedTemplate?.id === template.id && (
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                        <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                          <span className="text-sm">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Customization Panel */}
        {selectedTemplate && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ปรับแต่งโปสเตอร์</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Options */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">ข้อมูลที่จะแสดง</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customization.showServices}
                      onChange={(e) => setCustomization({...customization, showServices: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">แสดงรายการบริการ</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customization.showOpeningHours}
                      onChange={(e) => setCustomization({...customization, showOpeningHours: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">แสดงเวลาทำการ</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customization.showPhone}
                      onChange={(e) => setCustomization({...customization, showPhone: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">แสดงเบอร์โทรศัพท์</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customization.showAddress}
                      onChange={(e) => setCustomization({...customization, showAddress: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">แสดงที่อยู่</span>
                  </label>
                </div>
              </div>

              {/* QR Code Size */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">ขนาด QR Code</h4>
                <select
                  value={customization.qrCodeSize}
                  onChange={(e) => setCustomization({...customization, qrCodeSize: e.target.value as 'small' | 'medium' | 'large'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="small">เล็ก</option>
                  <option value="medium">กลาง</option>
                  <option value="large">ใหญ่</option>
                </select>

                {/* Custom Text */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ข้อความเพิ่มเติม (ไม่บังคับ)
                  </label>
                  <textarea
                    value={customization.customText}
                    onChange={(e) => setCustomization({...customization, customText: e.target.value})}
                    placeholder="เช่น 'สแกน QR Code เพื่อเข้าคิว' หรือ 'ลูกค้าใหม่ลด 10%'"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handlePreview}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔍 ดูตัวอย่าง
              </button>
              
              {viewModel.userSubscription.usage.canCreateFree || viewModel.userSubscription.limits.hasUnlimitedPosters ? (
                <button
                  onClick={handlePrint}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  🖨️ สร้างโปสเตอร์ฟรี
                </button>
              ) : (
                <button
                  onClick={handleCreatePoster}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  💳 สร้างโปสเตอร์ ({viewModel.payPerPosterPrice} บาท)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Poster Usage Warning */}
        {!viewModel.userSubscription.usage.canCreateFree && !viewModel.userSubscription.limits.hasUnlimitedPosters && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  โปสเตอร์ฟรีหมดแล้ว
                </h3>
                <p className="text-orange-700 mb-4">
                  คุณได้ใช้โปสเตอร์ฟรี {viewModel.userSubscription.usage.freePostersUsed} ใบจาก {viewModel.userSubscription.limits.maxFreePosters} ใบแล้ว
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    💳 ซื้อโปสเตอร์ ({viewModel.payPerPosterPrice} บาท/ใบ)
                  </button>
                  <SubscriptionUpgradeButton
                    variant="outline"
                    targetPlan="pro"
                    currentPlan={viewModel.userSubscription.tier}
                  >
                    🚀 อัปเกรดแผน Pro
                  </SubscriptionUpgradeButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Upgrade Banner */}
        {!viewModel.userSubscription.isPremium && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 mt-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🚀 อัพเกรดเป็น Premium</h3>
                <p className="text-yellow-100">
                  ปลดล็อคโปสเตอร์พิเศษ {viewModel.premiumTemplates.length} แบบ พร้อมฟีเจอร์เพิ่มเติม
                </p>
                <ul className="mt-2 text-sm text-yellow-100 space-y-1">
                  <li>• โปสเตอร์ดีไซน์พิเศษ {viewModel.premiumTemplates.length} แบบ</li>
                  <li>• โปสเตอร์ฟรี {viewModel.userSubscription.tier === 'free' ? '10' : 'ไม่จำกัด'} ใบ/เดือน</li>
                  <li>• ปรับแต่งสีและฟอนต์ได้</li>
                  <li>• อัพโหลดโลโก้ร้านเอง</li>
                  <li>• ไม่มี watermark</li>
                </ul>
              </div>
              <div>
                <SubscriptionUpgradeButton
                  variant="secondary"
                  size="lg"
                  targetPlan="pro"
                  currentPlan={viewModel.userSubscription.tier}
                  className="bg-white text-orange-600 hover:bg-gray-100"
                >
                  อัพเกรดตอนนี้
                </SubscriptionUpgradeButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">ตัวอย่างโปสเตอร์</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Poster Preview */}
              <div className="flex justify-center mb-6">
                <div 
                  className={`${
                    selectedTemplate.layout === 'portrait' ? 'w-80 h-96' : 'w-96 h-72'
                  } rounded-lg shadow-lg p-8 text-center flex flex-col justify-between`}
                  style={{ 
                    background: selectedTemplate.backgroundColor,
                    color: selectedTemplate.textColor 
                  }}
                >
                  {/* Header */}
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{viewModel.shopInfo.name}</h1>
                    <p className="text-sm opacity-90 mb-4">{viewModel.shopInfo.description}</p>
                  </div>

                  {/* QR Code Area */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className={`bg-white rounded-lg flex items-center justify-center ${
                      customization.qrCodeSize === 'small' ? 'w-20 h-20' :
                      customization.qrCodeSize === 'large' ? 'w-32 h-32' : 'w-24 h-24'
                    }`}>
                      <span className="text-gray-600 text-xs">QR Code</span>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="space-y-2 text-sm">
                    {customization.customText && (
                      <p className="font-medium" style={{ color: selectedTemplate.accentColor }}>
                        {customization.customText}
                      </p>
                    )}
                    {customization.showPhone && <p>📞 {viewModel.shopInfo.phone}</p>}
                    {customization.showOpeningHours && <p>🕒 {viewModel.shopInfo.openingHours}</p>}
                    {customization.showAddress && <p className="text-xs opacity-80">📍 {viewModel.shopInfo.address}</p>}
                    {customization.showServices && (
                      <div className="flex flex-wrap gap-1 justify-center mt-2">
                        {viewModel.shopInfo.services.slice(0, 3).map((service, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 rounded-full text-xs"
                            style={{ 
                              backgroundColor: selectedTemplate.accentColor + '20',
                              color: selectedTemplate.accentColor 
                            }}
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ปิด
                </button>
                <button
                  onClick={handleCreatePoster}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {viewModel.userSubscription.usage.canCreateFree || viewModel.userSubscription.limits.hasUnlimitedPosters 
                    ? '🖨️ สร้างโปสเตอร์ฟรี' 
                    : `💳 สร้างโปสเตอร์ (${viewModel.payPerPosterPrice} บาท)`
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal for Pay-per-Poster */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={{
          id: 'poster-payment',
          name: 'โปสเตอร์แบบจ่ายต่อใบ',
          nameEn: 'Pay-per-Poster',
          description: `สร้างโปสเตอร์ 1 ใบ`,
          descriptionEn: 'Create 1 poster',
          price: viewModel.payPerPosterPrice,
          currency: 'THB',
          billingPeriod: 'one_time' as any,
          type: 'one_time' as any,
          features: ['โปสเตอร์คุณภาพสูง', 'QR Code ที่กำหนดเอง', 'ดาวน์โหลดได้ทันที'],
          featuresEn: ['High-quality poster', 'Custom QR Code', 'Instant download'],
          limits: {} as any,
          isPopular: false,
          isRecommended: false,
          buttonText: `จ่าย ${viewModel.payPerPosterPrice} บาท`,
          buttonTextEn: `Pay ${viewModel.payPerPosterPrice} THB`,
        }}
        isAnnual={false}
        currentPlan={viewModel.userSubscription.tier}
      />
    </div>
  );
}
