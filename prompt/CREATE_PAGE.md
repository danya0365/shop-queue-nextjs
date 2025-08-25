# Create Page Template - Clean Architecture Pattern

## Prompt Template for Creating New Pages

Use this prompt template to create new pages following Clean Architecture and SOLID principles, similar to the contact page implementation.

---

## **Base Prompt Structure**

```
ศึกษาโค้ดจาก /Users/marosdeeuma/shop-queue-nextjs/app/features/page.tsx

แล้วช่วยทำหน้า [PAGE_NAME] ด้วยคับ http://localhost:3000/[ROUTE]

โดยที่ ฝั่ง server component ให้ใช้ class Presenter แล้ว return ViewModel 

ส่วนโค้ดฝั่ง client component ให้ใช้ custom hook presenter 

ตัวอย่าง class Presenter ที่ทำงานฝั่ง server component  /Users/marosdeeuma/shop-queue-nextjs/src/presentation/presenters/dashboard/DashboardPresenter.ts

ตัวอย่าง custom hook presenter ที่ทำงานฝั่ง client component /Users/marosdeeuma/shop-queue-nextjs/src/presentation/presenters/auth/LoginPresenter.ts
```

---

## **Implementation Pattern**

### **1. Server-side Presenter (Class)**
**Location**: `/src/presentation/presenters/[page-name]/[PageName]Presenter.ts`

**Structure**:
```typescript
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface [DataType] {
  // Define properties
}

// Define ViewModel interface
export interface [PageName]ViewModel {
  // Define view model properties
}

// Main Presenter class
export class [PageName]Presenter {
  constructor(private readonly logger: Logger) {}

  async getViewModel(): Promise<[PageName]ViewModel> {
    try {
      this.logger.info('[PageName]Presenter: Getting view model');
      
      // Business logic here
      
      return {
        // Return view model
      };
    } catch (error) {
      this.logger.error('[PageName]Presenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getData() {
    // Implementation
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: '[Page Title] | Shop Queue',
      description: '[Page Description]',
    };
  }
}

// Factory class
export class [PageName]PresenterFactory {
  static async create(): Promise<[PageName]Presenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new [PageName]Presenter(logger);
  }
}
```

### **2. Client-side Hook Presenter**
**Location**: `/src/presentation/presenters/[page-name]/use[PageName]Presenter.ts`

**Structure**:
```typescript
import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define form/action data interfaces
export interface [ActionName]Data {
  // Define properties
}

// Define state interface
export interface [PageName]PresenterState {
  isLoading: boolean;
  error: string | null;
  // Other state properties
}

// Define actions interface
export interface [PageName]PresenterActions {
  [actionName]: (data: [ActionName]Data) => Promise<boolean>;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type [PageName]PresenterHook = [
  [PageName]PresenterState,
  [PageName]PresenterActions
];

// Custom hook implementation
export const use[PageName]Presenter = (): [PageName]PresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logger = getClientService<Logger>('Logger');

  const [actionName] = async (data: [ActionName]Data): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      
      // API call or business logic
      
      logger.info('[PageName]Presenter: Action completed successfully');
      return true;
    } catch (error) {
      logger.error('[PageName]Presenter: Error in action', error);
      setError('Error message');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    logger.info('[PageName]Presenter: Reset');
  };

  return [
    { isLoading, error },
    { [actionName], reset, setError },
  ];
};
```

### **3. View Component**
**Location**: `/src/presentation/components/[page-name]/[PageName]View.tsx`

**Structure**:
```typescript
'use client';

import { [PageName]ViewModel } from '@/src/presentation/presenters/[page-name]/[PageName]Presenter';
import { use[PageName]Presenter } from '@/src/presentation/presenters/[page-name]/use[PageName]Presenter';
import Link from 'next/link';
import { useState } from 'react';

interface [PageName]ViewProps {
  viewModel: [PageName]ViewModel;
}

export function [PageName]View({ viewModel }: [PageName]ViewProps) {
  const [state, actions] = use[PageName]Presenter();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            [Page Title]
            <br />
            <span className="text-primary-light">[Subtitle]</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            [Page Description]
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Page Content */}
        
        {/* CTA Section */}
        <div className="mt-20 text-center bg-primary-gradient rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            [CTA Title]
          </h2>
          <p className="text-xl mb-8 opacity-90">
            [CTA Description]
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              [Primary CTA]
            </Link>
            <Link
              href="/features"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
            >
              [Secondary CTA]
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### **4. Page Component**
**Location**: `/app/[route]/page.tsx`

**Structure**:
```typescript
import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { [PageName]View } from "@/src/presentation/components/[page-name]/[PageName]View";
import { [PageName]PresenterFactory } from "@/src/presentation/presenters/[page-name]/[PageName]Presenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await [PageName]PresenterFactory.create();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "[Page Title] | Shop Queue",
      description: "[Page Description]",
    };
  }
}

