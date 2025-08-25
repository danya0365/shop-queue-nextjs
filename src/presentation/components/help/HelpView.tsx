'use client';

import { HelpViewModel } from '@/src/presentation/presenters/help/HelpPresenter';
import { useHelpPresenter } from '@/src/presentation/presenters/help/useHelpPresenter';
import Link from 'next/link';
import { useState } from 'react';

interface HelpViewProps {
  viewModel: HelpViewModel;
}

export function HelpView({ viewModel }: HelpViewProps) {
  const [state, actions] = useHelpPresenter();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Filter FAQs based on search query
  const filteredFAQs = viewModel.faqs.filter(faq =>
    state.searchQuery === '' ||
    faq.question.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await actions.submitContactForm(contactForm);
    if (success) {
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }
  };

  const handleContactInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ศูนย์ช่วยเหลือ
            <br />
            <span className="text-primary-light">Shop Queue</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            ค้นหาคำตอบ เรียนรู้การใช้งาน และรับความช่วยเหลือจากทีมงานของเรา
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาคำถามที่พบบ่อย..."
                className="w-full px-6 py-4 rounded-xl bg-input text-foreground placeholder:text-input-placeholder border border-input-border text-lg focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-input-focus"
                value={state.searchQuery}
                onChange={(e) => actions.searchFAQ({ query: e.target.value })}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Help Sections */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">หมวดหมู่ความช่วยเหลือ</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {viewModel.helpSections.map((section) => (
              <Link
                key={section.id}
                href={section.link}
                className="bg-surface rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/20 group"
              >
                <div className="text-4xl mb-4">{section.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
                <p className="text-muted leading-relaxed">
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">คำถามที่พบบ่อย</h2>

          {state.searchQuery && (
            <div className="mb-6 text-center">
              <p className="text-muted">
                พบ {filteredFAQs.length} คำถามจากการค้นหา &quot;{state.searchQuery}&quot;
              </p>
            </div>
          )}

          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-surface rounded-xl shadow-lg border border-border overflow-hidden">
                <button
                  onClick={() => actions.toggleFAQ(faq.id)}
                  className="w-full px-8 py-6 text-left hover:bg-muted-light transition-colors focus:outline-none focus:bg-muted-light"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-2">
                        {faq.category}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground">
                        {faq.question}
                      </h3>
                    </div>
                    <svg
                      className={`w-6 h-6 text-muted transition-transform ${state.expandedFAQ === faq.id ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {state.expandedFAQ === faq.id && (
                  <div className="px-8 pb-6">
                    <div className="pt-4 border-t border-border">
                      <p className="text-foreground leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && state.searchQuery && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">ไม่พบคำตอบที่ค้นหา</h3>
              <p className="text-muted mb-6">ลองใช้คำค้นหาอื่น หรือติดต่อทีมงานของเราได้เลย</p>
              <button
                onClick={() => actions.searchFAQ({ query: '' })}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                แสดงคำถามทั้งหมด
              </button>
            </div>
          )}
        </section>

        {/* Contact Form Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">ติดต่อทีมงาน</h2>
              <p className="text-muted text-lg">
                หากไม่พบคำตอบที่ต้องการ สามารถส่งข้อความถึงทีมงานของเราได้
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="bg-surface rounded-xl p-8 shadow-lg">
                <h3 className="text-xl font-bold mb-6">ข้อมูลการติดต่อ</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">อีเมล</p>
                      <p className="text-muted">{viewModel.contactInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">โทรศัพท์</p>
                      <p className="text-muted">{viewModel.contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">เวลาทำการ</p>
                      <p className="text-muted">{viewModel.contactInfo.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-surface rounded-xl p-8 shadow-lg">
                <h3 className="text-xl font-bold mb-6">ส่งข้อความถึงเรา</h3>

                {state.isContactFormSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">ส่งข้อความสำเร็จ!</h4>
                    <p className="text-muted mb-4">
                      ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง
                    </p>
                    <button
                      onClick={() => actions.reset()}
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      ส่งข้อความใหม่
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">ชื่อ *</label>
                        <input
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => handleContactInputChange('name', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="ระบุชื่อของคุณ"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">อีเมล *</label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => handleContactInputChange('email', e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">หัวข้อ *</label>
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => handleContactInputChange('subject', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="หัวข้อที่ต้องการสอบถาม"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">ข้อความ *</label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => handleContactInputChange('message', e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="รายละเอียดที่ต้องการสอบถาม..."
                      />
                    </div>

                    {state.error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700">{state.error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={state.isLoading}
                      className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {state.isLoading ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center bg-primary-gradient rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมเริ่มใช้งานแล้วหรือยัง?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            สร้างบัญชีและเริ่มจัดการคิวร้านค้าของคุณได้เลยวันนี้
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-surface text-primary px-8 py-3 rounded-lg font-medium hover:bg-muted-light transition-colors"
            >
              สมัครสมาชิกฟรี
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
