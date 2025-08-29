"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the AuthInitializer to avoid SSR issues with Zustand
const AuthInitializer = dynamic(
  () => import('./AuthInitializer'),
  { ssr: false }
);

/**
 * Client component wrapper for AuthInitializer
 * This follows Clean Architecture by separating client components from server components
 */
const AuthInitializerWrapper: React.FC = () => {
  return <AuthInitializer />;
};

export default AuthInitializerWrapper;
