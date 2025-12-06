import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "えあパンフ",
  description: "学祭に使えるデジタルパンフレット",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    title: "えあパンフ",
    description: "AR機能付きデジタルパンフレット",
    url: "https://ar-pamph-frontend-preview-pr-66.sekibun3109.workers.dev/",
    siteName: "えあパンフ",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
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
