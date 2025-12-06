import type { AppType } from "@uttk/backend";
import { hc } from "hono/client";

// ビルド時はダミーのURLを使用し、実行時にチェックする
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

// 実行時（ブラウザ）でのみ環境変数をチェック
if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    "NEXT_PUBLIC_API_URL is not set, using default: http://localhost:8787",
  );
}

export const client = hc<AppType>(baseUrl);

export default client;
