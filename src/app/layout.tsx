import type { Metadata } from "next";
import { Flamenco, Fragment_Mono } from "next/font/google";
import "./globals.css";

const flamenco = Flamenco({
  variable: "--font-flamenco",
  weight: "400",
  subsets: ["latin"],
});

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "김찬혁 ♥ 김혜민 결혼합니다",
  description: "2026년 9월 5일 토요일 오후 2시, 잠실 더컨벤션 아모르홀에서 김찬혁과 김혜민의 결혼식이 있습니다.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "김찬혁 ♥ 김혜민 결혼합니다",
    description: "2026년 9월 5일 토요일 오후 2시, 잠실 더컨벤션 아모르홀에서 김찬혁과 김혜민의 결혼식이 있습니다.",
    images: [
      {
        url: "/images/wedding/hero.png",
        width: 1500,
        height: 2250,
        alt: "김찬혁, 김혜민 웨딩 사진",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "김찬혁 ♥ 김혜민 결혼합니다",
    description: "2026년 9월 5일 토요일 오후 2시, 잠실 더컨벤션 아모르홀에서 김찬혁과 김혜민의 결혼식이 있습니다.",
    images: ["/images/wedding/hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${flamenco.variable} ${fragmentMono.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-neutral-100">{children}</body>
    </html>
  );
}
