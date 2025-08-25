import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define progress tracking data
export interface ProgressData {
  completedSteps: number[];
  currentSection: number;
}

// Define state interface
export interface GettingStartedPresenterState {
  isLoading: boolean;
  error: string | null;
  completedSteps: number[];
  currentSection: number;
  showQuickStart: boolean;
}

// Define actions interface
export interface GettingStartedPresenterActions {
  markStepComplete: (stepId: number) => void;
  markStepIncomplete: (stepId: number) => void;
  setCurrentSection: (sectionIndex: number) => void;
  toggleQuickStart: () => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type GettingStartedPresenterHook = [
  GettingStartedPresenterState,
  GettingStartedPresenterActions
];

// Custom hook implementation
export const useGettingStartedPresenter = (): GettingStartedPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentSection, setCurrentSectionState] = useState(0);
  const [showQuickStart, setShowQuickStart] = useState(true);
  const logger = getClientService<Logger>('Logger');

  const markStepComplete = (stepId: number): void => {
    try {
      setCompletedSteps(prev => {
        if (!prev.includes(stepId)) {
          const updated = [...prev, stepId];
          logger.info('GettingStartedPresenter: Step marked complete', { stepId, totalCompleted: updated.length });
          return updated;
        }
        return prev;
      });
    } catch (error) {
      logger.error('GettingStartedPresenter: Error marking step complete', error);
      setError('ไม่สามารถบันทึกความคืบหน้าได้');
    }
  };

  const markStepIncomplete = (stepId: number): void => {
    try {
      setCompletedSteps(prev => {
        const updated = prev.filter(id => id !== stepId);
        logger.info('GettingStartedPresenter: Step marked incomplete', { stepId, totalCompleted: updated.length });
        return updated;
      });
    } catch (error) {
      logger.error('GettingStartedPresenter: Error marking step incomplete', error);
      setError('ไม่สามารถบันทึกความคืบหน้าได้');
    }
  };

  const setCurrentSection = (sectionIndex: number): void => {
    try {
      setCurrentSectionState(sectionIndex);
      logger.info('GettingStartedPresenter: Section changed', { sectionIndex });
    } catch (error) {
      logger.error('GettingStartedPresenter: Error setting current section', error);
    }
  };

  const toggleQuickStart = (): void => {
    try {
      setShowQuickStart(prev => {
        const newValue = !prev;
        logger.info('GettingStartedPresenter: Quick start toggled', { showQuickStart: newValue });
        return newValue;
      });
    } catch (error) {
      logger.error('GettingStartedPresenter: Error toggling quick start', error);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setCompletedSteps([]);
    setCurrentSectionState(0);
    setShowQuickStart(true);
    logger.info('GettingStartedPresenter: Reset');
  };

  return [
    { 
      isLoading, 
      error, 
      completedSteps, 
      currentSection, 
      showQuickStart 
    },
    { 
      markStepComplete, 
      markStepIncomplete, 
      setCurrentSection, 
      toggleQuickStart, 
      reset, 
      setError 
    },
  ];
};
