"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  /**
   * Size variant for the toggle button
   */
  size?: "sm" | "md" | "lg";
  /**
   * Style variant for the toggle button
   */
  variant?: "default" | "outline" | "ghost" | "marketplace";
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Show text label next to icon
   */
  showLabel?: boolean;
  /**
   * Custom label text
   */
  labelText?: string;
}

/**
 * Standalone Theme Toggle Component
 * Provides theme switching functionality with multiple variants and sizes
 */
export function ThemeToggle({
  size = "md",
  variant = "default",
  className = "",
  showLabel = false,
  labelText
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Size classes
  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3"
  };

  // Icon size classes
  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  // Variant classes
  const variantClasses = {
    default: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300",
    outline: "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
    marketplace: "marketplace-header-hover marketplace-text-secondary"
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div className={iconSizeClasses[size]} />
      </div>
    );
  }

  const isDark = theme === "dark";
  const displayLabel = labelText || (isDark ? "โหมดสว่าง" : "โหมดมืด");

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg transition-colors duration-200
        flex items-center space-x-2
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      title={displayLabel}
      aria-label={displayLabel}
    >
      {isDark ? (
        <Sun className={`${iconSizeClasses[size]} transition-transform duration-200 hover:rotate-12`} />
      ) : (
        <Moon className={`${iconSizeClasses[size]} transition-transform duration-200 hover:-rotate-12`} />
      )}
      
      {showLabel && (
        <span className="text-sm font-medium">
          {displayLabel}
        </span>
      )}
    </button>
  );
}

/**
 * Theme Toggle with Text Label
 * Convenience component with label always shown
 */
export function ThemeToggleWithLabel({
  labelText,
  ...props
}: Omit<ThemeToggleProps, "showLabel">) {
  return (
    <ThemeToggle
      {...props}
      showLabel={true}
      labelText={labelText}
    />
  );
}

/**
 * Compact Theme Toggle
 * Small size variant for tight spaces
 */
export function CompactThemeToggle(props: Omit<ThemeToggleProps, "size">) {
  return (
    <ThemeToggle
      {...props}
      size="sm"
    />
  );
}

/**
 * Large Theme Toggle
 * Large size variant for prominent placement
 */
export function LargeThemeToggle(props: Omit<ThemeToggleProps, "size">) {
  return (
    <ThemeToggle
      {...props}
      size="lg"
    />
  );
}

/**
 * Marketplace Theme Toggle
 * Pre-configured for marketplace design system
 */
export function MarketplaceThemeToggle(props: Omit<ThemeToggleProps, "variant">) {
  return (
    <ThemeToggle
      {...props}
      variant="marketplace"
    />
  );
}
