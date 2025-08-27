'use client';

import { FeatureDto, FeatureSectionDto, TestimonialDto } from '@/src/application/dtos/features-dto';
import Link from 'next/link';
import { FeatureCard } from './FeatureCard';
import { FeatureSection } from './FeatureSection';
import { TestimonialCard } from './TestimonialCard';

/**
 * Features page view model
 */
export interface FeaturesViewModel {
  sections: FeatureSectionDto[];
  testimonials: TestimonialDto[];
  totalFeatures: number;
  popularFeatures: FeatureDto[];
}


interface FeaturesViewProps {
  viewModel: FeaturesViewModel;
}

export function FeaturesView({ viewModel }: FeaturesViewProps) {
  const { sections, testimonials, totalFeatures, popularFeatures } = viewModel;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ฟีเจอร์ครบครัน
            <br />
            <span className="text-primary-light">สำหรับทุกธุรกิจ</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            ค้นพบเครื่องมือและฟีเจอร์ที่จะช่วยให้ธุรกิจของคุณเติบโตและมีประสิทธิภาพมากขึ้น
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/getting-started"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              ทดลองใช้ฟรี
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              ดูแผนราคา
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-muted-light/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{totalFeatures}+</div>
              <div className="text-muted">ฟีเจอร์ทั้งหมด</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted">ร้านค้าที่ใช้งาน</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted">ความพึงพอใจ</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Popular Features Section */}
        {popularFeatures.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                ฟีเจอร์ยอดนิยม
              </h2>
              <p className="text-xl text-muted">
                ฟีเจอร์ที่ลูกค้าชื่นชอบและใช้งานมากที่สุด
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {popularFeatures.slice(0, 3).map((feature) => (
                <FeatureCard key={feature.id} feature={feature} variant="detailed" />
              ))}
            </div>
          </div>
        )}

        {/* All Features Sections */}
        {sections.map((section) => (
          <FeatureSection key={section.id} section={section} />
        ))}

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                เสียงจากลูกค้าจริง
              </h2>
              <p className="text-xl text-muted">
                ฟังประสบการณ์จากเจ้าของร้านที่ใช้งานจริง
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        )}

        {/* Integration Section */}
        <div className="mb-20">
          <div className="bg-surface rounded-2xl border border-border p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              ผสานรวมได้กับทุกระบบ
            </h2>
            <p className="text-xl text-muted mb-8 max-w-3xl mx-auto">
              Shop Queue สามารถเชื่อมต่อกับระบบที่คุณใช้งานอยู่แล้ว
              ไม่ว่าจะเป็น POS, ระบบบัญชี หรือแอปพลิเคชันอื่นๆ
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {[
                { name: 'POS Systems', icon: '💳' },
                { name: 'Accounting', icon: '📊' },
                { name: 'CRM', icon: '👥' },
                { name: 'Analytics', icon: '📈' }
              ].map((integration, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2">{integration.icon}</div>
                  <div className="text-sm text-muted">{integration.name}</div>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              สอบถามการเชื่อมต่อ
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              คำถามที่พบบ่อย
            </h2>
            <p className="text-xl text-muted">
              คำตอบสำหรับคำถามที่ลูกค้าถามบ่อยที่สุด
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: 'ใช้งานยากไหม?',
                answer: 'ไม่เลย! ระบบออกแบบให้ใช้งานง่าย เริ่มใช้งานได้ทันทีภายใน 5 นาที'
              },
              {
                question: 'รองรับภาษาไทยไหม?',
                answer: 'รองรับเต็มรูปแบบ ทั้งระบบและการสนับสนุนลูกค้าเป็นภาษาไทย'
              },
              {
                question: 'ข้อมูลปลอดภัยแค่ไหน?',
                answer: 'ใช้การเข้ารหัสระดับธนาคาร และเก็บข้อมูลบนเซิร์ฟเวอร์ที่ปลอดภัย'
              },
              {
                question: 'มีการสนับสนุนไหม?',
                answer: 'มีทีมสนับสนุนภาษาไทยพร้อมช่วยเหลือทุกวันจันทร์-ศุกร์'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-surface rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                <p className="text-muted text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary-gradient rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            ลองใช้ฟีเจอร์ทั้งหมดฟรี 14 วัน ไม่ต้องใช้บัตรเครดิต
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/getting-started"
              className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              เริ่มใช้ฟรี
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
            >
              ติดต่อเรา
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
