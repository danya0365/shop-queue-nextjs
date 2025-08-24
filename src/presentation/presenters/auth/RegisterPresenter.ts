import { getClientService } from "@/src/di/client-container";
import { Logger } from "@/src/domain/interfaces/logger";
import { RegisterFormData } from "@/src/presentation/schemas/auth-schemas";
import { useAuthStore } from "@/src/presentation/stores/auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface RegisterPresenterState {
  isLoading: boolean;
  error: string | null;
}

export interface RegisterPresenterActions {
  register: (data: RegisterFormData) => Promise<boolean>;
  setError: (error: string | null) => void;
}

export type RegisterPresenterHook = [
  RegisterPresenterState,
  RegisterPresenterActions
];

export const useRegisterPresenter = (
  redirectPath: string = "/auth/login"
): RegisterPresenterHook => {
  const router = useRouter();
  const { signUp } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logger = getClientService<Logger>("Logger");

  const register = async (data: RegisterFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create metadata for profile creation

      const username = data.email.split("@")[0];
      const metadata = {
        username,
        full_name: `${data.firstName} ${data.lastName}`,
      };

      // Call the signUp method from auth store
      const result = await signUp(data.email, data.password, metadata);

      if (result.error) {
        logger.error("Registration error:", result.error);

        // Handle specific error messages
        if (result.error.message?.includes("already registered")) {
          setError("อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น");
        } else {
          setError(result.error.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
        }

        setIsLoading(false);
        return false;
      }

      // Registration successful
      logger.info("User registered successfully");

      // Redirect to the specified path
      router.push(redirectPath);
      return true;
    } catch (error) {
      logger.error("Unexpected registration error:", error);
      setError("เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง");
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return [
    { isLoading, error },
    { register, setError },
  ];
};
