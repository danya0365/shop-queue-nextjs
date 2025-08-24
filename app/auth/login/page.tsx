import LoginView from "@/src/presentation/components/auth/LoginView";
import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { Metadata } from "next";

// Tell Next.js this is a dynamic page that shouldn't be statically optimized
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ | ระบบจัดการคิว",
  description: "เข้าสู่ระบบเพื่อจัดการคิวร้านค้าของคุณ",
};

export default function LoginPage() {
  return (
    <FrontendLayout>
      <LoginView redirectPath="/dashboard" />
    </FrontendLayout>
  );
}
