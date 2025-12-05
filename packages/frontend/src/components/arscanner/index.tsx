"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { useCamera } from "./hooks/useCamera";
import { useARDetection } from "./hooks/useARDetection";
import { ARHeader } from "./components/ARHeader";
import { ScannerFrame } from "./components/ScannerFrame";
import { Instructions } from "./components/Instructions";
import { AR_JS_CDN_URL } from "./constants";

export default function ARScanner() {
  const [isARLoaded, setIsARLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useCamera(videoRef, isARLoaded);
  const markerDetected = useARDetection(videoRef, canvasRef, isARLoaded);

  return (
    <>
      {/* AR.jsライブラリの読み込み */}
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
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/30" />

        <ARHeader markerDetected={markerDetected} />
        <ScannerFrame markerDetected={markerDetected} />
        <Instructions />
      </div>
    </>
  );
}
