'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ShopBackendThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border shop-backend-header-border shop-backend-header-bg backdrop-blur-sm transition-all duration-200 hover:scale-105"
        disabled
      >
        <div className="h-4 w-4 animate-pulse rounded-full shop-backend-text-muted/20" />
      </button>
    )
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <svg
            className="h-4 w-4 shop-backend-text transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )
      case 'dark':
        return (
          <svg
            className="h-4 w-4 shop-backend-text transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )
      default: // system
        return (
          <svg
            className="h-4 w-4 shop-backend-text transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        )
    }
  }

  const getTooltip = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode'
      case 'dark':
        return 'Switch to system mode'
      default:
        return 'Switch to light mode'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border shop-backend-header-border shop-backend-header-bg backdrop-blur-sm transition-all duration-200 hover:scale-105 shop-backend-sidebar-hover hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      {getIcon()}
    </button>
  )
}
