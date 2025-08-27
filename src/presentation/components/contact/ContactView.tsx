'use client';

import { ContactViewModel } from '@/src/presentation/presenters/contact/ContactPresenter';
import { ContactFormData, useContactPresenter } from '@/src/presentation/presenters/contact/useContactPresenter';
import Link from 'next/link';
import { useState } from 'react';

interface ContactViewProps {
  viewModel: ContactViewModel;
}

export function ContactView({ viewModel }: ContactViewProps) {
  const { contactInfo, formFields, faqs, supportChannels } = viewModel;
  const [state, actions] = useContactPresenter();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    business_type: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await actions.submitForm(formData);
    if (success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        business_type: '',
        subject: '',
        message: '',
      });
    }
  };

  const handleReset = () => {
    actions.resetForm();
    setFormData({
      name: '',
      email: '',
      phone: '',
      business_type: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ติดต่อเรา
            <br />
            <span className="text-primary-light">พร้อมให้บริการ</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            มีคำถามหรือต้องการความช่วยเหลือ? ทีมงานของเราพร้อมให้บริการและสนับสนุนคุณ
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {supportChannels.map((channel) => (
            <div
              key={channel.id}
              className="bg-surface rounded-lg border border-border p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-4">
                {channel.icon === 'phone' && '📞'}
                {channel.icon === 'envelope' && '✉️'}
                {channel.icon === 'chat' && '💬'}
                {channel.icon === 'message' && '📱'}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{channel.name}</h3>
              <p className="text-sm text-muted mb-3">{channel.description}</p>
              <div className="text-xs text-primary font-medium">
                ตอบกลับ: {channel.responseTime}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              ส่งข้อความหาเรา
            </h2>

            {state.success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  {state.success}
                </div>
              </div>
            )}

            {state.error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                <div className="flex items-center">
                  <span className="text-red-600 mr-2">✕</span>
                  {state.error}
                </div>
              </div>
            )}

            {!state.isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {formFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.id}
                        value={formData[field.id as keyof ContactFormData] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        name={field.id}
                        value={formData[field.id as keyof ContactFormData] || ''}
                        onChange={handleInputChange}
                        required={field.required}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">{field.placeholder}</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.id}
                        value={formData[field.id as keyof ContactFormData] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={state.isSubmitting}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  ส่งข้อความเรียบร้อยแล้ว!
                </h3>
                <p className="text-muted mb-6">
                  เราจะติดต่อกลับภายใน 24 ชั่วโมง
                </p>
                <button
                  onClick={handleReset}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  ส่งข้อความใหม่
                </button>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              ข้อมูลติดต่อ
            </h2>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="text-2xl">📞</div>
                <div>
                  <h3 className="font-semibold text-foreground">โทรศัพท์</h3>
                  <p className="text-muted">{contactInfo.phone}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="text-2xl">✉️</div>
                <div>
                  <h3 className="font-semibold text-foreground">อีเมล</h3>
                  <p className="text-muted">{contactInfo.email}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="text-2xl">📍</div>
                <div>
                  <h3 className="font-semibold text-foreground">ที่อยู่</h3>
                  <p className="text-muted">{contactInfo.address}</p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🕐</div>
                <div>
                  <h3 className="font-semibold text-foreground">เวลาทำการ</h3>
                  <p className="text-muted">{contactInfo.businessHours.weekdays}</p>
                  <p className="text-muted">{contactInfo.businessHours.weekends}</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🌐</div>
                <div>
                  <h3 className="font-semibold text-foreground">โซเชียลมีเดีย</h3>
                  <div className="space-y-1">
                    {contactInfo.socialMedia.facebook && (
                      <p className="text-muted">Facebook: Shop Queue</p>
                    )}
                    {contactInfo.socialMedia.line && (
                      <p className="text-muted">LINE: {contactInfo.socialMedia.line}</p>
                    )}
                    {contactInfo.socialMedia.instagram && (
                      <p className="text-muted">Instagram: {contactInfo.socialMedia.instagram}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 bg-muted-light/30 rounded-lg p-8 text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-muted">แผนที่จะแสดงที่นี่</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              คำถามที่พบบ่อย
            </h2>
            <p className="text-xl text-muted">
              คำตอบสำหรับคำถามที่ลูกค้าถามบ่อยที่สุด
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-surface rounded-lg border border-border p-6"
              >
                <h3 className="font-semibold text-foreground mb-3">
                  {faq.question}
                </h3>
                <p className="text-muted text-sm">{faq.answer}</p>
                <div className="mt-3">
                  <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    {faq.category === 'general' && 'ทั่วไป'}
                    {faq.category === 'technical' && 'เทคนิค'}
                    {faq.category === 'billing' && 'การเงิน'}
                    {faq.category === 'features' && 'ฟีเจอร์'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted mb-4">ไม่พบคำตอบที่ต้องการ?</p>
            <Link
              href="/help"
              className="text-primary hover:text-primary-dark font-medium"
            >
              ดูคำถามเพิ่มเติม →
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-primary-gradient rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมเริ่มต้นใช้งานแล้วหรือยัง?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            ลองใช้ Shop Queue ฟรี 14 วัน ไม่ต้องใช้บัตรเครดิต
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/getting-started"
              className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              เริ่มใช้ฟรี
            </Link>
            <Link
              href="/features"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
            >
              ดูฟีเจอร์ทั้งหมด
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
