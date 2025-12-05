/**
 * カメラ関連のユーティリティ関数
 */

import { CAMERA_CONFIG } from "../constants";

/**
 * カメラストリームを取得する
 * リアカメラを優先的に試し、失敗した場合はフロントカメラを試す
 * @returns カメラストリーム、またはエラーが発生した場合はnull
 */
export async function requestCameraStream(): Promise<MediaStream | null> {
  try {
    // まずリアカメラを試す
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: CAMERA_CONFIG.facingMode },
        width: CAMERA_CONFIG.width,
        height: CAMERA_CONFIG.height,
      },
      audio: false,
    });
  } catch (err) {
    console.log("リアカメラの取得に失敗、フロントカメラを試行中...");

    try {
      // リアカメラが利用できない場合、フロントカメラを試す
      return await navigator.mediaDevices.getUserMedia({
        video: {
          width: CAMERA_CONFIG.width,
          height: CAMERA_CONFIG.height,
        },
        audio: false,
      });
    } catch (fallbackErr) {
      console.error("カメラアクセスエラー:", fallbackErr);
      throw fallbackErr;
    }
  }
}

/**
 * カメラの許可を取得する（ストリームは即座に停止）
 * ユーザー操作として認識されるため、許可ダイアログを表示するために使用
 * @returns 許可が取得できた場合はtrue、失敗した場合はfalse
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    const stream = await requestCameraStream();
    if (stream) {
      // 許可を取得したら、ストリームを即座に停止
      stream.getTracks().forEach((track) => track.stop());
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * カメラストリームを停止する
 */
export function stopCameraStream(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
      console.log("カメラストップ:", track.label);
    });
  }
}
