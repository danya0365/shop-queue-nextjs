import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define search data interface
export interface SearchData {
  query: string;
}

// Define contact form data interface
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Define state interface
export interface HelpPresenterState {
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  isContactFormSubmitted: boolean;
  expandedFAQ: string | null;
}

// Define actions interface
export interface HelpPresenterActions {
  searchFAQ: (data: SearchData) => void;
  submitContactForm: (data: ContactFormData) => Promise<boolean>;
  toggleFAQ: (faqId: string) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type HelpPresenterHook = [
  HelpPresenterState,
  HelpPresenterActions
];

// Custom hook implementation
export const useHelpPresenter = (): HelpPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isContactFormSubmitted, setIsContactFormSubmitted] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const logger = getClientService<Logger>('Logger');

  const searchFAQ = (data: SearchData): void => {
    try {
      setSearchQuery(data.query);
      logger.info('HelpPresenter: FAQ search performed', { query: data.query });
    } catch (error) {
      logger.error('HelpPresenter: Error in FAQ search', error);
      setError('เกิดข้อผิดพลาดในการค้นหา');
    }
  };

  const submitContactForm = async (data: ContactFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.name.trim()) {
        throw new Error('กรุณาระบุชื่อ');
      }
      if (!data.email.trim()) {
        throw new Error('กรุณาระบุอีเมล');
      }
      if (!data.subject.trim()) {
        throw new Error('กรุณาระบุหัวข้อ');
      }
      if (!data.message.trim()) {
        throw new Error('กรุณาระบุข้อความ');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('รูปแบบอีเมลไม่ถูกต้อง');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsContactFormSubmitted(true);
      logger.info('HelpPresenter: Contact form submitted successfully', { 
        name: data.name, 
        email: data.email,
        subject: data.subject 
      });
      return true;
    } catch (error) {
      logger.error('HelpPresenter: Error submitting contact form', error);
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการส่งข้อความ';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFAQ = (faqId: string): void => {
    try {
      setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
      logger.info('HelpPresenter: FAQ toggled', { faqId });
    } catch (error) {
      logger.error('HelpPresenter: Error toggling FAQ', error);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSearchQuery('');
    setIsContactFormSubmitted(false);
    setExpandedFAQ(null);
    logger.info('HelpPresenter: Reset');
  };

  return [
    { 
      isLoading, 
      error, 
      searchQuery, 
      isContactFormSubmitted, 
      expandedFAQ 
    },
    { 
      searchFAQ, 
      submitContactForm, 
      toggleFAQ, 
      reset, 
      setError 
    },
  ];
};
