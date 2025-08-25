'use client';

import { PricingViewModel } from '@/src/presentation/presenters/pricing/PricingPresenter';
import { PricingCard } from './PricingCard';
import { ComparisonTable } from './ComparisonTable';
import { FAQSection } from './FAQSection';
import { useState } from 'react';

interface PricingViewProps {
  viewModel: PricingViewModel;
}

export function PricingView({ viewModel }: PricingViewProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const { plans, comparison } = viewModel;

  const faqs = [
    {
      question: 'สามารถเปลี่ยนแผนได้ตลอดเวลาหรือไม่?',
      answer: 'ได้ครับ คุณสามารถอัปเกรดหรือดาวน์เกรดแผนได้ตลอดเวลา การเปลี่ยนแปลงจะมีผลในรอบการเรียกเก็บเงินถัดไป'
    },
    {
      question: 'หากเกินขีดจำกัดของแผนจะเกิดอะไรขึ้น?',
      answer: 'ระบบจะแจ้งเตือนเมื่อใกล้ถึงขีดจำกัด และจะแนะนำให้อัปเกรดแผน หากเกินขีดจำกัดแล้ว บางฟีเจอร์อาจถูกจำกัดการใช้งานชั่วคราว'
    },
    {
      question: 'ข้อมูลจะปลอดภัยแค่ไหน?',
      answer: 'เราใช้การเข้ารหัสระดับธนาคารและเก็บข้อมูลบน Server ที่ปลอดภัย พร้อมการสำรองข้อมูลอัตโนมัติทุกวัน'
    },
    {
      question: 'มีการสนับสนุนภาษาไทยหรือไม่?',
      answer: 'ใช่ครับ ระบบรองรับภาษาไทยเต็มรูปแบบ และทีมสนับสนุนสามารถให้บริการเป็นภาษาไทยได้'
    },
    {
      question: 'สามารถยกเลิกได้ตลอดเวลาหรือไม่?',
      answer: 'ได้ครับ ไม่มีข้อผูกมัด คุณสามารถยกเลิกได้ตลอดเวลา และข้อมูลจะยังคงอยู่ตามระยะเวลาที่กำหนดในแต่ละแผน'
    },
    {
      question: 'มีการทดลองใช้ฟรีหรือไม่?',
      answer: 'แผนฟรีสามารถใช้งานได้ตลอดชีพ สำหรับแผน Pro และ Enterprise เรามีการทดลองใช้ฟรี 14 วัน'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            เลือกแผนที่เหมาะกับคุณ
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto mb-8">
            เริ่มต้นฟรี หรือเลือกแผนที่เหมาะสมกับขนาดธุรกิจของคุณ 
            อัปเกรดหรือดาวน์เกรดได้ตลอดเวลา
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted'}`}>
              รายเดือน
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted'}`}>
              รายปี
              <span className="ml-1 text-xs text-success">(ประหยัด 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              เปรียบเทียบฟีเจอร์ทั้งหมด
            </h2>
            <p className="text-muted">
              ดูรายละเอียดฟีเจอร์ทั้งหมดในแต่ละแผนเพื่อเลือกที่เหมาะสมที่สุด
            </p>
          </div>
          <ComparisonTable comparison={comparison} />
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <FAQSection faqs={faqs} />
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary-gradient rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            เริ่มใช้งานฟรีวันนี้ หรือติดต่อเราเพื่อขอคำปรึกษา
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/register"
              className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              เริ่มใช้ฟรี
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
            >
              ติดต่อเรา
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
