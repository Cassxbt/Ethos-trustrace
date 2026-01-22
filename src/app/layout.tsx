import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RainbowKitProviderWrapper } from "@/components/providers/rainbowkit-provider";
import { Navigation } from "@/components/layout/Navigation";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustRace - Credibility-Weighted Contest Platform",
  description: "Create and participate in contests powered by Ethos credibility scores",
  keywords: ["blockchain", "contests", "ethos", "credibility", "web3", "base"],
  authors: [{ name: "TrustRace Team" }],
  openGraph: {
    title: "TrustRace",
    description: "Credibility-weighted contest platform powered by Ethos",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustRace",
    description: "Credibility-weighted contest platform powered by Ethos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ToastProvider>
            <RainbowKitProviderWrapper>
              {/* Noise overlay for texture */}
              <div className="noise-overlay" />

              <div className="min-h-screen">
                <Navigation />
                {/* Main content with padding for fixed nav */}
                <main className="pt-20">{children}</main>
              </div>
            </RainbowKitProviderWrapper>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
