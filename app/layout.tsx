import AuthInitializerWrapper from "@/src/presentation/components/auth/AuthInitializerWrapper";
import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import type { Metadata } from "next";
import "../public/styles/index.css";

export const metadata: Metadata = {
  title: "Shop Queue - ระบบจัดการคิวร้านค้า",
  description:
    "ระบบจัดการคิวร้านค้าออนไลน์ ช่วยให้ลูกค้าจองคิวง่ายๆ และเจ้าของร้านจัดการคิวได้อย่างมีประสิทธิภาพ",
  keywords: [
    "shop queue",
    "queue management",
    "queue system",
    "ระบบคิวร้านค้า",
    "จองคิวออนไลน์",
    "จัดการคิวร้านค้า",
    "queue app",
  ],
  authors: [{ name: "Marosdee Uma" }],
  creator: "Marosdee Uma",
  publisher: "Marosdee Uma",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon/favicon-16x16.png",
      },
      {
        rel: "manifest",
        url: "/favicon/site.webmanifest",
      },
    ],
  },
  openGraph: {
    title: "Shop Queue - ระบบจัดการคิวร้านค้า",
    description:
      "ระบบจัดการคิวร้านค้าออนไลน์ ช่วยให้ลูกค้าจองคิวง่ายๆ และเจ้าของร้านจัดการคิวได้อย่างมีประสิทธิภาพ",
    url: "/",
    siteName: "Shop Queue",
    images: [
      {
        url: "/favicon/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Shop Queue Logo",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Queue - ระบบจัดการคิวร้านค้า",
    description:
      "ระบบจัดการคิวร้านค้าออนไลน์ ช่วยให้ลูกค้าจองคิวง่ายๆ และเจ้าของร้านจัดการคิวได้อย่างมีประสิทธิภาพ",
    images: ["/favicon/android-chrome-512x512.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shop Queue",
  },
  manifest: "/favicon/site.webmanifest",
  verification: {
    // Add your verification codes here if needed
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

// Add viewport export for theme color
export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased">
        <AuthInitializerWrapper />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
