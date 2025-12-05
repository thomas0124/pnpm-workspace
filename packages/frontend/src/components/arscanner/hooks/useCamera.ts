import { useEffect, RefObject } from "react";
import { CAMERA_CONFIG } from "@/components/arscanner/constants";

export function useCamera(
  videoRef: RefObject<HTMLVideoElement>,
  isARLoaded: boolean,
) {
  useEffect(() => {
    if (!isARLoaded) return;

    // カメラストリームの取得
    navigator.mediaDevices
      .getUserMedia({
        video: CAMERA_CONFIG,
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
  }, [isARLoaded, videoRef]);
}
