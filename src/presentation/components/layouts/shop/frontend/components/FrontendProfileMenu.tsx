'use client';

import { ProfileDto } from '@/src/application/dtos/profile-dto';
import { useAuthorization } from '@/src/presentation/hooks/authorization';
import { useProfileStore } from '@/src/presentation/stores/profile-store';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface FrontendProfileMenuProps {
  profile: ProfileDto;
  onLogout: () => void;
}

export function FrontendProfileMenu({ profile, onLogout }: FrontendProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeProfile } = useProfileStore();
  const { hasBackendAccess } = useAuthorization();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg frontend-header-hover transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {profile.name.charAt(0).toUpperCase()}
        </div>

        {/* Profile Info */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium frontend-header-text">{profile.name}</p>
          <p className="text-xs frontend-header-text-muted">@{profile.username}</p>
        </div>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 frontend-header-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 frontend-card rounded-lg shadow-lg z-50">
          <div className="py-2">
            {/* Profile Header */}
            <div className="px-4 py-3 border-b frontend-card-border">
              <p className="text-sm font-medium frontend-text-primary">{profile.name}</p>
              <p className="text-xs frontend-text-muted">@{profile.username}</p>
              {profile.bio && (
                <p className="text-xs frontend-text-muted mt-1 line-clamp-2">{profile.bio}</p>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/account"
                className="flex items-center px-4 py-2 text-sm frontend-text-primary hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                จัดการโปรไฟล์
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center px-4 py-2 text-sm frontend-text-primary hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                แดชบอร์ด
              </Link>

              <Link
                href="/settings"
                className="flex items-center px-4 py-2 text-sm frontend-text-primary hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                การตั้งค่า
              </Link>
              {hasBackendAccess(activeProfile?.role) && (
                <Link
                  href="/backend"
                  className="flex items-center px-4 py-2 text-sm frontend-text-primary hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  จัดการระบบ
                </Link>
              )}
            </div>

            {/* Logout */}
            <div className="border-t frontend-card-border pt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="flex items-center w-full px-4 py-2 text-sm frontend-text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
