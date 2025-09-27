"use client";

import Link from "next/link";
import React from "react";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart
} from "lucide-react";

const MarketplaceFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: "เกี่ยวกับเรา", href: "/about" },
      { label: "ข่าวสาร", href: "/news" },
      { label: "ร่วมงานกับเรา", href: "/careers" },
      { label: "นักลงทุนสัมพันธ์", href: "/investors" },
    ],
    support: [
      { label: "ศูนย์ช่วยเหลือ", href: "/help" },
      { label: "ติดต่อเรา", href: "/contact" },
      { label: "คำถามที่พบบ่อย", href: "/faq" },
      { label: "รายงานปัญหา", href: "/report" },
    ],
    business: [
      { label: "สำหรับร้านค้า", href: "/business" },
      { label: "ลงทะเบียนร้านค้า", href: "/register-shop" },
      { label: "แผนการใช้งาน", href: "/pricing" },
      { label: "API สำหรับนักพัฒนา", href: "/developers" },
    ],
    legal: [
      { label: "ข้อกำหนดการใช้งาน", href: "/terms" },
      { label: "นโยบายความเป็นส่วนตัว", href: "/privacy" },
      { label: "นโยบายคุกกี้", href: "/cookies" },
      { label: "ข้อกำหนดร้านค้า", href: "/merchant-terms" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/shopqueue", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/shopqueue", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/shopqueue", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/shopqueue", label: "YouTube" },
  ];

  return (
    <footer className="marketplace-footer-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Shop Queue</h3>
                <p className="marketplace-footer-text text-sm leading-relaxed">
                  ระบบจัดการคิวอัจฉริยะที่ช่วยให้ร้านค้าและลูกค้าสามารถจัดการคิวได้อย่างมีประสิทธิภาพ 
                  ลดเวลารอคอย และเพิ่มความสะดวกสบายในการใช้บริการ
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 marketplace-footer-text" />
                  <span className="marketplace-footer-text text-sm">support@shopqueue.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 marketplace-footer-text" />
                  <span className="marketplace-footer-text text-sm">02-123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 marketplace-footer-text" />
                  <span className="marketplace-footer-text text-sm">กรุงเทพมหานคร, ประเทศไทย</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 marketplace-footer-text" />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">บริษัท</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="marketplace-footer-link text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">ช่วยเหลือ</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="marketplace-footer-link text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">ธุรกิจ</h4>
              <ul className="space-y-3">
                {footerLinks.business.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="marketplace-footer-link text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2">
              <span className="marketplace-footer-text-muted text-sm">
                © {currentYear} Shop Queue. สงวนลิขสิทธิ์ทุกประการ
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-6">
              {footerLinks.legal.map((link, index) => (
                <React.Fragment key={link.href}>
                  <Link
                    href={link.href}
                    className="marketplace-footer-link text-sm"
                  >
                    {link.label}
                  </Link>
                  {index < footerLinks.legal.length - 1 && (
                    <span className="marketplace-footer-text-muted">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Made with Love */}
            <div className="flex items-center space-x-2">
              <span className="marketplace-footer-text-muted text-sm">
                สร้างด้วย
              </span>
              <Heart className="w-4 h-4 text-red-500" />
              <span className="marketplace-footer-text-muted text-sm">
                ในประเทศไทย
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MarketplaceFooter;
