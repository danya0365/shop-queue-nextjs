'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../../stores/auth-store';

/**
 * This component initializes the auth listener when the app loads.
 * It should be placed high in the component tree, ideally in the root layout.
 */
export const AuthInitializer: React.FC = () => {
  const { initializeAuthListener } = useAuthStore();
  
  useEffect(() => {
    // Initialize the auth listener when the component mounts
    const unsubscribe = initializeAuthListener();
    
    // Clean up the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initializeAuthListener]);
  
  // This component doesn't render anything
  return null;
};

export default AuthInitializer;
