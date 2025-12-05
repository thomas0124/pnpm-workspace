import { useEffect, useState, type RefObject } from "react";

export function useARDetection(
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  isReady: boolean,
): boolean {
  const [markerDetected, setMarkerDetected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isReady || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) return;

    let animationId: number;
    const markerImage = new Image();
    markerImage.crossOrigin = "anonymous";
    markerImage.src = "./AR-Marker.png";

    const detectMarker = () => {
      if (
        video.readyState === video.HAVE_ENOUGH_DATA &&
        !isProcessing &&
        markerImage.complete
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 中央部分を比較
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const sampleSize = 200;

        const videoData = context.getImageData(
          centerX - sampleSize / 2,
          centerY - sampleSize / 2,
          sampleSize,
          sampleSize,
        );

        // マーカー画像との比較
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = sampleSize;
        tempCanvas.height = sampleSize;
        const tempContext = tempCanvas.getContext("2d");

        if (tempContext) {
          tempContext.drawImage(markerImage, 0, 0, sampleSize, sampleSize);
          const markerData = tempContext.getImageData(
            0,
            0,
            sampleSize,
            sampleSize,
          );

          // 色差分比較
          let difference = 0;
          for (let j = 0; j < videoData.data.length; j += 4) {
            const rDiff = Math.abs(videoData.data[j] - markerData.data[j]);
            const gDiff = Math.abs(
              videoData.data[j + 1] - markerData.data[j + 1],
            );
            const bDiff = Math.abs(
              videoData.data[j + 2] - markerData.data[j + 2],
            );
            difference += rDiff + gDiff + bDiff;
          }

          const similarity =
            1 - difference / (sampleSize * sampleSize * 3 * 255);

          // 類似度が75%以上の場合、マーカーとして認識
          if (similarity > 0.75) {
            setIsProcessing(true);
            setMarkerDetected(true);
            setTimeout(() => {
              setMarkerDetected(false);
              setIsProcessing(false);
            }, 5000);
          }
        }
      }

      animationId = requestAnimationFrame(detectMarker);
    };

    video.addEventListener("loadedmetadata", detectMarker);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [videoRef, canvasRef, isReady, isProcessing]);

  return markerDetected;
}
