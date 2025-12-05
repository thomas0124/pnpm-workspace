import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AUTH_TOKEN_KEY = "authToken";

/**
 * Exhibitor 向けページの簡易ログインガード。
 * JWT が sessionStorage に無い場合はログインページへ置き換え遷移させる。
 */
export function useAuthGuard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem(AUTH_TOKEN_KEY)
        : null;

    if (!token) {
      setIsAuthenticated(false);
      router.replace("/login");
      return;
    }

    setIsAuthenticated(true);
  }, [router]);

  return { isAuthenticated };
}
