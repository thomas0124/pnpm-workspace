"use client"

import { LoginForm } from "./loginForm"

export function LoginFormWrapper() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
