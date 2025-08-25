import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define form/action data interfaces
export interface NewsletterSubscribeData {
  email: string;
}

// Define state interface
export interface LandingPresenterState {
  isLoading: boolean;
  error: string | null;
  isSubscribed: boolean;
}

// Define actions interface
export interface LandingPresenterActions {
  subscribeNewsletter: (data: NewsletterSubscribeData) => Promise<boolean>;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type LandingPresenterHook = [
  LandingPresenterState,
  LandingPresenterActions
];

// Custom hook implementation
export const useLandingPresenter = (): LandingPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const logger = getClientService<Logger>('Logger');

  const subscribeNewsletter = async (data: NewsletterSubscribeData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.email || !data.email.includes('@')) {
        setError('กรุณากรอกอีเมลที่ถูกต้อง');
        return false;
      }

      // Simulate API call for newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      logger.info('LandingPresenter: Newsletter subscription completed successfully');
      return true;
    } catch (error) {
      logger.error('LandingPresenter: Error in newsletter subscription', error);
      setError('เกิดข้อผิดพลาดในการสมัครรับข่าวสาร');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setIsSubscribed(false);
    logger.info('LandingPresenter: Reset');
  };

  return [
    { isLoading, error, isSubscribed },
    { subscribeNewsletter, reset, setError },
  ];
};
