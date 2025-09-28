"use client";

import {
  ShopContactViewModel,
} from "@/src/presentation/presenters/shop/contact/ShopContactPresenter";
import { useShopContactPresenter } from "@/src/presentation/presenters/shop/contact/useShopContactPresenter";
import {
  AlertCircle,
  CheckCircle,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
}

interface ShopContactViewProps {
  initialViewModel?: ShopContactViewModel | null;
}

export function ShopContactView({ initialViewModel }: ShopContactViewProps) {
  const [state, actions] = useShopContactPresenter(initialViewModel);
  const { viewModel, loading, error, submitting, submitResult } = state;

  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "general",
  });

  // FAQ state
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedFAQCategory, setSelectedFAQCategory] = useState<string>("all");

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      actions.setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    await actions.submitContactForm(formData);

    // Reset form on success
    if (submitResult?.success) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        category: "general",
      });
    }
  };

  // Handle FAQ toggle
  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  // Filter FAQs by category
  const filteredFAQs =
    viewModel?.faqs.filter(
      (faq) =>
        selectedFAQCategory === "all" || faq.category === selectedFAQCategory
    ) || [];

  // Show loading state
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 marketplace-contact-loading-spinner mx-auto mb-4"></div>
          <p className="marketplace-contact-loading-text">
            กำลังโหลดข้อมูลติดต่อ...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold marketplace-contact-error-title mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="marketplace-contact-error-message mb-4">{error}</p>
          <button
            onClick={actions.refreshData}
            className="marketplace-button-primary px-4 py-2 rounded-lg transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold marketplace-contact-empty-title mb-2">
            ไม่พบข้อมูล
          </h1>
          <p className="marketplace-contact-empty-message">
            ไม่สามารถโหลดข้อมูลติดต่อได้
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold marketplace-text-primary mb-6">
          ติดต่อเรา
        </h1>
        <p className="text-xl marketplace-text-secondary max-w-3xl mx-auto leading-relaxed">
          เรายินดีรับฟังความคิดเห็น คำถาม และข้อเสนอแนะจากคุณ
          ทีมงานของเราพร้อมให้บริการและช่วยเหลือคุณตลอด 24 ชั่วโมง
        </p>
      </section>

      {/* Contact Methods */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold marketplace-text-primary mb-4">
            ช่องทางการติดต่อ
          </h2>
          <p className="marketplace-text-secondary">
            เลือกช่องทางที่สะดวกสำหรับคุณ
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {viewModel.contactMethods.map((method) => (
            <a
              key={method.id}
              href={method.action}
              className="marketplace-card p-6 text-center marketplace-card-hover group transition-all duration-200 hover:scale-105"
            >
              <div className="text-4xl mb-4">{method.icon}</div>
              <h3 className="text-lg font-semibold marketplace-text-primary mb-2 marketplace-contact-method-hover transition-colors">
                {method.title}
              </h3>
              <p className="marketplace-text-secondary text-sm">
                {method.description}
              </p>
              {method.available && (
                <div className="mt-4">
                  <span className="inline-flex items-center marketplace-contact-available text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    พร้อมให้บริการ
                  </span>
                </div>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="marketplace-card p-8">
          <h3 className="text-2xl font-bold marketplace-text-primary mb-6">
            ส่งข้อความถึงเรา
          </h3>

          {submitResult && (
            <div
              className={`p-4 rounded-lg mb-6 flex items-center ${
                submitResult.success
                  ? "marketplace-contact-success-bg"
                  : "marketplace-contact-error-bg"
              }`}
            >
              {submitResult.success ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              {submitResult.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium marketplace-text-primary mb-2"
                >
                  ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 marketplace-contact-input rounded-lg marketplace-input"
                  placeholder="กรอกชื่อ-นามสกุล"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium marketplace-text-primary mb-2"
                >
                  อีเมล *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 marketplace-contact-input rounded-lg marketplace-input"
                  placeholder="กรอกอีเมล"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium marketplace-text-primary mb-2"
              >
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 marketplace-contact-input rounded-lg marketplace-input"
                placeholder="กรอกเบอร์โทรศัพท์ (ไม่บังคับ)"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium marketplace-text-primary mb-2"
              >
                หมวดหมู่ *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 marketplace-contact-input rounded-lg marketplace-input"
              >
                {viewModel.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium marketplace-text-primary mb-2"
              >
                หัวข้อ *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 marketplace-contact-input rounded-lg marketplace-input"
                placeholder="กรอกหัวข้อ"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium marketplace-text-primary mb-2"
              >
                ข้อความ *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 marketplace-contact-input rounded-lg marketplace-input resize-none"
                placeholder="กรอกข้อความที่ต้องการสอบถาม"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full marketplace-button-primary px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  ส่งข้อความ
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* Address & Contact */}
          <div className="marketplace-card p-8">
            <h3 className="text-2xl font-bold marketplace-text-primary mb-6">
              ข้อมูลติดต่อ
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 marketplace-contact-icon mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold marketplace-text-primary mb-1">
                    ที่อยู่
                  </h4>
                  <p className="marketplace-text-secondary">
                    {viewModel.contactInfo.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 marketplace-contact-icon mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold marketplace-text-primary mb-1">
                    โทรศัพท์
                  </h4>
                  <a
                    href={`tel:${viewModel.contactInfo.phone}`}
                    className="marketplace-text-secondary marketplace-contact-link-hover transition-colors"
                  >
                    {viewModel.contactInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 marketplace-contact-icon mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold marketplace-text-primary mb-1">
                    อีเมล
                  </h4>
                  <a
                    href={`mailto:${viewModel.contactInfo.email}`}
                    className="marketplace-text-secondary marketplace-contact-link-hover transition-colors"
                  >
                    {viewModel.contactInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="marketplace-card p-8">
            <h3 className="text-xl font-bold marketplace-text-primary mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2" />
              เวลาทำการ
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="marketplace-text-secondary">
                  จันทร์ - ศุกร์
                </span>
                <span className="marketplace-text-primary font-medium">
                  09:00 - 18:00 น.
                </span>
              </div>
              <div className="flex justify-between">
                <span className="marketplace-text-secondary">
                  เสาร์ - อาทิตย์
                </span>
                <span className="marketplace-text-primary font-medium">
                  10:00 - 16:00 น.
                </span>
              </div>
              <div className="flex justify-between">
                <span className="marketplace-text-secondary">
                  วันหยุดนักขัตฤกษ์
                </span>
                <span className="marketplace-text-primary font-medium">
                  ปิดทำการ
                </span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          {Object.keys(viewModel.contactInfo.socialMedia).length > 0 && (
            <div className="marketplace-card p-8">
              <h3 className="text-xl font-bold marketplace-text-primary mb-4">
                ติดตามเรา
              </h3>

              <div className="flex space-x-4">
                {viewModel.contactInfo.socialMedia.facebook && (
                  <a
                    href={viewModel.contactInfo.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 marketplace-social-facebook rounded-full flex items-center justify-center transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {viewModel.contactInfo.socialMedia.twitter && (
                  <a
                    href={viewModel.contactInfo.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 marketplace-social-twitter rounded-full flex items-center justify-center transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {viewModel.contactInfo.socialMedia.instagram && (
                  <a
                    href={viewModel.contactInfo.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 marketplace-social-instagram rounded-full flex items-center justify-center transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {viewModel.contactInfo.socialMedia.linkedin && (
                  <a
                    href={viewModel.contactInfo.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 marketplace-social-linkedin rounded-full flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {viewModel.contactInfo.socialMedia.youtube && (
                  <a
                    href={viewModel.contactInfo.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 marketplace-social-youtube rounded-full flex items-center justify-center transition-colors"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      {viewModel.faqs.length > 0 && (
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold marketplace-text-primary mb-4">
              คำถามที่พบบ่อย
            </h2>
            <p className="marketplace-text-secondary">
              คำตอบสำหรับคำถามที่ลูกค้าถามบ่อยที่สุด
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setSelectedFAQCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFAQCategory === "all"
                  ? "marketplace-faq-category-active"
                  : "marketplace-faq-category-inactive"
              }`}
            >
              ทั้งหมด
            </button>
            {Array.from(new Set(viewModel.faqs.map((faq) => faq.category))).map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setSelectedFAQCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFAQCategory === category
                      ? "marketplace-faq-category-active"
                      : "marketplace-faq-category-inactive"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="marketplace-card">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between marketplace-faq-hover transition-colors"
                >
                  <h3 className="font-semibold marketplace-text-primary pr-4">
                    {faq.question}
                  </h3>
                  {expandedFAQ === faq.id ? (
                    <Clock className="h-6 w-6 marketplace-contact-icon mt-1 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 marketplace-faq-chevron flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-6">
                    <div className="border-t marketplace-faq-border pt-4">
                      <p className="marketplace-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="marketplace-card p-8 text-center marketplace-cta-bg">
        <h2 className="text-2xl font-bold marketplace-text-primary mb-4">
          ยังไม่พบคำตอบที่ต้องการ?
        </h2>
        <p className="marketplace-text-secondary mb-6">
          ทีมงานของเรายินดีให้คำปรึกษาและช่วยเหลือคุณ
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`tel:${viewModel.contactInfo.phone}`}
            className="marketplace-button-primary px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            <Phone className="h-5 w-5 mr-2" />
            โทรหาเรา
          </a>
          <Link
            href="/shop"
            className="marketplace-button-secondary px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            เริ่มใช้งาน
          </Link>
        </div>
      </section>
    </div>
  );
}
