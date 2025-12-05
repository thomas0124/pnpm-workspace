import {
  useEffect,
  useState,
  useRef,
  type RefObject,
  useCallback,
} from "react";

// 3つのマーカー定義
const MARKERS = [
  { id: 1, src: "/AR-Marker.png" },
  { id: 2, src: "/AR-Marker2.png" },
  { id: 3, src: "/AR-Marker3.png" },
];

export function useARDetection(
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  isReady: boolean,
) {
  // 検出したマーカーID
  const [detectedMarkerId, setDetectedMarkerId] = useState<number | null>(null);

  // 処理中フラグ（検出成功後もtrueのままにして再検出を防ぐ＝ロックする）
  const [isProcessing, setIsProcessing] = useState(false);

  // 読み込んだ画像オブジェクトを保持するRef（元のロジックに戻す）
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);

  // マーカー画像の読み込み（元のロジックに戻す）
  useEffect(() => {
    const loadImages = () => {
      const images: HTMLImageElement[] = [];
      MARKERS.forEach((marker) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = marker.src;
        images.push(img);
      });
      loadedImagesRef.current = images;
    };

    loadImages();
  }, []);

  // 検出のリセット関数（永続化解除用）
  const resetDetection = useCallback(() => {
    setDetectedMarkerId(null);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    if (!isReady || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) return;

    let animationId: number;

    const detectMarker = () => {
      // 既に検出済み（ロック中）ならループを止める
      if (isProcessing) {
        return;
      }

      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationId = requestAnimationFrame(detectMarker);
        return;
      }

      // ビデオフレームを描画（元のロジック）
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 中央部分を比較用データとして取得（元のロジック）
      const sampleSize = 200;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const videoData = context.getImageData(
        centerX - sampleSize / 2,
        centerY - sampleSize / 2,
        sampleSize,
        sampleSize,
      );

      // 比較用の一時Canvasを作成
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = sampleSize;
      tempCanvas.height = sampleSize;
      const tempContext = tempCanvas.getContext("2d");

      if (!tempContext) {
        animationId = requestAnimationFrame(detectMarker);
        return;
      }

      // 全てのマーカー画像と比較
      for (let i = 0; i < loadedImagesRef.current.length; i++) {
        const markerImg = loadedImagesRef.current[i];

        // 画像が読み込まれていなければスキップ
        if (!markerImg.complete || markerImg.naturalWidth === 0) continue;

        // --- 画像のトリミングと描画 ---
        const size = Math.min(markerImg.width, markerImg.height);
        const sx = (markerImg.width - size) / 2;
        const sy = (markerImg.height - size) / 2;

        tempContext.clearRect(0, 0, sampleSize, sampleSize);
        tempContext.drawImage(
          markerImg,
          sx,
          sy,
          size,
          size,
          0,
          0,
          sampleSize,
          sampleSize,
        );

        const markerData = tempContext.getImageData(
          0,
          0,
          sampleSize,
          sampleSize,
        );

        // --- 色差分比較（元のロジック） ---
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

        const similarity = 1 - difference / (sampleSize * sampleSize * 3 * 255);

        // 類似度が75%以上の場合、検出とみなす
        if (similarity > 0.75) {
          // ★変更点: setTimeoutでのリセットを廃止し、ロックのみ行う
          setIsProcessing(true);
          setDetectedMarkerId(MARKERS[i].id);

          console.log(
            `Marker ${MARKERS[i].id} detected! Similarity: ${similarity}`,
          );

          // ループを抜ける
          break;
        }
      }

      // ロックされていない場合のみ次のフレームをリクエスト
      if (!isProcessing) {
        animationId = requestAnimationFrame(detectMarker);
      }
    };

    detectMarker();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [videoRef, canvasRef, isReady, isProcessing]); // isProcessingを依存配列に含めることで、リセット時に再開される

  return { detectedMarkerId, resetDetection };
}
