'use client';

import { ShopCreateViewModel } from '@/src/presentation/presenters/dashboard/shop-create/ShopCreatePresenter';
import { ShopCreateData, useShopCreatePresenter } from '@/src/presentation/presenters/dashboard/shop-create/useShopCreatePresenter';
import Link from 'next/link';
import { useState } from 'react';

interface ShopCreateViewProps {
  viewModel: ShopCreateViewModel;
}

export function ShopCreateView({ viewModel }: ShopCreateViewProps) {
  const [state, actions] = useShopCreatePresenter();

  // Use mock data as default values in local development
  const getDefaultFormData = (): ShopCreateData => {
    if (actions.isMockDataEnabled()) {
      return actions.getMockData();
    }

    return {
      name: '',
      description: '',
      category: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      operatingHours: {
        monday: { openTime: '09:00', closeTime: '18:00', breakStart: '00:00', breakEnd: '00:00', closed: false, hasBreak: false },
        tuesday: { openTime: '09:00', closeTime: '18:00', breakStart: '00:00', breakEnd: '00:00', closed: false, hasBreak: false },
        wednesday: { openTime: '09:00', closeTime: '18:00', breakStart: '00:00', breakEnd: '00:00', closed: false, hasBreak: false },
        thursday: { openTime: '09:00', closeTime: '18:00', breakStart: '00:00', breakEnd: '00:00', closed: false, hasBreak: false },
        friday: { openTime: '09:00', closeTime: '18:00', breakStart: '00:00', breakEnd: '00:00', closed: false, hasBreak: false },
        saturday: { openTime: '09:00', closeTime: '18:00', breakStart: '00:00', breakEnd: '00:00', closed: false, hasBreak: false },
        sunday: { openTime: '09:00', closeTime: '18:00', breakStart: '00:00', breakEnd: '00:00', closed: true, hasBreak: false },
      }
    };
  };

  const [formData, setFormData] = useState<ShopCreateData>(getDefaultFormData());

  const handleInputChange = (field: keyof ShopCreateData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error when user starts typing
    if (state.validationErrors[field]) {
      actions.clearValidationErrors();
    }
  };

  const handleOperatingHoursChange = (day: string, field: 'openTime' | 'closeTime' | 'breakStart' | 'breakEnd' | 'closed' | 'hasBreak', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day as keyof typeof prev.operatingHours],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.createShop(formData);
  };

  // Show success message
  if (state.success) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-4">
              สร้างร้านค้าสำเร็จ! 🎉
            </h2>

            <p className="text-muted mb-8 text-lg">
              ร้านค้าของคุณถูกสร้างเรียบร้อยแล้ว กำลังนำคุณไปยังหน้าแดชบอร์ด...
            </p>

            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show limit reached message
  if (!viewModel.canCreateShop) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-warning-light rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-4">
              ถึงขีดจำกัดแล้ว
            </h2>

            <p className="text-muted mb-8 text-lg">
              คุณมีร้านค้าครบ {viewModel.maxShopsAllowed} ร้านแล้ว กรุณาอัปเกรดแผนการใช้งานเพื่อสร้างร้านค้าเพิ่มเติม
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                อัปเกรดแผน
              </Link>
              <Link
                href="/dashboard"
                className="border border-border text-foreground px-8 py-3 rounded-lg font-medium hover:bg-muted-light transition-colors"
              >
                กลับแดชบอร์ด
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/dashboard"
              className="flex items-center text-muted hover:text-foreground transition-colors mr-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              กลับแดชบอร์ด
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            สร้างร้านค้าใหม่ 🏪
          </h1>
          <p className="text-muted">
            กรอกข้อมูลร้านค้าของคุณเพื่อเริ่มใช้งานระบบจัดการคิว
          </p>

          {/* Progress indicator */}
          <div className="mt-4 p-4 bg-info-light rounded-lg border border-info">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-info mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-info-dark font-medium">
                จำนวนร้านค้าที่สร้างแล้ว {viewModel.currentShopsCount} ร้าน/สูงสุด {viewModel.maxShopsAllowed === null ? 'ไม่จำกัด' : viewModel.maxShopsAllowed} ร้าน
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="mb-6 p-4 bg-error-light border border-error rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-error mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-error-dark">{state.error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">ข้อมูลพื้นฐาน</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  ชื่อร้านค้า *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${state.validationErrors.name ? 'border-error' : 'border-border'
                    }`}
                  placeholder="เช่น ร้านกาแฟดีดี"
                />
                {state.validationErrors.name && (
                  <p className="mt-1 text-sm text-error">{state.validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  ประเภทร้านค้า *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${state.validationErrors.category ? 'border-error' : 'border-border'
                    }`}
                >
                  <option value="">เลือกประเภทร้านค้า</option>
                  {viewModel.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} - {category.description}
                    </option>
                  ))}
                </select>
                {state.validationErrors.category && (
                  <p className="mt-1 text-sm text-error">{state.validationErrors.category}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                คำอธิบายร้านค้า *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${state.validationErrors.description ? 'border-error' : 'border-border'
                  }`}
                placeholder="อธิบายเกี่ยวกับร้านค้าของคุณ บริการที่ให้ และสิ่งที่ทำให้ร้านคุณพิเศษ"
              />
              {state.validationErrors.description && (
                <p className="mt-1 text-sm text-error">{state.validationErrors.description}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">ข้อมูลติดต่อ</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  เบอร์โทรศัพท์ *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${state.validationErrors.phone ? 'border-error' : 'border-border'
                    }`}
                  placeholder="02-123-4567"
                />
                {state.validationErrors.phone && (
                  <p className="mt-1 text-sm text-error">{state.validationErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  อีเมล *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${state.validationErrors.email ? 'border-error' : 'border-border'
                    }`}
                  placeholder="shop@example.com"
                />
                {state.validationErrors.email && (
                  <p className="mt-1 text-sm text-error">{state.validationErrors.email}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                ที่อยู่ *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${state.validationErrors.address ? 'border-error' : 'border-border'
                  }`}
                placeholder="123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110"
              />
              {state.validationErrors.address && (
                <p className="mt-1 text-sm text-error">{state.validationErrors.address}</p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                เว็บไซต์ (ไม่บังคับ)
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${state.validationErrors.website ? 'border-error' : 'border-border'
                  }`}
                placeholder="https://www.example.com"
              />
              {state.validationErrors.website && (
                <p className="mt-1 text-sm text-error">{state.validationErrors.website}</p>
              )}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">เวลาทำการ</h2>

            <div className="space-y-6">
              {Object.entries(formData.operatingHours).map(([day, hours]) => {
                const dayNames = {
                  monday: 'จันทร์',
                  tuesday: 'อังคาร',
                  wednesday: 'พุธ',
                  thursday: 'พฤหัสบดี',
                  friday: 'ศุกร์',
                  saturday: 'เสาร์',
                  sunday: 'อาทิตย์'
                };

                return (
                  <div key={day} className="flex flex-col space-y-3">
                    <div className="flex items-center">
                      <div className="w-20">
                        <span className="text-sm font-medium text-foreground">
                          {dayNames[day as keyof typeof dayNames]}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!hours.closed}
                          onChange={(e) => handleOperatingHoursChange(day, 'closed', !e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary"
                          id={`${day}-open`}
                        />
                        <label htmlFor={`${day}-open`} className="text-sm text-muted ml-2">
                          เปิด
                        </label>
                      </div>
                    </div>

                    {
                      !hours.closed && (
                        <div className="ml-20 space-y-3">
                          <div className="flex items-center">
                            <div className="w-12 text-sm text-muted">เปิด</div>
                            <input
                              type="time"
                              value={hours.openTime}
                              onChange={(e) => handleOperatingHoursChange(day, 'openTime', e.target.value)}
                              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                            <div className="w-12 text-sm text-muted text-center">ถึง</div>
                            <input
                              type="time"
                              value={hours.closeTime}
                              onChange={(e) => handleOperatingHoursChange(day, 'closeTime', e.target.value)}
                              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={hours.hasBreak}
                              onChange={(e) => handleOperatingHoursChange(day, 'hasBreak', e.target.checked)}
                              className="rounded border-border text-primary focus:ring-primary"
                              id={`${day}-break`}
                            />
                            <label htmlFor={`${day}-break`} className="text-sm text-muted ml-2">
                              มีเวลาพัก
                            </label>
                          </div>
                          
                          {hours.hasBreak && (
                            <div className="flex items-center">
                              <div className="w-12"></div>
                              <input
                                type="time"
                                value={hours.breakStart}
                                onChange={(e) => handleOperatingHoursChange(day, 'breakStart', e.target.value)}
                                className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                              />
                              <div className="w-12 text-sm text-muted text-center">ถึง</div>
                              <input
                                type="time"
                                value={hours.breakEnd}
                                onChange={(e) => handleOperatingHoursChange(day, 'breakEnd', e.target.value)}
                                className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                              />
                            </div>
                          )}
                        </div>
                      )
                    }

                    {
                      hours.closed && (
                        <div className="ml-20">
                          <span className="text-muted italic">ปิด</span>
                        </div>
                      )
                    }
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted-light transition-colors"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={state.isLoading}
              className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {state.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  กำลังสร้าง...
                </>
              ) : (
                'สร้างร้านค้า'
              )}
            </button>
          </div>
        </form>
      </div >
    </div >
  );
}
