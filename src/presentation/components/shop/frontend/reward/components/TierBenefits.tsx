"use client";

import { useCustomerStore } from "@/src/presentation/stores/customer-store";
import { cn } from "@/src/utils/cn";

interface TierBenefitsProps {
  tier: string;
  benefits: string[];
  shopId: string;
  className?: string;
}

export function TierBenefits({
  tier,
  benefits,
  shopId,
  className,
}: TierBenefitsProps) {
  const { getCustomer } = useCustomerStore();
  const customer = getCustomer(shopId);

  if (!customer) {
    return (
      <div className={cn("shop-frontend-card p-6 relative", className)}>
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="text-center py-8 z-10">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-gray-600 dark:text-gray-400">
              ไม่พบข้อมูลสมาชิก
            </p>
          </div>
        </div>
        <h3 className="text-lg font-medium shop-frontend-text-primary mb-4">
          สิทธิประโยชน์สมาชิก {tier}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center">
              <span className="shop-frontend-text-success mr-2">✓</span>
              <span className="shop-frontend-text-primary">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("shop-frontend-card p-6", className)}>
      <h3 className="text-lg font-medium shop-frontend-text-primary mb-4">
        สิทธิประโยชน์สมาชิก {tier}
      </h3>
      {benefits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center">
              <span className="shop-frontend-text-success mr-2">✓</span>
              <span className="shop-frontend-text-primary">{benefit}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
            ไม่พบสิทธิประโยชน์สำหรับระดับสมาชิกนี้
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            สิทธิประโยชน์จะแสดงที่นี่เมื่อมีกำหนดการสำหรับระดับ {tier}
          </p>
        </div>
      )}
    </div>
  );
}
