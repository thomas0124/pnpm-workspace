"use client"

import { RegisterForm } from "./registerForm"

export function RegisterFormWrapper() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <RegisterForm />
    </div>
  )
}
