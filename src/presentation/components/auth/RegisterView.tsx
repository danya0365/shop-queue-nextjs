"use client";

import Image from "next/image";
import RegisterForm from "./RegisterForm";

interface RegisterViewProps {
  redirectPath?: string;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ redirectPath }) => {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:block w-1/2 bg-primary relative">
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                ยินดีต้อนรับสู่ระบบจัดการคิว
              </h2>
              <p className="text-white/90 mb-6">
                เข้าร่วมกับเราเพื่อจัดการคิวของร้านคุณอย่างมีประสิทธิภาพ
                ช่วยให้ลูกค้าของคุณได้รับประสบการณ์ที่ดีที่สุด
              </p>
              <div className="relative h-64 w-full">
                <Image
                  src="/images/queue-illustration.svg"
                  alt="Queue Management Illustration"
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
              <RegisterForm redirectPath={redirectPath} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
