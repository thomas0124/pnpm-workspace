import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "えあパンフ",
  description: "学祭に使えるデジタルパンフレット",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <meta property="og:type" content="website" />
      <meta property="og:title" content="えあパンフ" />
      <meta property="og:description" content="AR機能付きデジタルパンフレット" />
      <meta property="og:url" content="https://ar-pamph-frontend-preview-pr-65.sekibun3109.workers.dev/" />
      <meta property="og:site_name" content="えあパンフ" />
      <meta property="og:image" content="https://ar-pamph-frontend-preview-pr-65.sekibun3109.workers.dev/opengraph-image.png" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
        <body className={inter.className}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </body>
    </html>
  );
}
