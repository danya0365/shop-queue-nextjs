'use client';

import { FeatureDto } from '@/src/application/dtos/features-dto';
import { useState } from 'react';
import { cn } from '../../utils/tailwind';

interface FeatureCardProps {
  feature: FeatureDto;
  variant?: 'default' | 'compact' | 'detailed';
}

export function FeatureCard({ feature, variant = 'default' }: FeatureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      brain: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      qr_code: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
      refresh: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      chart_bar: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      currency_dollar: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      chat_bubble_left_right: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      chat_bubble_bottom_center_text: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      user_group: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gift: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      )
    };

    return iconMap[iconName] || (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={cn('feature-card-compact', feature.isPopular && 'feature-card-popular', feature.isPremium && 'feature-card-premium')}>
        <div className="flex items-start space-x-4">
          <div className="feature-icon-compact">
            {getIcon(feature.icon)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="feature-title-compact">{feature.title}</h3>
              {feature.isPopular && (
                <span className="feature-badge-popular-small">
                  ยอดนิยม
                </span>
              )}
              {feature.isPremium && (
                <span className="feature-badge-premium-small">
                  Premium
                </span>
              )}
            </div>
            <p className="feature-description-compact">{feature.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('feature-card-base relative', feature.isPopular && 'feature-card-popular', feature.isPremium && 'feature-card-premium')}>
      {/* Badges Container */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Popular Badge */}
        {feature.isPopular && (
          <span className="feature-badge-popular">
            ยอดนิยม
          </span>
        )}

        {/* Premium Badge */}
        {feature.isPremium && (
          <span className="feature-badge-premium">
            Premium
          </span>
        )}
      </div>

      {/* Icon */}
      <div className="feature-icon">
        {getIcon(feature.icon)}
      </div>

      {/* Content */}
      <div className="mb-6">
        <h3 className="feature-title">{feature.title}</h3>
        <p className="feature-description">{feature.description}</p>

        {variant === 'detailed' && (
          <div className="space-y-4">
            <p className="feature-long-description">
              {feature.longDescription}
            </p>

            {/* Benefits */}
            {feature.benefits.length > 0 && (
              <div className="feature-benefits-container">
                <h4 className="feature-benefits-title">ประโยชน์ที่ได้รับ:</h4>
                <div className="feature-benefits-list">
                  {feature.benefits.map((benefit, index) => (
                    <div key={index} className="feature-benefit-item">
                      <div className="feature-benefit-icon">
                        <svg className="w-3 h-3 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="feature-benefit-title">{benefit.title}</p>
                        <p className="feature-benefit-description">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expand Button for Default Variant */}
      {variant === 'default' && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="feature-expand-button"
        >
          {isExpanded ? 'ดูน้อยลง' : 'ดูรายละเอียด'}
        </button>
      )}

      {/* Expanded Content */}
      {variant === 'default' && isExpanded && (
        <div className="feature-expanded-content">
          <p className="feature-long-description">
            {feature.longDescription}
          </p>

          {feature.benefits.length > 0 && (
            <div className="feature-benefits-container">
              <h4 className="feature-benefits-title">ประโยชน์ที่ได้รับ:</h4>
              <div className="feature-benefits-list">
                {feature.benefits.map((benefit, index) => (
                  <div key={index} className="feature-benefit-item">
                    <div className="feature-benefit-icon">
                      <svg className="w-3 h-3 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="feature-benefit-title">{benefit.title}</p>
                      <p className="feature-benefit-description">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
