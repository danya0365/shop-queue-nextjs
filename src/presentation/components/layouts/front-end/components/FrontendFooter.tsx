"use client";

import Link from "next/link";
import Image from "next/image";

export function FrontendFooter() {
  return (
    <footer className="footer-bg footer-border border-t py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Image 
                src="/logo.png" 
                alt="Shop Queue" 
                width={40} 
                height={40} 
                className="h-10 w-auto" 
              />
              <span className="ml-3 text-xl font-bold text-foreground">Shop Queue</span>
            </div>
            <p className="text-muted text-sm mb-4">
              ระบบจัดการคิวร้านค้าอัจฉริยะที่ช่วยให้ธุรกิจของคุณบริการลูกค้าได้อย่างมีประสิทธิภาพ
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted hover:text-primary" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-muted hover:text-primary" aria-label="Instagram">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
              <a href="#" className="text-muted hover:text-primary" aria-label="Line">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .345-.281.63-.63.63h-2.386c-.345 0-.627-.285-.627-.63V10.123c0-.345.282-.63.63-.63h2.386zm-10.5 0c.35 0 .63.285.63.631v3.139c0 .345-.28.63-.63.63-.349 0-.63-.285-.63-.63v-3.139c0-.346.281-.63.63-.63zm-2.625 0c.349 0 .63.285.63.631v3.139c0 .345-.281.63-.63.63-.346 0-.627-.285-.627-.63V12.61H3.982v1.125c0 .345-.282.63-.631.63-.345 0-.626-.285-.626-.63v-3.14c0-.345.281-.63.626-.63.349 0 .631.285.631.63V11.38h1.756V10.12c0-.345.28-.63.627-.63zM12 0C5.373 0 0 4.75 0 10.607c0 5.25 3.88 9.675 9.135 10.402.356.082.815.207.935.476.106.25.07.618.035.863l-.142.85c-.049.28-.232 1.106.956.603 1.19-.505 6.305-3.574 8.536-6.16C21.75 14.729 24 11.88 24 10.607 24 4.751 18.627 0 12 0zm1.998 6.642c.282 0 .512.23.512.513v1.636c0 .282-.23.512-.512.512a.513.513 0 01-.513-.512V7.155c0-.283.231-.513.513-.513z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">ลิงก์ด่วน</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="nav-link">
                  หน้าหลัก
                </Link>
              </li>
              <li>
                <Link href="/features" className="nav-link">
                  ฟีเจอร์
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="nav-link">
                  ราคา
                </Link>
              </li>
              <li>
                <Link href="/contact" className="nav-link">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">ทรัพยากร</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="nav-link">
                  บล็อก
                </Link>
              </li>
              <li>
                <Link href="/help" className="nav-link">
                  ศูนย์ช่วยเหลือ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="nav-link">
                  คำถามที่พบบ่อย
                </Link>
              </li>
              <li>
                <Link href="/docs" className="nav-link">
                  เอกสาร API
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">ข้อกฎหมาย</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="nav-link">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
              <li>
                <Link href="/terms" className="nav-link">
                  เงื่อนไขการใช้งาน
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="nav-link">
                  นโยบายคุกกี้
                </Link>
              </li>
              <li>
                <Link href="/licenses" className="nav-link">
                  ใบอนุญาต
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted text-sm">
            &copy; {new Date().getFullYear()} Shop Queue. สงวนลิขสิทธิ์.
          </p>
        </div>
      </div>
    </footer>
  );
}
