import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 例: 環境変数からベースURLを取得
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: "えあパンフ",
  description: "AR機能付きデジタルパンフレット",
  openGraph: {
    title: "えあパンフ",
    description: "AR機能付きデジタルパンフレット",
    url: baseUrl,
    siteName: "えあパンフ",
    images: [
      {
        url: `${baseUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
    type: "website",
  },
  // Twitterカードも設定すると、Twitterでの共有時により良い表示になります
  twitter: {
    card: "summary_large_image",
    title: "えあパンフ",
    description: "AR機能付きデジタルパンフレット",
    images: [`${baseUrl}/opengraph-image.png`],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
