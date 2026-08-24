import type { Metadata } from "next";
import "./globals.css";
import "./tutorial.css";

export const metadata: Metadata = {
  title: "Arc 한국어 빌드 가이드",
  description: "Foundry로 Arc 테스트넷에 첫 Solidity 스마트 컨트랙트를 배포하는 초보자용 한국어 가이드",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ko"><body>{children}</body></html>; }
