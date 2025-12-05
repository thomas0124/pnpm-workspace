"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { useCamera } from "@/components/arScanner/hooks/useCamera";
import { useARDetection } from "@/components/arScanner/hooks/useARDetection";
import { ARHeader } from "@/components/arScanner/_components/arHeader";
import { ScannerFrame } from "@/components/arScanner/_components/scannerFrame";
import { Instructions } from "@/components/arScanner/_components/instructions";
import { AR_JS_CDN_URL } from "@/components/arScanner/constants";
import Image from "next/image";
import { OverlayText } from "@/components/arScanner/_components/overlays/OverlayText";
import { OverlayHorse } from "@/components/arScanner/_components/overlays/OverlayHorse";
import { OverlayCoffee } from "@/components/arScanner/_components/overlays/OverlayCoffee";

export default function ARScanner() {
  const [isARLoaded, setIsARLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ★修正: useCamera の戻り値を受け取るように修正
  const { error } = useCamera(videoRef, isARLoaded);
  
  // マーカーIDを取得 (1, 2, 3 または null)
  const detectedMarkerId = useARDetection(videoRef, canvasRef, isARLoaded);

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
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-red-500/90 p-6 text-center z-50">
            <p className="text-sm font-medium text-white">{error}</p>
          </div>
        )}

        {/* boolean型に変換して渡す */}
        <ARHeader markerDetected={detectedMarkerId !== null} />
        
        <ScannerFrame markerDetected={detectedMarkerId !== null}>
          {detectedMarkerId === 1 && <OverlayText />}
          {detectedMarkerId === 2 && <OverlayHorse />}
          {detectedMarkerId === 3 && <OverlayCoffee />}
        </ScannerFrame>
        
        <Instructions />
      </div>
    </>
  );
}