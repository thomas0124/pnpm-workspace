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

// 比較時の解像度（小さくすることでノイズやズレに強くなる）
const COMPARE_SIZE = 64;

export function useARDetection(
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  isReady: boolean,
) {
  // 検出したマーカーID
  const [detectedMarkerId, setDetectedMarkerId] = useState<number | null>(null);

  // 処理中フラグ（検出成功後もtrueのままにして再検出を防ぐ＝ロックする）
  const [isProcessing, setIsProcessing] = useState(false);

  // 読み込んだマーカーの比較用データ（グレースケール）を保持
  const markerDataRef = useRef<
    { id: number; data: Uint8ClampedArray; mean: number }[]
  >([]);

  // グレースケール変換と平均輝度計算を行うヘルパー関数
  const getGrayscaleData = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const gray = new Uint8ClampedArray(width * height);
    let total = 0;

    for (let i = 0; i < width * height; i++) {
      // 輝度計算 (R:0.299, G:0.587, B:0.114)
      const g =
        data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114;
      gray[i] = g;
      total += g;
    }

    return { data: gray, mean: total / (width * height) };
  };

  // マーカー画像の読み込みと事前処理
  useEffect(() => {
    const loadMarkers = async () => {
      const processedMarkers: {
        id: number;
        data: Uint8ClampedArray;
        mean: number;
      }[] = [];

      // オフスクリーンCanvas作成
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = COMPARE_SIZE;
      tempCanvas.height = COMPARE_SIZE;
      const ctx = tempCanvas.getContext("2d", { willReadFrequently: true });

      if (!ctx) return;

      const promises = MARKERS.map((marker) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = marker.src;
          img.onload = () => {
            // マーカーを正方形にトリミングして描画
            const size = Math.min(img.width, img.height);
            const sx = (img.width - size) / 2;
            const sy = (img.height - size) / 2;

            ctx.clearRect(0, 0, COMPARE_SIZE, COMPARE_SIZE);
            ctx.drawImage(
              img,
              sx,
              sy,
              size,
              size,
              0,
              0,
              COMPARE_SIZE,
              COMPARE_SIZE,
            );

            // グレースケールデータとして保存
            const { data, mean } = getGrayscaleData(
              ctx,
              COMPARE_SIZE,
              COMPARE_SIZE,
            );
            processedMarkers.push({ id: marker.id, data, mean });
            resolve();
          };
          img.onerror = () => resolve(); // エラーでも止まらないように
        });
      });

      await Promise.all(promises);
      markerDataRef.current = processedMarkers;
    };

    loadMarkers();
  }, []);

  // 検出のリセット関数
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
    let frameCount = 0;

    const detectMarker = () => {
      // 既に検出済み（ロック中）ならループを止める
      if (isProcessing) return;

      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationId = requestAnimationFrame(detectMarker);
        return;
      }

      // 毎フレーム処理すると重いので、3フレームに1回程度に間引く
      frameCount++;
      if (frameCount % 3 !== 0) {
        animationId = requestAnimationFrame(detectMarker);
        return;
      }

      // ビデオフレームから中央部分を取得
      // 比較用サイズ(COMPARE_SIZE)に直接縮小して描画
      const minVideoSize = Math.min(video.videoWidth, video.videoHeight);
      const sx = (video.videoWidth - minVideoSize) / 2;
      const sy = (video.videoHeight - minVideoSize) / 2;

      canvas.width = COMPARE_SIZE;
      canvas.height = COMPARE_SIZE;

      // 中央を正方形に切り抜いて縮小描画
      context.drawImage(
        video,
        sx,
        sy,
        minVideoSize,
        minVideoSize, // ソース: 中央切り抜き
        0,
        0,
        COMPARE_SIZE,
        COMPARE_SIZE, // 出力: 縮小
      );

      // ビデオ映像のグレースケール化
      const videoGray = getGrayscaleData(context, COMPARE_SIZE, COMPARE_SIZE);

      // 全てのマーカーと比較
      for (const marker of markerDataRef.current) {
        let diffSum = 0;

        // 明るさの補正係数 (マーカーの明るさに合わせる)
        // ゼロ除算防止のため最小値を設定
        const brightnessRatio = marker.mean / (videoGray.mean || 1);

        for (let i = 0; i < videoGray.data.length; i++) {
          // ビデオの画素値を明るさ補正して比較
          const vVal = videoGray.data[i] * brightnessRatio;
          const mVal = marker.data[i];
          diffSum += Math.abs(vVal - mVal);
        }

        // 平均誤差 (0〜255)
        const avgDiff = diffSum / videoGray.data.length;

        // 類似スコア (1.0 = 完全一致)
        // 誤差が小さいほど似ている。閾値は調整が必要だが、平均誤差40程度以下なら合格とする
        // 255 - avgDiff でスコア化
        const similarity = Math.max(0, (255 - avgDiff) / 255);

        // 閾値を設定 (0.85 = 85%一致なら検出)
        // 条件を緩和したい場合はこの値を下げる (例: 0.8)
        if (similarity > 0.8) {
          console.log(
            `Marker ${marker.id} detected! Score: ${similarity.toFixed(2)}`,
          );

          setDetectedMarkerId(marker.id);
          setIsProcessing(true); // 処理を停止してロック
          break;
        }
      }

      if (!isProcessing) {
        animationId = requestAnimationFrame(detectMarker);
      }
    };

    detectMarker();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [videoRef, canvasRef, isReady, isProcessing]);

  return { detectedMarkerId, resetDetection };
}
