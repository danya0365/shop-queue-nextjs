"use client";

import Image from "next/image";
import CustomerLoginForm from "./CustomerLoginForm";

export const CustomerLoginView: React.FC = () => {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10 mx-auto">
      <div className="flex w-full max-w-5xl border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="hidden md:block w-1/2 bg-primary relative">
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-hero-card-text mb-4">
                ยินดีต้อนรับกลับ
              </h2>
              <p className="text-hero-card-text mb-6">
                เข้าสู่ระบบเพื่อจองคิวและรับบริการจากร้านค้า
                ช่วยให้คุณไม่ต้องรอนานอีกต่อไป
              </p>
              <div className="relative h-64 w-full">
                <Image
                  src="/images/queue-illustration.svg"
                  alt="Queue Booking Illustration"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-background p-6">
          <div className="border-0 shadow-none">
            <div className="pt-6">
              <CustomerLoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLoginView;
