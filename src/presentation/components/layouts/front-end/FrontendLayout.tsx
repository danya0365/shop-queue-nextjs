"use client";

import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import React, { useEffect, useState } from "react";
import { FrontendFooter } from "./components/FrontendFooter";
import { FrontendHeader } from "./components/FrontendHeader";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/utils/cn";

interface LayoutProps {
  children: React.ReactNode;
}

const FrontendLayout: React.FC<LayoutProps> = ({ children }) => {
  // Determine mobile viewport (use same condition as ShopMarketplaceLayout: width < 1024)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Frontend navigation (aligned with FrontendHeader items)
  const navigationLinks = [
    {
      href: "/",
      label: "หน้าหลัก",
      order: 1,
      emoji: "🏠",
      activePath: (p: string) => p === "/",
    },
    {
      href: "/shop",
      label: "ตลาดร้านค้า",
      order: 2,
      emoji: "🏬",
      activePath: (p: string) => p.startsWith("/shop"),
    },
    {
      href: "/features",
      label: "ฟีเจอร์",
      order: 3,
      emoji: "✨",
      activePath: (p: string) => p.startsWith("/features"),
    },
    {
      href: "/pricing",
      label: "ราคา",
      order: 4,
      emoji: "💰",
      activePath: (p: string) => p.startsWith("/pricing"),
    },
    {
      href: "/contact",
      label: "ติดต่อเรา",
      order: 5,
      emoji: "✉️",
      activePath: (p: string) => p.startsWith("/contact"),
    },
  ] as const;

  const isActive = (cb: (p: string) => boolean) => cb(pathname);

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <FrontendHeader />
        <main
          className={cn(
            "flex-1 pt-0 pb-0",
            // add bottom space when mobile tab bar is visible
            isMobile ? "mb-24" : undefined
          )}
        >
          {children}
        </main>

        {/* Footer on desktop only */}
        {!isMobile && <FrontendFooter />}

        {/* Mobile Bottom Tabbar (same style as marketplace) */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
            <div className="flex justify-around items-center h-16">
              {navigationLinks
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((link) => {
                  const active = isActive(link.activePath);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex flex-col items-center justify-center flex-1 h-full",
                        "text-sm font-medium transition-colors",
                        active
                          ? "text-primary-600 dark:text-primary-400 border-t-2 border-orange-600 dark:border-orange-400"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      )}
                    >
                      <span className="text-lg mb-1">{link.emoji}</span>
                      <span className="text-xs">{link.label}</span>
                      {active && (
                        <span className="absolute bottom-0 w-1/2 h-1 bg-primary-600 dark:bg-primary-400 rounded-t-full" />
                      )}
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default FrontendLayout;
