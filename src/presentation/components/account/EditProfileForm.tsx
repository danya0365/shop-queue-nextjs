'use client';

import { ProfileDto, UpdateProfileInputDto } from '@/src/application/dtos/profile-dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const updateProfileSchema = z.object({
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

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

interface EditProfileFormProps {
  profile: ProfileDto;
  onSubmit: (profileId: string, data: UpdateProfileInputDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function EditProfileForm({ 
  profile, 
  onSubmit, 
  onCancel, 
  loading = false 
}: EditProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: profile.username,
      name: profile.name,
      bio: profile.bio || '',
    }
  });

  const handleFormSubmit = async (data: UpdateProfileFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(profile.id, {
        username: data.username,
        name: data.name,
        bio: data.bio || undefined,
      });
    } catch (error) {
      // Error handling is done in parent component
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          แก้ไขโปรไฟล์
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

        {/* Profile Info */}
        <div className="bg-muted-light rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">ข้อมูลโปรไฟล์</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted">บทบาท:</span>
              <p className="text-foreground">
                {profile.role === 'admin' ? 'ผู้ดูแลระบบ' : 
                 profile.role === 'moderator' ? 'ผู้ดูแล' : 'ผู้ใช้งาน'}
              </p>
            </div>
            <div>
              <span className="text-muted">สถานะ:</span>
              <p className="text-foreground">
                {profile.isActive ? 'ใช้งานอยู่' : 'ไม่ได้ใช้งาน'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
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
