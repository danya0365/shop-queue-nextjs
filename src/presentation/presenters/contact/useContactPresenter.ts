import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

/**
 * Contact form data interface
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  business_type: string;
  subject: string;
  message: string;
}

/**
 * Contact presenter state interface
 */
export interface ContactPresenterState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  success: string | null;
}

/**
 * Contact presenter actions interface
 */
export interface ContactPresenterActions {
  submitForm: (data: ContactFormData) => Promise<boolean>;
  resetForm: () => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

/**
 * Contact presenter hook type
 */
export type ContactPresenterHook = [
  ContactPresenterState,
  ContactPresenterActions
];

/**
 * Custom hook for contact form logic
 * Handles form submission and state management
 */
export const useContactPresenter = (): ContactPresenterHook => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const logger = getClientService<Logger>('Logger');

  const submitForm = async (data: ContactFormData): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      logger.info('ContactPresenter: Submitting contact form', { 
        email: data.email, 
        subject: data.subject 
      });

      // Validate required fields
      if (!data.name.trim()) {
        setError('กรุณากรอกชื่อ-นามสกุล');
        setIsSubmitting(false);
        return false;
      }

      if (!data.email.trim()) {
        setError('กรุณากรอกอีเมล');
        setIsSubmitting(false);
        return false;
      }

      if (!data.business_type) {
        setError('กรุณาเลือกประเภทธุรกิจ');
        setIsSubmitting(false);
        return false;
      }

      if (!data.subject) {
        setError('กรุณาเลือกหัวข้อ');
        setIsSubmitting(false);
        return false;
      }

      if (!data.message.trim()) {
        setError('กรุณากรอกข้อความ');
        setIsSubmitting(false);
        return false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        setError('รูปแบบอีเมลไม่ถูกต้อง');
        setIsSubmitting(false);
        return false;
      }

      // Phone validation (if provided)
      if (data.phone && data.phone.trim()) {
        const phoneRegex = /^[0-9\-\s\+\(\)]{8,15}$/;
        if (!phoneRegex.test(data.phone.trim())) {
          setError('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
          setIsSubmitting(false);
          return false;
        }
      }

      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.1; // 90% success rate

      if (!isSuccess) {
        throw new Error('เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง');
      }

      logger.info('ContactPresenter: Form submitted successfully');
      
      setIsSubmitted(true);
      setSuccess('ส่งข้อความเรียบร้อยแล้ว! เราจะติดต่อกลับภายใน 24 ชั่วโมง');
      
      return true;
    } catch (error) {
      logger.error('ContactPresenter: Error submitting form', error);
      
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
      }
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitting(false);
    setIsSubmitted(false);
    setError(null);
    setSuccess(null);
    logger.info('ContactPresenter: Form reset');
  };

  return [
    { 
      isSubmitting, 
      isSubmitted, 
      error, 
      success 
    },
    { 
      submitForm, 
      resetForm, 
      setError, 
      setSuccess 
    },
  ];
};
