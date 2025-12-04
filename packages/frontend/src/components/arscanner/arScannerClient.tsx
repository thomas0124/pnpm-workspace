"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Script from "next/script"

export default function ARScannerClient() {
  const [isARLoaded, setIsARLoaded] = useState(false)
  const [markerDetected, setMarkerDetected] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isARLoaded) return

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
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      })
      .catch((err) => {
        console.error("[v0] カメラアクセスエラー:", err)
      })

    return () => {
      // クリーンアップ
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isARLoaded])

  useEffect(() => {
    if (!isARLoaded || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    // AR.jsの初期化
    const initAR = async () => {
      // @ts-ignore - AR.jsのグローバル変数
      if (typeof window !== "undefined" && window.ARController) {
        try {
          // @ts-ignore
          const arController = new window.ARController(canvas, "/data/camera_para.dat")

          arController.addEventListener("getMarker", (event: any) => {
            console.log("[v0] マーカー検出:", event.data.marker.id)
            setMarkerDetected(true)

            // 3秒後にリセット
            setTimeout(() => setMarkerDetected(false), 3000)
          })

          // ビデオフレームの処理
          const processFrame = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
              canvas.width = video.videoWidth
              canvas.height = video.videoHeight
              context.drawImage(video, 0, 0, canvas.width, canvas.height)

              // AR処理
              arController.detectMarker(context.getImageData(0, 0, canvas.width, canvas.height))
            }
            requestAnimationFrame(processFrame)
          }

          video.addEventListener("loadedmetadata", () => {
            processFrame()
          })
        } catch (error) {
          console.error("[v0] AR初期化エラー:", error)
        }
      }
    }

    initAR()
  }, [isARLoaded])

  return (
    <>
      {/* AR.jsライブラリの読み込み */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jsartoolkit5/5.3.2/artoolkit.min.js"
        onLoad={() => setIsARLoaded(true)}
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
        <canvas ref={canvasRef} className="hidden" />

        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/30" />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
          <Link href="/events">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full">
            <div
              className={`h-2 w-2 rounded-full ${
                markerDetected ? "bg-green-400 animate-pulse" : "bg-teal-400 animate-pulse"
              }`}
            />
            <span className="text-white text-sm font-medium">{markerDetected ? "マーカー検出" : "AR検出中"}</span>
          </div>
        </div>

        {/* Scanner Frame */}
        <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
          <div className="relative w-full max-w-md aspect-square">
            {/* Top Left Corner */}
            <div className="absolute top-0 left-0 w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-1 bg-teal-400 rounded-full" />
              <div className="absolute top-0 left-0 w-1 h-full bg-teal-400 rounded-full" />
            </div>

            {/* Top Right Corner */}
            <div className="absolute top-0 right-0 w-24 h-24">
              <div className="absolute top-0 right-0 w-full h-1 bg-teal-400 rounded-full" />
              <div className="absolute top-0 right-0 w-1 h-full bg-teal-400 rounded-full" />
            </div>

            {/* Bottom Left Corner */}
            <div className="absolute bottom-0 left-0 w-24 h-24">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-teal-400 rounded-full" />
              <div className="absolute bottom-0 left-0 w-1 h-full bg-teal-400 rounded-full" />
            </div>

            {/* Bottom Right Corner */}
            <div className="absolute bottom-0 right-0 w-24 h-24">
              <div className="absolute bottom-0 right-0 w-full h-1 bg-teal-400 rounded-full" />
              <div className="absolute bottom-0 right-0 w-1 h-full bg-teal-400 rounded-full" />
            </div>

            {markerDetected && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 shadow-2xl w-64 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                {/* Marker Icon */}
                <div className="w-32 h-32 mb-4 relative">
                  <div className="absolute inset-0 border-8 border-black rounded-lg" />
                  <div className="absolute inset-4 border-8 border-black rounded-sm" />
                  <div className="absolute inset-8 bg-black rounded-sm" />
                </div>

                {/* Text */}
                <h2 className="text-gray-900 font-bold text-lg mb-2">AR MARKER</h2>
                <p className="text-gray-500 text-sm">ID: 001</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Instructions */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center px-4">
          <div className="bg-black/80 px-8 py-4 rounded-full">
            <p className="text-white text-center text-sm font-medium">
              ARマーカーにカメラを
              <br />
              向けてください
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
