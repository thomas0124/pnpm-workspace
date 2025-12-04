"use client";

import { RegisterForm } from "./registerForm";

export function RegisterFormWrapper() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <RegisterForm />
    </div>
  );
}
