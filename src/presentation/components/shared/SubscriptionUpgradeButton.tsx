'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PaymentModal } from '../pricing/PaymentModal';
import type { PricingPlanDto } from '@/src/application/dtos/pricing-dto';

interface SubscriptionUpgradeButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  children?: React.ReactNode;
  targetPlan?: 'pro' | 'enterprise';
  currentPlan?: string;
  showModal?: boolean;
}

export function SubscriptionUpgradeButton({
  size = 'md',
  variant = 'primary',
  className = '',
  children,
  targetPlan = 'pro',
  currentPlan,
  showModal = false
}: SubscriptionUpgradeButtonProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700';
      case 'outline':
        return 'border border-blue-600 text-blue-600 hover:bg-blue-50';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  const baseClasses = 'inline-flex items-center font-medium rounded-lg transition-colors';
  const buttonClasses = `${baseClasses} ${getSizeClasses()} ${getVariantClasses()} ${className}`;

  const defaultText = targetPlan === 'enterprise' ? 'อัปเกรดเป็น Enterprise' : 'อัปเกรดเป็น Pro';

  // Mock plan data - in real app, this would come from a service
  const mockPlan: PricingPlanDto = {
    id: targetPlan,
    name: targetPlan === 'enterprise' ? 'Enterprise' : 'Pro',
    nameEn: targetPlan === 'enterprise' ? 'Enterprise' : 'Pro',
    description: targetPlan === 'enterprise' ? 'สำหรับธุรกิจขนาดใหญ่' : 'สำหรับธุรกิจที่กำลังเติบโต',
    descriptionEn: targetPlan === 'enterprise' ? 'For large businesses' : 'For growing businesses',
    price: targetPlan === 'enterprise' ? 2999 : 999,
    currency: 'THB',
    billingPeriod: 'monthly',
    type: targetPlan,
    features: [],
    featuresEn: [],
    limits: {
      maxShops: targetPlan === 'enterprise' ? null : 10,
      maxQueuesPerDay: targetPlan === 'enterprise' ? null : 1000,
      maxStaff: targetPlan === 'enterprise' ? null : 50,
      dataRetentionMonths: targetPlan === 'enterprise' ? null : 12,
      maxSmsPerMonth: targetPlan === 'enterprise' ? null : 1000,
      maxPromotions: targetPlan === 'enterprise' ? null : 10,
      hasAdvancedReports: true,
      hasCustomQrCode: true,
      hasApiAccess: targetPlan === 'enterprise',
      hasPrioritySupport: targetPlan === 'enterprise',
      hasCustomBranding: targetPlan === 'enterprise',
    },
    isPopular: targetPlan === 'pro',
    isRecommended: targetPlan === 'pro',
    buttonText: defaultText,
    buttonTextEn: defaultText,
  };

  if (showModal) {
    return (
      <>
        <button
          onClick={() => setShowPaymentModal(true)}
          className={buttonClasses}
        >
          {children || defaultText}
        </button>
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plan={mockPlan}
          isAnnual={false}
          currentPlan={currentPlan}
        />
      </>
    );
  }

  return (
    <Link
      href="/pricing"
      className={buttonClasses}
    >
      {children || defaultText}
    </Link>
  );
}
