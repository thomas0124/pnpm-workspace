"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { useCamera } from "@/components/arScanner/hooks/useCamera";
import { useARDetection } from "@/components/arScanner/hooks/useARDetection";
import { ARHeader } from "@/components/arScanner/_components/arHeader";
import { ScannerFrame } from "@/components/arScanner/_components/scannerFrame";
import { Instructions } from "@/components/arScanner/_components/instructions";
import { AR_JS_CDN_URL } from "@/components/arScanner/constants";
import { OverlayText } from "@/components/arScanner/_components/overlays/OverlayText";
import { OverlayHorse } from "@/components/arScanner/_components/overlays/OverlayHorse";
import { OverlayCoffee } from "@/components/arScanner/_components/overlays/OverlayCoffee";

/**
 * マーカーIDとオーバーレイコンポーネントのマッピング
 */
const MARKER_OVERLAYS: Record<number, React.ComponentType> = {
  1: OverlayText,
  2: OverlayHorse,
  3: OverlayCoffee,
};

export default function ARScanner() {
  const searchParams = useSearchParams();
  const autoStart = searchParams.get("autoStart") === "true";
  const [isARLoaded, setIsARLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { error, isCameraActive, startCamera } = useCamera(
    videoRef,
    isARLoaded,
  );

  // 自動起動が有効で、ARが読み込まれ、カメラがまだ起動していない場合、自動的にカメラを起動
  useEffect(() => {
    if (autoStart && isARLoaded && !isCameraActive) {
      startCamera();
    }
  }, [autoStart, isARLoaded, isCameraActive, startCamera]);

  const { detectedMarkerId, resetDetection } = useARDetection(
    videoRef,
    canvasRef,
    isARLoaded,
  );

  const OverlayComponent = detectedMarkerId
    ? MARKER_OVERLAYS[detectedMarkerId]
    : null;

  return (
    <>
      <Script
        src={AR_JS_CDN_URL}
        onLoad={() => setIsARLoaded(true)}
        strategy="lazyOnload"
      />

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {isCameraActive && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            muted
            autoPlay
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/30" />

        {error && (
          <div className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-red-500/90 p-6 text-center">
            <p className="text-sm font-medium text-white">{error}</p>
          </div>
        )}

        <ARHeader markerDetected={detectedMarkerId !== null} />

        <ScannerFrame markerDetected={detectedMarkerId !== null}>
          {OverlayComponent && <OverlayComponent />}
        </ScannerFrame>

        {/* 検出時のみ表示されるリセットボタンエリア */}
        {detectedMarkerId !== null && (
          <div className="absolute bottom-24 left-0 right-0 z-50 flex justify-center">
            <button
              onClick={resetDetection}
              className="rounded-full bg-white/90 px-8 py-3 text-lg font-bold text-slate-900 shadow-lg transition-all hover:bg-white active:scale-95"
            >
              再スキャンする
            </button>
          </div>
        )}

        {/* 未検出時かつカメラ起動時のみインストラクションを表示 */}
        {detectedMarkerId === null && isCameraActive && <Instructions />}
      </div>
    </>
  );
}
