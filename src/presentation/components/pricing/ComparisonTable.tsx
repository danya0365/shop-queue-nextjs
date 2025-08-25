'use client';

import { PricingComparisonDto } from '@/src/application/dtos/pricing-dto';
import React from 'react';

interface ComparisonTableProps {
  comparison: PricingComparisonDto;
}

export function ComparisonTable({ comparison }: ComparisonTableProps) {
  const renderFeatureValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <svg className="w-5 h-5 text-success mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-muted mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
    return <span className="text-sm text-foreground">{value}</span>;
  };

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-muted-light">
            <tr>
              <th className="text-left p-6 text-foreground font-semibold">ฟีเจอร์</th>
              {comparison.plans.map((plan) => (
                <th key={plan.id} className="text-center p-6 min-w-[120px]">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-foreground mb-1">{plan.name}</span>
                    <span className="text-sm text-muted">
                      {plan.price === 0 ? 'ฟรี' : `฿${plan.price}/เดือน`}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {comparison.comparisonFeatures.map((category, categoryIndex) => (
              <React.Fragment key={categoryIndex}>
                {/* Category Header */}
                <tr className="bg-muted-light/50">
                  <td colSpan={comparison.plans.length + 1} className="p-4">
                    <h4 className="font-semibold text-foreground">{category.category}</h4>
                  </td>
                </tr>

                {/* Category Features */}
                {category.features.map((feature, featureIndex) => (
                  <tr key={featureIndex} className="border-t border-border hover:bg-muted-light/30">
                    <td className="p-4 text-foreground">{feature.name}</td>
                    <td className="p-4 text-center">{renderFeatureValue(feature.free)}</td>
                    <td className="p-4 text-center">{renderFeatureValue(feature.pro)}</td>
                    <td className="p-4 text-center">{renderFeatureValue(feature.enterprise)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
