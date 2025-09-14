'use client';

import { OpeningHours } from '@/src/presentation/presenters/dashboard/shop-create/ShopCreatePresenter';

interface OperatingHoursTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  hours: OpeningHours[];
}

interface OperatingHoursTemplateSelectorProps {
  onTemplateSelect: (template: OpeningHours[]) => void;
}

const templates: OperatingHoursTemplate[] = [
  {
    id: 'general-shop',
    name: 'ร้านทั่วไป',
    description: 'เปิด 9:00-18:00 จันทร์-เสาร์, ปิดอาทิตย์',
    icon: '🏪',
    color: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
    hours: [
      { dayOfWeek: 'monday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 'thursday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 'friday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 'saturday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 'sunday', isOpen: false },
    ]
  },
  {
    id: 'restaurant',
    name: 'ร้านอาหาร',
    description: 'เปิด 10:00-22:00 ทุกวัน',
    icon: '🍽️',
    color: 'bg-orange-100 hover:bg-orange-200 border-orange-300',
    hours: [
      { dayOfWeek: 'monday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { dayOfWeek: 'tuesday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { dayOfWeek: 'wednesday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { dayOfWeek: 'thursday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { dayOfWeek: 'friday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { dayOfWeek: 'saturday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { dayOfWeek: 'sunday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
    ]
  },
  {
    id: 'convenience-store',
    name: 'ร้านสะดวกซื้อ',
    description: 'เปิด 24 ชั่วโมงทุกวัน',
    icon: '🏪',
    color: 'bg-green-100 hover:bg-green-200 border-green-300',
    hours: [
      { dayOfWeek: 'monday', isOpen: true, is24Hours: true },
      { dayOfWeek: 'tuesday', isOpen: true, is24Hours: true },
      { dayOfWeek: 'wednesday', isOpen: true, is24Hours: true },
      { dayOfWeek: 'thursday', isOpen: true, is24Hours: true },
      { dayOfWeek: 'friday', isOpen: true, is24Hours: true },
      { dayOfWeek: 'saturday', isOpen: true, is24Hours: true },
      { dayOfWeek: 'sunday', isOpen: true, is24Hours: true },
    ]
  },
  {
    id: 'office-hours',
    name: 'ทำงานทั่วไป',
    description: 'เปิด 8:00-17:00 จันทร์-ศุกร์, ปิดเสาร์-อาทิตย์',
    icon: '🏢',
    color: 'bg-purple-100 hover:bg-purple-200 border-purple-300',
    hours: [
      { dayOfWeek: 'monday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { dayOfWeek: 'tuesday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { dayOfWeek: 'wednesday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { dayOfWeek: 'thursday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { dayOfWeek: 'friday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { dayOfWeek: 'saturday', isOpen: false },
      { dayOfWeek: 'sunday', isOpen: false },
    ]
  },
  {
    id: 'weekend-shop',
    name: 'ร้านวันหยุด',
    description: 'เปิดเฉพาะเสาร์-อาทิตย์ 10:00-20:00',
    icon: '🎯',
    color: 'bg-pink-100 hover:bg-pink-200 border-pink-300',
    hours: [
      { dayOfWeek: 'monday', isOpen: false },
      { dayOfWeek: 'tuesday', isOpen: false },
      { dayOfWeek: 'wednesday', isOpen: false },
      { dayOfWeek: 'thursday', isOpen: false },
      { dayOfWeek: 'friday', isOpen: false },
      { dayOfWeek: 'saturday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
      { dayOfWeek: 'sunday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
    ]
  },
  {
    id: 'cafe',
    name: 'ร้านกาแฟ',
    description: 'เปิด 7:00-20:00 ทุกวัน',
    icon: '☕',
    color: 'bg-amber-100 hover:bg-amber-200 border-amber-300',
    hours: [
      { dayOfWeek: 'monday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
      { dayOfWeek: 'tuesday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
      { dayOfWeek: 'wednesday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
      { dayOfWeek: 'thursday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
      { dayOfWeek: 'friday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
      { dayOfWeek: 'saturday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
      { dayOfWeek: 'sunday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
    ]
  }
];

export function OperatingHoursTemplateSelector({ onTemplateSelect }: OperatingHoursTemplateSelectorProps) {
  const handleTemplateClick = (template: OperatingHoursTemplate) => {
    onTemplateSelect(template.hours);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">เลือก Template เวลาทำการ</h3>
        <span className="text-sm text-muted">เลือก template ที่ใกล้เคียงกับร้านค้าของคุณ</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => handleTemplateClick(template)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${template.color} border-2`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{template.icon}</div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-foreground mb-1">{template.name}</h4>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-info-light rounded-lg border border-info">
        <div className="flex items-start space-x-3">
          <div className="text-info mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-info-dark font-medium">💡 เคล็ดลับ</p>
            <p className="text-sm text-info-dark mt-1">
              คุณสามารถเลือก template และแก้ไขเวลาทำการเพิ่มเติมได้ภายหลังในหน้าจัดการร้านค้า
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
