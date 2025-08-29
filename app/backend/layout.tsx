
import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IAuthorizationService } from '@/src/application/interfaces/authorization-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import { getServerContainer } from '@/src/di/server-container';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

// Tell Next.js this is a dynamic page that shouldn't be statically optimized
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Generate metadata for the backend pages
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'แผงควบคุม - ShopQueue',
    description: 'ระบบจัดการเว็บไซต์ ShopQueue',
  };
}

/**
 * Backend layout component
 * Follows SOLID principles and Clean Architecture by:
 * - Using interfaces instead of concrete implementations (DIP)
 * - Proper error handling with redirects
 * - Using tsyringe for dependency injection
 */
export default async function BackendRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the server container
  const container = await getServerContainer();

  // Get the services from the container
  const authService = container.resolve('AuthService') as IAuthService;
  const profileService = container.resolve('ProfileService') as IProfileService;
  const authorizationService = container.resolve('AuthorizationService') as IAuthorizationService;

  // Check if the user is authenticated and has admin or moderator role
  const user = await authService.getCurrentUser();
  const profile = user ? await profileService.getActiveProfileByAuthId(user.id) : null;

  // Check if the user is authenticated
  if (!user || !profile) {
    // Redirect to login if no user is found
    redirect('/auth');
  }

  // Check if the user has proper permissions
  if (!authorizationService.hasBackendAccess(profile.role)) {
    // Redirect to unauthorized page if user doesn't have proper permissions
    redirect('/unauthorized');
  }

  return children;
}
