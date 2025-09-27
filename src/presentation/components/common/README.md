# Common Components

This directory contains reusable UI components that can be used across the entire application.

## ThemeToggle Component

A standalone theme toggle component that provides theme switching functionality with multiple variants and sizes.

### Features

- **Multiple Variants**: `default`, `outline`, `ghost`, `marketplace`
- **Multiple Sizes**: `sm`, `md`, `lg`
- **Hydration Safe**: Prevents hydration mismatch with proper mounting detection
- **Accessible**: Includes proper ARIA labels and keyboard support
- **Animated**: Smooth icon transitions with hover effects
- **TypeScript**: Fully typed with comprehensive prop interfaces

### Basic Usage

```tsx
import { ThemeToggle } from "@/src/presentation/components/common/ThemeToggle";

// Basic usage
<ThemeToggle />

// With custom size and variant
<ThemeToggle size="lg" variant="outline" />

// With label
<ThemeToggle showLabel={true} labelText="เปลี่ยนธีม" />
```

### Convenience Components

```tsx
import { 
  MarketplaceThemeToggle,
  CompactThemeToggle,
  LargeThemeToggle,
  ThemeToggleWithLabel 
} from "@/src/presentation/components/common/ThemeToggle";

// Pre-configured for marketplace design
<MarketplaceThemeToggle />

// Small size for tight spaces
<CompactThemeToggle />

// Large size for prominent placement
<LargeThemeToggle />

// Always shows label
<ThemeToggleWithLabel labelText="โหมดมืด/สว่าง" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant for the toggle button |
| `variant` | `"default" \| "outline" \| "ghost" \| "marketplace"` | `"default"` | Style variant for the toggle button |
| `className` | `string` | `""` | Additional CSS classes |
| `showLabel` | `boolean` | `false` | Show text label next to icon |
| `labelText` | `string` | `undefined` | Custom label text (auto-generated if not provided) |

### Variants

- **`default`**: Gray background with hover effects
- **`outline`**: Border with transparent background
- **`ghost`**: No background, only hover effects
- **`marketplace`**: Uses marketplace design system classes

### Sizes

- **`sm`**: 16px icon, 6px padding
- **`md`**: 20px icon, 8px padding  
- **`lg`**: 24px icon, 12px padding

### Implementation Details

- Uses `next-themes` for theme management
- Prevents hydration mismatch with `useEffect` mounting detection
- Includes smooth CSS transitions and hover animations
- Supports both light and dark mode icons (Sun/Moon)
- Fully accessible with proper ARIA attributes
- TypeScript interfaces for all props and variants

### Usage in MarketplaceHeader

The component is used in the MarketplaceHeader for both desktop and mobile views:

```tsx
// Desktop theme toggle
<MarketplaceThemeToggle />

// Mobile menu footer
<div className="flex items-center justify-between">
  <span className="text-sm marketplace-text-muted">เปลี่ยนธีม</span>
  <MarketplaceThemeToggle />
</div>
```

This provides consistent theme switching functionality across all parts of the application while maintaining the marketplace design system.
