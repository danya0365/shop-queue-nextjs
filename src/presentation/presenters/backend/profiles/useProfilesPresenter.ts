import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define form/action data interfaces
export interface ProfileActionData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  bio?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
}

// Define state interface
export interface ProfilesPresenterState {
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  verificationFilter: string;
  genderFilter: string;
}

// Define actions interface
export interface ProfilesPresenterActions {
  updateProfile: (data: ProfileActionData) => Promise<boolean>;
  deleteProfile: (id: string) => Promise<boolean>;
  updateVerificationStatus: (id: string, status: 'pending' | 'verified' | 'rejected') => Promise<boolean>;
  toggleProfileStatus: (id: string, isActive: boolean) => Promise<boolean>;
  setSearchQuery: (query: string) => void;
  setVerificationFilter: (status: string) => void;
  setGenderFilter: (gender: string) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type ProfilesPresenterHook = [
  ProfilesPresenterState,
  ProfilesPresenterActions
];

// Custom hook implementation
export const useProfilesPresenter = (): ProfilesPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const logger = getClientService<Logger>('Logger');

  const updateProfile = async (data: ProfileActionData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.id) {
        throw new Error('ไม่พบรหัสโปรไฟล์');
      }
      if (!data.name.trim()) {
        throw new Error('กรุณาระบุชื่อผู้ใช้');
      }
      if (!data.phone.trim()) {
        throw new Error('กรุณาระบุเบอร์โทรศัพท์');
      }
      if (!data.email.trim()) {
        throw new Error('กรุณาระบุอีเมล');
      }

      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('ProfilesPresenter: Profile updated successfully');
      return true;
    } catch (error) {
      logger.error('ProfilesPresenter: Error updating profile', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการแก้ไขโปรไฟล์');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProfile = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสโปรไฟล์');
      }

      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('ProfilesPresenter: Profile deleted successfully');
      return true;
    } catch (error) {
      logger.error('ProfilesPresenter: Error deleting profile', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบโปรไฟล์');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVerificationStatus = async (id: string, status: 'pending' | 'verified' | 'rejected'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสโปรไฟล์');
      }
      if (!status) {
        throw new Error('กรุณาระบุสถานะการตรวจสอบ');
      }

      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('ProfilesPresenter: Verification status updated successfully');
      return true;
    } catch (error) {
      logger.error('ProfilesPresenter: Error updating verification status', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตสถานะการตรวจสอบ');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProfileStatus = async (id: string, _isActive: boolean): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสโปรไฟล์');
      }

      // API call or business logic - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info(`ProfilesPresenter: Profile status toggled to ${_isActive} successfully`);
      return true;
    } catch (error) {
      logger.error('ProfilesPresenter: Error toggling profile status', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะโปรไฟล์');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSearchQuery('');
    setVerificationFilter('');
    setGenderFilter('');
    logger.info('ProfilesPresenter: Reset');
  };

  return [
    { isLoading, error, searchQuery, verificationFilter, genderFilter },
    {
      updateProfile,
      deleteProfile,
      updateVerificationStatus,
      toggleProfileStatus,
      setSearchQuery,
      setVerificationFilter,
      setGenderFilter,
      reset,
      setError
    },
  ];
};