/**
 * [PageName] page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function [PageName]Page() {
  const presenter = await [PageName]PresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return (
      <FrontendLayout>
        <[PageName]View viewModel={viewModel} />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("Error fetching [page-name] data:", error);

    // Fallback UI
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลได้</p>
            <Link
              href="/"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </FrontendLayout>
    );
  }
}
```

---

## **Key Principles**

### **Clean Architecture**
- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Inversion**: Depend on abstractions, not concretions
- **Server Components**: For SEO and performance
- **Client Components**: For interactivity

### **SOLID Principles**
- **Single Responsibility**: Each class/function has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Objects should be replaceable with instances of their subtypes
- **Interface Segregation**: Many client-specific interfaces are better than one general-purpose interface
- **Dependency Inversion**: Depend on abstractions, not concretions

### **File Structure**
```
/app/[route]/
  └── page.tsx                    # Next.js page component

/src/presentation/
  ├── presenters/[page-name]/
  │   ├── [PageName]Presenter.ts  # Server-side presenter
  │   └── use[PageName]Presenter.ts # Client-side hook
  └── components/[page-name]/
      └── [PageName]View.tsx      # UI component
```

---

## **Example Usage**

To create a new "About" page:

```
ศึกษาโค้ดจาก /Users/marosdeeuma/shop-queue-nextjs/app/features/page.tsx

แล้วช่วยทำหน้า about ด้วยคับ http://localhost:3000/about

โดยที่ ฝั่ง server component ให้ใช้ class Presenter แล้ว return ViewModel 

ส่วนโค้ดฝั่ง client component ให้ใช้ custom hook presenter 

ตัวอย่าง class Presenter ที่ทำงานฝั่ง server component  /Users/marosdeeuma/shop-queue-nextjs/src/presentation/presenters/dashboard/DashboardPresenter.ts

ตัวอย่าง custom hook presenter ที่ทำงานฝั่ง client component /Users/marosdeeuma/shop-queue-nextjs/src/presentation/presenters/auth/LoginPresenter.ts
```

This will create:
- `AboutPresenter.ts` (server-side)
- `useAboutPresenter.ts` (client-side)
- `AboutView.tsx` (UI component)
- `/app/about/page.tsx` (Next.js page)

---

## **Features Included**

✅ **SEO Optimization** - Server Components with metadata generation  
✅ **Error Handling** - Proper error boundaries and fallback UI  
✅ **TypeScript** - Full type safety throughout  
✅ **Responsive Design** - Mobile-first approach with Tailwind CSS  
✅ **Form Validation** - Client-side validation with proper error messages  
✅ **Loading States** - User feedback during async operations  
✅ **Success Handling** - Confirmation messages and state management  
✅ **Clean Architecture** - Proper separation of concerns  
✅ **SOLID Principles** - Maintainable and testable code  
✅ **Thai Language** - Localized content and messages  
✅ **Consistent Styling** - Following Shop Queue design system

---

## **Customization Points**

When using this template, customize:

1. **Page Name & Route** - Replace `[PAGE_NAME]` and `[ROUTE]`
2. **Data Structures** - Define appropriate interfaces for your page
3. **Business Logic** - Implement specific functionality in presenters
4. **UI Components** - Design the visual layout in the View component
5. **Validation Rules** - Add appropriate form validation
6. **API Integration** - Connect to actual backend services
7. **Content** - Replace placeholder text with actual content
8. **Styling** - Adjust Tailwind classes for specific design needs

This template ensures consistency across all pages while maintaining flexibility for specific requirements.
