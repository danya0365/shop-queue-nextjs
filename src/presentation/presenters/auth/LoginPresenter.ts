import { getClientService } from "@/src/di/client-container";
import { Logger } from "@/src/domain/interfaces/logger";
import { LoginFormData } from "@/src/presentation/schemas/auth-schemas";
import { useAuthStore } from "@/src/presentation/stores/auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface LoginPresenterState {
  isLoading: boolean;
  error: string | null;
}

export interface LoginPresenterActions {
  login: (data: LoginFormData) => Promise<boolean>;
  setError: (error: string | null) => void;
}

export type LoginPresenterHook = [
  LoginPresenterState,
  LoginPresenterActions
];

export const useLoginPresenter = (
  redirectPath: string = "/dashboard"
): LoginPresenterHook => {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logger = getClientService<Logger>("Logger");

  const login = async (data: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the signIn method from auth store
      const result = await signIn(data.email, data.password);

      if (result.error) {
        logger.error("Login error:", result.error);

        // Handle specific error messages
        if (result.error.message?.includes("Invalid login credentials")) {
          setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        } else {
          setError(result.error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        }

        setIsLoading(false);
        return false;
      }

      // Login successful
      logger.info("User logged in successfully");

      // Redirect to the specified path
      router.push(redirectPath);
      return true;
    } catch (error) {
      logger.error("Unexpected login error:", error);
      setError("เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง");
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return [
    { isLoading, error },
    { login, setError },
  ];
};
