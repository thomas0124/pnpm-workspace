"use client";

import { Suspense, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { ExhibitionsContent } from "@/app/exhibitions/_components/exhibitionContent";
import { requestCameraPermission } from "@/components/arScanner/utils/cameraUtils";

// 動的レンダリングを強制
export const dynamic = "force-dynamic";

// ローディングフォールバック
function ExhibitionsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 pb-20">
      <Spinner className="size-8" />
    </div>
  );
}

export default function ExhibitionsPage() {
  const router = useRouter();
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);

  const handleCameraButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isRequestingCamera) return;

    setIsRequestingCamera(true);

    try {
      // カメラの許可を取得（ユーザー操作として認識される）
      const hasPermission = await requestCameraPermission();

      if (hasPermission) {
        // 自動起動パラメータを付けて遷移
        router.push("/arScanner?autoStart=true");
      } else {
        // 許可が取得できなかった場合も遷移（遷移先でエラーメッセージを表示）
        router.push("/arScanner");
      }
    } catch (err) {
      console.error("カメラアクセスエラー:", err);
      // エラーが発生しても遷移（遷移先でエラーメッセージを表示）
      router.push("/arScanner");
    } finally {
      setIsRequestingCamera(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Suspense fallback={<ExhibitionsLoading />}>
        <ExhibitionsContent />
      </Suspense>

      {/* Floating Camera Button */}
      <Button
        size="icon"
        onClick={handleCameraButtonClick}
        disabled={isRequestingCamera}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-teal-500 shadow-2xl hover:bg-teal-600 disabled:opacity-50"
        style={{
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Camera className="h-12 w-12 text-white" />
      </Button>
    </div>
  );
}
