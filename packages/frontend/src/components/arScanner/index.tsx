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

        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
          <Image
            src="/AR-Marker.png"
            alt="Debug Marker Target"
            width={200}
            height={200}
            className="h-[200px] w-[200px] border-2 border-red-500 object-cover"
          />
          <p className="mt-1 bg-black/50 text-center text-xs text-white">
            認識対象マーカー (デバッグ表示)
          </p>
        </div>

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
