import { useEffect, useState, useRef, type RefObject } from "react";

// 3つのマーカー定義
// public/markers/フォルダに配置されている前提です
const MARKERS = [
  { id: 1, src: "/AR-Marker.png" },
  { id: 2, src: "/AR-Marker2.png" },
  { id: 3, src: "/AR-Marker3.png" },
];

export function useARDetection(
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  isReady: boolean,
): number | null {
  // 戻り値を検知したマーカーID(number)またはnullに変更
  const [detectedMarkerId, setDetectedMarkerId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 読み込んだ画像オブジェクトを保持するRef
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);

  // マーカー画像の読み込み
  useEffect(() => {
    const loadImages = () => {
      const images: HTMLImageElement[] = [];
      MARKERS.forEach((marker) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = marker.src;
        // 読み込み完了を待たずに配列に追加し、検出ループ内でcompleteプロパティをチェックします
        images.push(img);
      });
      loadedImagesRef.current = images;
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!isReady || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) return;

    let animationId: number;

    const detectMarker = () => {
      // 処理中または動画の準備ができていない場合はスキップ
      if (video.readyState !== video.HAVE_ENOUGH_DATA || isProcessing) {
        animationId = requestAnimationFrame(detectMarker);
        return;
      }

      // ビデオフレームを描画
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 中央部分を比較用データとして取得
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

        // --- 色差分比較 ---
        let difference = 0;
        // 高速化のため、全ピクセルではなく間引いて比較しても良いが、ここでは全ピクセル比較
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

        // 類似度が75%以上の場合、このマーカーを検出したとみなす
        if (similarity > 0.75) {
          setIsProcessing(true);
          setDetectedMarkerId(MARKERS[i].id); // IDをセット (1, 2, or 3)
          console.log(
            `Marker ${MARKERS[i].id} detected! Similarity: ${similarity}`,
          );

          // 5秒間検出状態を保持してからリセット
          setTimeout(() => {
            setDetectedMarkerId(null);
            setIsProcessing(false);
          }, 5000);

          // ループを抜ける（同時に複数のマーカーは検出しない）
          break;
        }
      }

      if (!isProcessing) {
        animationId = requestAnimationFrame(detectMarker);
      }
    };

    // 検出開始
    if (video.readyState >= video.HAVE_METADATA) {
      detectMarker();
    } else {
      video.addEventListener("loadedmetadata", detectMarker);
    }

    return () => {
      cancelAnimationFrame(animationId);
      video.removeEventListener("loadedmetadata", detectMarker);
    };
  }, [videoRef, canvasRef, isReady, isProcessing]);

  return detectedMarkerId;
}
