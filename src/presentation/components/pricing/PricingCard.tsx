'use client';

import { PricingPlanDto } from '@/src/application/dtos/pricing-dto';
import Link from 'next/link';

interface PricingCardProps {
  plan: PricingPlanDto;
  isAnnual?: boolean;
}

export function PricingCard({ plan, isAnnual = false }: PricingCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return 'ฟรี';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCardClasses = () => {
    const baseClasses = 'relative bg-surface rounded-2xl border transition-all duration-300 hover:shadow-lg';

    if (plan.isPopular) {
      return `${baseClasses} border-primary shadow-md transform hover:scale-105`;
    }

    return `${baseClasses} border-border hover:border-primary`;
  };

  const getButtonClasses = () => {
    if (plan.type === 'free') {
      return 'w-full border border-border bg-surface text-primary hover:bg-primary-dark border border-primary';
    }

    if (plan.isPopular) {
      return 'w-full bg-primary text-white hover:bg-primary-dark';
    }

    return 'w-full bg-foreground text-background hover:bg-muted-dark';
  };

  return (
    <div className={getCardClasses()}>
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
            แนะนำ
          </span>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
          <p className="text-muted mb-4">{plan.description}</p>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-foreground">
                {formatPrice(plan.price)}
              </span>
              {plan.price > 0 && (
                <span className="text-muted ml-2">/เดือน</span>
              )}
            </div>

            {isAnnual && plan.price > 0 && (
              <div className="mt-2">
                <span className="text-sm text-success">
                  ประหยัด {formatPrice(plan.price * 2)} เมื่อจ่ายรายปี
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-foreground text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href={plan.type === 'enterprise' ? '/contact' : '/getting-started'}
            className={`${getButtonClasses()} px-6 py-3 rounded-lg font-medium transition-colors inline-block`}
          >
            {plan.buttonText}
          </Link>
        </div>

        {/* Additional Info */}
        {plan.type === 'free' && (
          <p className="text-xs text-muted text-center mt-4">
            ไม่ต้องใช้บัตรเครดิต
          </p>
        )}

        {plan.type === 'enterprise' && (
          <p className="text-xs text-muted text-center mt-4">
            ราคาพิเศษสำหรับการใช้งานจำนวนมาก
          </p>
        )}
      </div>
    </div>
  );
}
