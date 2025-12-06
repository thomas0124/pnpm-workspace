"use client";

import { LoginForm } from "./loginForm";

export function LoginFormWrapper() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <LoginForm />
    </div>
  );
}
