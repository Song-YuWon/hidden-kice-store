import type { Metadata } from "next";
import { Footer } from "@/shared/layout/Footer";
import { Gnb } from "@/shared/layout/Gnb";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "히든카이스 스토어",
  description: "2026 히든카이스 교재 스토어",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col bg-white font-sans antialiased">
        <Providers>
          <Gnb />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
