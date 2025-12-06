"use client";

import { useEffect, useState, type RefObject } from "react";

export function useCamera(
  videoRef: RefObject<HTMLVideoElement>,
  isReady: boolean,
) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // クリーンアップ関数で使用するために現在の値をコピー
    const videoElement = videoRef.current;

    if (!isReady) return;

    async function startCamera() {
      try {
        // まずリアカメラを試す
        let stream: MediaStream | null = null;

        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch (err) {
          console.log("[v0] リアカメラの取得に失敗、フロントカメラを試行中...");
          // リアカメラが利用できない場合、フロントカメラを試す
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        }

        if (stream && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.setAttribute("webkit-playsinline", "true");

          await videoRef.current.play();
          console.log("[v0] カメラ起動成功");
        }
      } catch (err) {
        console.error("[v0] カメラアクセスエラー:", err);
        setError(
          err instanceof Error
            ? `カメラエラー: ${err.message}`
            : "カメラにアクセスできません。ブラウザの設定でカメラ権限を許可してください。",
        );
      }
    }

    startCamera();

    return () => {
      // コピーした変数を使用してクリーンアップ
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("[v0] カメラストップ:", track.label);
        });
      }
    };
  }, [videoRef, isReady]);

  return { error };
}
