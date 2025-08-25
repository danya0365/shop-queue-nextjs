'use client';

import { TestimonialDto } from '@/src/application/dtos/features-dto';
import { cn } from '../../utils/tailwind';

interface TestimonialCardProps {
  testimonial: TestimonialDto;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={cn(`w-5 h-5`, {
          'text-yellow-400': index < rating,
          'text-gray-300': index >= rating,
        })}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-8 hover:shadow-lg transition-all duration-300">
      {/* Rating */}
      <div className="flex items-center mb-4">
        {renderStars(testimonial.rating)}
      </div>

      {/* Comment */}
      <blockquote className="text-foreground mb-6 leading-relaxed">
        &quot;{testimonial.comment}&quot;
      </blockquote>

      {/* Feature Tag */}
      <div className="mb-6">
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {testimonial.feature}
        </span>
      </div>

      {/* Author */}
      <div className="flex items-center">
        <div className="w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold mr-4">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-foreground">{testimonial.name}</div>
          <div className="text-muted text-sm">{testimonial.business}</div>
        </div>
      </div>
    </div>
  );
}
