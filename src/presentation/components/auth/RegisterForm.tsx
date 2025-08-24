"use client";

import { Input } from "@/src/presentation/components/ui/input";
import { Label } from "@/src/presentation/components/ui/label";
import { useRegisterPresenter } from "@/src/presentation/presenters/auth/RegisterPresenter";
import {
  RegisterFormData,
  registerSchema,
} from "@/src/presentation/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface RegisterFormProps {
  redirectPath?: string;
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  redirectPath = "/auth/login",
  onSuccess,
}) => {
  const [{ isLoading, error }, { register: registerUser }] =
    useRegisterPresenter(redirectPath);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser(data);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">สมัครสมาชิก</h1>
        <p className="text-muted-foreground mt-2">
          กรอกข้อมูลด้านล่างเพื่อสร้างบัญชีของคุณ
        </p>
      </div>

      {error && (
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">ชื่อ</Label>
            <Input
              id="firstName"
              placeholder="ชื่อ"
              {...register("firstName")}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">นามสกุล</Label>
            <Input
              id="lastName"
              placeholder="นามสกุล"
              {...register("lastName")}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">อีเมล</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">รหัสผ่าน</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "ซ่อน" : "แสดง"}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="ยืนยันรหัสผ่าน"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "ซ่อน" : "แสดง"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <input 
              type="checkbox" 
              id="acceptTerms" 
              {...register("acceptTerms")} 
              className="h-4 w-4 rounded-sm border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Label
            htmlFor="acceptTerms"
            className={`text-sm font-medium leading-none ${
              errors.acceptTerms ? "text-red-500" : ""
            }`}
          >
            ฉันยอมรับ{" "}
            <Link href="/terms" className="text-primary hover:underline">
              ข้อกำหนดและเงื่อนไขการใช้งาน
            </Link>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
        )}

        <button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "กำลังดำเนินการ..." : "สมัครสมาชิก"}
        </button>

        <div className="text-center text-sm">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            เข้าสู่ระบบ
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
