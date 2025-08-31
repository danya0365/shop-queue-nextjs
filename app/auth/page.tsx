import { redirect } from "next/navigation";

// redirect to auth/login page  
export default function AuthPage() {
  return redirect("/auth/login");
}