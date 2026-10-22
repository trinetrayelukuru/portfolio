import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../components/SplashCursor.css";
import MotionProvider from "../components/MotionProvider";
import SplashCursorLayer from "../components/SplashCursorLayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yelukuru Trinetra Naga Sai | AI Engineer & Full-Stack Developer",
  description:
    "AI Engineer, Full-Stack Developer and IoT enthusiast building intelligent systems, AI applications and modern web experiences.",
  keywords: [
    "AI Engineer",
    "Full-Stack Developer",
    "IoT",
    "LLM",
    "React",
    "Next.js",
    "Python",
    "portfolio",
  ],
  authors: [{ name: "Yelukuru Trinetra Naga Sai" }],
  creator: "Yelukuru Trinetra Naga Sai",
  openGraph: {
    title: "Yelukuru Trinetra Naga Sai | AI Engineer & Full-Stack Developer",
    description:
      "AI Engineer, Full-Stack Developer and IoT enthusiast building intelligent systems, AI applications and modern web experiences.",
    type: "website",
    siteName: "Trinetra Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yelukuru Trinetra Naga Sai | AI Engineer & Full-Stack Developer",
    description:
      "AI Engineer, Full-Stack Developer and IoT enthusiast building intelligent systems, AI applications and modern web experiences.",
  },
  icons: {
    icon: "/logo.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The inline script in <body> sets data-fx on <html> before React hydrates;
  // suppressHydrationWarning tells React to keep the DOM value (the persisted
  // FX level) instead of treating the attribute as a hydration mismatch.
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Apply the persisted FX level before hydration to avoid a flash of heavy layers */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var v=localStorage.getItem("trinetra:fx-level");if(v==="full"||v==="subtle"||v==="off"){document.documentElement.dataset.fx=v;}}catch(e){}',
          }}
        />
        <MotionProvider>
          <SplashCursorLayer />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
