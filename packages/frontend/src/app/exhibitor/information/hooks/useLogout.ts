import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import client from "@/lib/apiClient";

import { AUTH_TOKEN_KEY } from "../constants";

const clearSession = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
};

export function useLogout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

      if (token) {
        await client.exhibitors.logout.$post({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearSession();
      router.push("/login");
      setIsLoading(false);
    }
  }, [router]);

  return { logout, isLoading };
}
