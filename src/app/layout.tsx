import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "MyFinanceGuru",
  description: "Personal finance and cashflow tracker",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MyFinanceGuru",
  },
  openGraph: {
    title: "MyFinanceGuru",
    description: "Personal finance and cashflow tracker",
    siteName: "MyFinanceGuru",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "MyFinanceGuru Preview",
      }
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen`}>{children}</body>
    </html>
  );
}
