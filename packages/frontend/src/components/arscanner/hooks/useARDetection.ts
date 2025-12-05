import { useEffect, useState, RefObject } from "react";
import {
  CAMERA_PARAM_URL,
  MARKER_RESET_TIME_MS,
} from "@/components/arscanner/constants";
import type { ARController } from "@/components/arscanner/types";

export function useARDetection(
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  isARLoaded: boolean,
) {
  const [markerDetected, setMarkerDetected] = useState(false);

  useEffect(() => {
    if (!isARLoaded || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // AR.jsの初期化
    const initAR = async () => {
      if (typeof window !== "undefined" && window.ARController) {
        try {
          const arController: ARController = new window.ARController(
            canvas,
            CAMERA_PARAM_URL,
          );

          arController.addEventListener("getMarker", (event) => {
            console.log("[v0] マーカー検出:", event.data.marker.id);
            setMarkerDetected(true);

            // 3秒後にリセット
            setTimeout(() => setMarkerDetected(false), MARKER_RESET_TIME_MS);
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
  }, [isARLoaded, videoRef, canvasRef]);

  return markerDetected;
}
