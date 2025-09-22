'use client';

import useDetectDeviceScreen from './detect-device-screen';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const useGetDevice = (): DeviceType => {
  const { isMobile, isTablet } = useDetectDeviceScreen();
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
};

export default useGetDevice;
