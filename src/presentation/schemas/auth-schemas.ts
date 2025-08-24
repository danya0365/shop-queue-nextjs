import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'อีเมลจำเป็นต้องกรอก' })
    .email({ message: 'รูปแบบอีเมลไม่ถูกต้อง' }),
  password: z
    .string()
    .min(8, { message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' })
    .regex(/[A-Z]/, { message: 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว' })
    .regex(/[a-z]/, { message: 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว' })
    .regex(/[0-9]/, { message: 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว' }),
  confirmPassword: z.string().min(1, { message: 'กรุณายืนยันรหัสผ่าน' }),
  firstName: z.string().min(1, { message: 'ชื่อจำเป็นต้องกรอก' }),
  lastName: z.string().min(1, { message: 'นามสกุลจำเป็นต้องกรอก' }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'คุณต้องยอมรับข้อกำหนดและเงื่อนไขการใช้งาน'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'รหัสผ่านไม่ตรงกัน',
  path: ['confirmPassword']
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'อีเมลจำเป็นต้องกรอก' })
    .email({ message: 'รูปแบบอีเมลไม่ถูกต้อง' }),
  password: z
    .string()
    .min(1, { message: 'รหัสผ่านจำเป็นต้องกรอก' })
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
