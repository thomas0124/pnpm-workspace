// AR.js関連の定数

export const AR_JS_CDN_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/jsartoolkit5/5.3.2/artoolkit.min.js";

export const CAMERA_PARAM_URL = "/data/camera_para.dat";

export const CAMERA_CONFIG = {
  facingMode: "environment" as const,
  width: { ideal: 1280 },
  height: { ideal: 720 },
} as const;

export const MARKER_RESET_TIME_MS = 3000;
