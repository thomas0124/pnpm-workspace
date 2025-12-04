import type { AppType } from "@uttk/backend";
import { hc } from "hono/client";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export const client = hc<AppType>(baseUrl);

export default client;
