'use client';

import { CreateProfileInputDto } from '@/src/application/dtos/profile-dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const createProfileSchema = z.object({
  username: z.string()
    .min(3, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร')
    .max(20, 'ชื่อผู้ใช้ต้องไม่เกิน 20 ตัวอักษร')
    .regex(/^[a-zA-Z0-9_]+$/, 'ชื่อผู้ใช้ใช้ได้เฉพาะตัวอักษร ตัวเลข และ _'),
  name: z.string()
    .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(50, 'ชื่อต้องไม่เกิน 50 ตัวอักษร'),
  bio: z.string()
    .max(200, 'แนะนำตัวต้องไม่เกิน 200 ตัวอักษร')
    .optional(),
});

type CreateProfileFormData = z.infer<typeof createProfileSchema>;

interface CreateProfileFormProps {
  authId: string;
  onSubmit: (data: CreateProfileInputDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function CreateProfileForm({ 
  authId, 
  onSubmit, 
  onCancel, 
  loading = false 
}: CreateProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateProfileFormData>({
    resolver: zodResolver(createProfileSchema)
  });

  const handleFormSubmit = async (data: CreateProfileFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        authId,
        username: data.username,
        name: data.name,
        bio: data.bio || undefined,
        isActive: false // ให้ผู้ใช้เลือกเปลี่ยนเป็นโปรไฟล์หลักทีหลัง
      });
      reset();
    } catch (error) {
      // Error handling is done in parent component
      console.error("Error creating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          สร้างโปรไฟล์ใหม่
        </h3>
        <button
          onClick={onCancel}
          className="text-muted hover:text-foreground transition-colors"
          disabled={isSubmitting || loading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
            ชื่อผู้ใช้ *
          </label>
          <input
            {...register('username')}
            type="text"
            id="username"
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground
              ${errors.username ? 'border-error' : 'border-border'}
            `}
            placeholder="ชื่อผู้ใช้ของคุณ"
            disabled={isSubmitting || loading}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-error">{errors.username.message}</p>
          )}
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
            ชื่อที่แสดง *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground
              ${errors.name ? 'border-error' : 'border-border'}
            `}
            placeholder="ชื่อที่จะแสดงในระบบ"
            disabled={isSubmitting || loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error">{errors.name.message}</p>
          )}
        </div>

        {/* Bio Field */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1">
            แนะนำตัว
          </label>
          <textarea
            {...register('bio')}
            id="bio"
            rows={3}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none bg-background text-foreground
              ${errors.bio ? 'border-error' : 'border-border'}
            `}
            placeholder="เล่าเกี่ยวกับตัวคุณ (ไม่บังคับ)"
            disabled={isSubmitting || loading}
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-error">{errors.bio.message}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'กำลังสร้าง...' : 'สร้างโปรไฟล์'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting || loading}
            className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}
