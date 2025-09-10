/**
 * Environment detection utilities
 * Following Clean Architecture and SOLID principles
 */

/**
 * Check if the application is running in local development environment
 * @returns true if running in local development
 */
export const isLocalDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development' || 
         !!process.env.NEXT_PUBLIC_APP_URL?.includes('localhost') ||
         !!process.env.NEXT_PUBLIC_APP_URL?.includes('127.0.0.1');
};

/**
 * Check if the application is running in production environment
 * @returns true if running in production
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Check if the application is running in test environment
 * @returns true if running in test
 */
export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test';
};

/**
 * Get the current environment name
 * @returns 'development' | 'production' | 'test'
 */
export const getEnvironment = (): 'development' | 'production' | 'test' => {
  if (isProduction()) return 'production';
  if (isTest()) return 'test';
  return 'development';
};
