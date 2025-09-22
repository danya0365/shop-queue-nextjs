'use client';

import { useMediaQuery } from '@uidotdev/usehooks';

const useDetectDeviceScreen = () => {
  const isMobile = useMediaQuery('only screen and (max-width : 639px)');
  const isTablet = useMediaQuery(
    'only screen and (min-width : 640px) and (max-width : 1279px)'
  );
  const isDesktop = useMediaQuery('only screen and (min-width : 1280px)');

  return {
    isMobile,
    isTablet,
    isDesktop
  };
};

export default useDetectDeviceScreen;
