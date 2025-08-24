import RegisterView from "@/src/presentation/components/auth/RegisterView";
import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { Metadata } from "next";

// Tell Next.js this is a dynamic page that shouldn't be statically optimized
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "สมัครสมาชิก | ระบบจัดการคิว",
  description: "สมัครสมาชิกเพื่อใช้งานระบบจัดการคิวร้านค้าของคุณ",
};

export default async function RegisterPage() {
  return (
    <FrontendLayout>
      <RegisterView redirectPath="/auth/login" />
    </FrontendLayout>
  );
}
