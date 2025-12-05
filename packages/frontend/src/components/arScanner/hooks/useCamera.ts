"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type RefObject,
} from "react";
import { requestCameraStream, stopCameraStream } from "../utils/cameraUtils";

export function useCamera(
  videoRef: RefObject<HTMLVideoElement>,
  isReady: boolean,
) {
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    if (!isReady || !videoRef.current) {
      return;
    }

    try {
      setError(null);
      const stream = await requestCameraStream();

      if (stream && videoRef.current) {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.setAttribute("webkit-playsinline", "true");

        await videoRef.current.play();
        setIsCameraActive(true);
        console.log("カメラ起動成功");
      }
    } catch (err) {
      console.error("カメラアクセスエラー:", err);
      setError(
        err instanceof Error
          ? `カメラエラー: ${err.message}`
          : "カメラにアクセスできません。ブラウザの設定でカメラ権限を許可してください。",
      );
      setIsCameraActive(false);
    }
  }, [videoRef, isReady]);

  // クリーンアップ処理
  useEffect(() => {
    return () => {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    };
  }, []);

  return { error, isCameraActive, startCamera };
}
