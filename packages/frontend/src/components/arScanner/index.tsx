"use client";

import { useRef, useState, useEffect } from "react";
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
import { OverlayExhibitionCard } from "@/components/arScanner/_components/overlays/OverlayExhibitionCard";

export default function ARScanner() {
  const [isARLoaded, setIsARLoaded] = useState(false);
  // カード表示の状態管理
  const [isCardVisible, setIsCardVisible] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { error } = useCamera(videoRef, isARLoaded);

  const { detectedMarkerId, resetDetection } = useARDetection(
    videoRef,
    canvasRef,
    isARLoaded,
  );

  // マーカーが切り替わったりリセットされたらカードを閉じる
  useEffect(() => {
    setIsCardVisible(false);
  }, [detectedMarkerId]);

  // 3Dオブジェクトをタップしたときのハンドラー
  const handleObjectClick = () => {
    setIsCardVisible(true);
  };

  return (
    <>
      <Script
        src={AR_JS_CDN_URL}
        onLoad={() => setIsARLoaded(true)}
        strategy="lazyOnload"
      />

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          muted
          autoPlay
        />

        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/30" />

        {error && (
          <div className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-red-500/90 p-6 text-center">
            <p className="text-sm font-medium text-white">{error}</p>
          </div>
        )}

        <ARHeader markerDetected={detectedMarkerId !== null} />

        <ScannerFrame markerDetected={detectedMarkerId !== null}>
          {/* 各IDに対応する3Dモデルを表示。タップでカードを表示する */}
          {detectedMarkerId === 1 && <OverlayText onClick={handleObjectClick} />}
          {detectedMarkerId === 2 && <OverlayHorse onClick={handleObjectClick} />}
          {detectedMarkerId === 3 && <OverlayCoffee onClick={handleObjectClick} />}

          {/* カードが表示モードになっている場合のみ表示 */}
          {detectedMarkerId !== null && isCardVisible && (
            <OverlayExhibitionCard
              markerId={detectedMarkerId}
              onClose={() => setIsCardVisible(false)}
            />
          )}
        </ScannerFrame>

        {/* リセットボタンエリア (カードが出ていない時のみ表示するなど、調整可能だが今回は常に出す) */}
        {detectedMarkerId !== null && !isCardVisible && (
          <div className="absolute bottom-24 left-0 right-0 z-50 flex justify-center">
            <button
              onClick={resetDetection}
              className="rounded-full bg-white/90 px-8 py-3 text-lg font-bold text-slate-900 shadow-lg transition-all hover:bg-white active:scale-95"
            >
              再スキャンする
            </button>
          </div>
        )}

        {detectedMarkerId === null && <Instructions />}
      </div>
    </>
  );
}