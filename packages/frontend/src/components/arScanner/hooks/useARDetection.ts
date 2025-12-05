import { useEffect, useState, RefObject } from "react";
import {
  CAMERA_PARAM_URL,
  MARKER_RESET_TIME_MS,
} from "@/components/arScanner/constants";
import type { ARController } from "@/components/arScanner/types";

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

    if (!context) {
      console.error("2Dコンテキストの取得に失敗しました。");
      return;
    }

    // クリーンアップ用の変数
    let animationFrameId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let arController: ARController | null = null;
    let markerEventHandler: ((event: any) => void) | null = null;
    let metadataEventHandler: (() => void) | null = null;

    // AR.jsの初期化
    const initAR = async () => {
      if (typeof window !== "undefined" && window.ARController) {
        try {
          arController = new window.ARController(canvas, CAMERA_PARAM_URL);

          // マーカー検出イベントハンドラー
          markerEventHandler = (event) => {
            console.log("[v0] マーカー検出:", event.data.marker.id);
            setMarkerDetected(true);

            // 既存のタイマーをクリア
            if (timeoutId) {
              clearTimeout(timeoutId);
            }

            // 3秒後にリセット
            timeoutId = setTimeout(
              () => setMarkerDetected(false),
              MARKER_RESET_TIME_MS,
            );
          };

          arController.addEventListener("getMarker", markerEventHandler);

          // ビデオフレームの処理
          const processFrame = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              context.drawImage(video, 0, 0, canvas.width, canvas.height);

              // AR処理
              arController?.detectMarker(
                context.getImageData(0, 0, canvas.width, canvas.height),
              );
            }
            animationFrameId = requestAnimationFrame(processFrame);
          };

          // メタデータ読み込みイベントハンドラー
          metadataEventHandler = () => {
            processFrame();
          };

          video.addEventListener("loadedmetadata", metadataEventHandler);
        } catch (error) {
          console.error("[v0] AR初期化エラー:", error);
        }
      }
    };

    initAR();

    // クリーンアップ関数
    return () => {
      // requestAnimationFrameの停止
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      // setTimeoutのキャンセル
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      // イベントリスナーの削除
      if (
        arController &&
        markerEventHandler &&
        arController.removeEventListener
      ) {
        arController.removeEventListener("getMarker", markerEventHandler);
      }

      if (video && metadataEventHandler) {
        video.removeEventListener("loadedmetadata", metadataEventHandler);
      }

      // ARControllerの破棄（可能な場合）
      if (arController?.dispose) {
        arController.dispose();
      }
    };
  }, [isARLoaded, videoRef, canvasRef]);

  return markerDetected;
}
