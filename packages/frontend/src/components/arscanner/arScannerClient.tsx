"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Script from "next/script";

export default function ARScannerClient() {
  const [isARLoaded, setIsARLoaded] = useState(false);
  const [markerDetected, setMarkerDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isARLoaded) return;

    // カメラストリームの取得
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        console.error("[v0] カメラアクセスエラー:", err);
      });

    return () => {
      // クリーンアップ
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isARLoaded]);

  useEffect(() => {
    if (!isARLoaded || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // AR.jsの初期化
    const initAR = async () => {
      // @ts-ignore - AR.jsのグローバル変数
      if (typeof window !== "undefined" && window.ARController) {
        try {
          // @ts-ignore
          const arController = new window.ARController(
            canvas,
            "/data/camera_para.dat",
          );

          arController.addEventListener("getMarker", (event: any) => {
            console.log("[v0] マーカー検出:", event.data.marker.id);
            setMarkerDetected(true);

            // 3秒後にリセット
            setTimeout(() => setMarkerDetected(false), 3000);
          });

          // ビデオフレームの処理
          const processFrame = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              context.drawImage(video, 0, 0, canvas.width, canvas.height);

              // AR処理
              arController.detectMarker(
                context.getImageData(0, 0, canvas.width, canvas.height),
              );
            }
            requestAnimationFrame(processFrame);
          };

          video.addEventListener("loadedmetadata", () => {
            processFrame();
          });
        } catch (error) {
          console.error("[v0] AR初期化エラー:", error);
        }
      }
    };

    initAR();
  }, [isARLoaded]);

  return (
    <>
      {/* AR.jsライブラリの読み込み */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jsartoolkit5/5.3.2/artoolkit.min.js"
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

        {/* Header */}
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4">
          <Link href="/exhibitions">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2">
            <div
              className={`h-2 w-2 rounded-full ${
                markerDetected
                  ? "animate-pulse bg-green-400"
                  : "animate-pulse bg-teal-400"
              }`}
            />
            <span className="text-sm font-medium text-white">
              {markerDetected ? "マーカー検出" : "AR検出中"}
            </span>
          </div>
        </div>

        {/* Scanner Frame */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
          <div className="relative aspect-square w-full max-w-md">
            {/* Top Left Corner */}
            <div className="absolute left-0 top-0 h-24 w-24">
              <div className="absolute left-0 top-0 h-1 w-full rounded-full bg-teal-400" />
              <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-teal-400" />
            </div>

            {/* Top Right Corner */}
            <div className="absolute right-0 top-0 h-24 w-24">
              <div className="absolute right-0 top-0 h-1 w-full rounded-full bg-teal-400" />
              <div className="absolute right-0 top-0 h-full w-1 rounded-full bg-teal-400" />
            </div>

            {/* Bottom Left Corner */}
            <div className="absolute bottom-0 left-0 h-24 w-24">
              <div className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-teal-400" />
              <div className="absolute bottom-0 left-0 h-full w-1 rounded-full bg-teal-400" />
            </div>

            {/* Bottom Right Corner */}
            <div className="absolute bottom-0 right-0 h-24 w-24">
              <div className="absolute bottom-0 right-0 h-1 w-full rounded-full bg-teal-400" />
              <div className="absolute bottom-0 right-0 h-full w-1 rounded-full bg-teal-400" />
            </div>

            {markerDetected && (
              <div className="absolute left-1/2 top-1/2 flex w-64 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl bg-white p-8 shadow-2xl duration-300 animate-in fade-in zoom-in">
                {/* Marker Icon */}
                <div className="relative mb-4 h-32 w-32">
                  <div className="absolute inset-0 rounded-lg border-8 border-black" />
                  <div className="absolute inset-4 rounded-sm border-8 border-black" />
                  <div className="absolute inset-8 rounded-sm bg-black" />
                </div>

                {/* Text */}
                <h2 className="mb-2 text-lg font-bold text-gray-900">
                  AR MARKER
                </h2>
                <p className="text-sm text-gray-500">ID: 001</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Instructions */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center px-4">
          <div className="rounded-full bg-black/80 px-8 py-4">
            <p className="text-center text-sm font-medium text-white">
              ARマーカーにカメラを
              <br />
              向けてください
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
