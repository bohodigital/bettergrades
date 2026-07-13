import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "mathlive/fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bettergrades.net"),
  title: {
    default: "Better Grades — Free answers, full explanations",
    template: "%s | Better Grades",
  },
  description:
    "Free academic answers, complete calculus explanations, practical calculators, and practice that teaches the next problem too.",
  applicationName: "Better Grades",
  keywords: [
    "free math answers",
    "calculus help",
    "integration practice",
    "math calculators",
    "step by step solutions",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Better Grades",
    title: "Find the answer. Understand the method.",
    description: "The answer is free. Understanding it is the point.",
    url: "https://bettergrades.net",
    images: [
      {
        url: "https://bettergrades.net/og.png",
        width: 1200,
        height: 630,
        alt: "Better Grades — Find the answer. Understand the method.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find the answer. Understand the method.",
    description: "Free answers, complete explanations, better practice.",
    images: ["https://bettergrades.net/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('bg-theme')||'auto';var d=t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.dataset.themeChoice=t}catch(e){}})()`,
          }}
        />
        <script
          defer
          src="https://analytics.bohodigitalservices.com/script.js"
          data-website-id="7810f828-f3f0-4296-95e3-e01e8c37f234"
          data-domains="bettergrades.net,www.bettergrades.net"
          data-do-not-track="true"
          data-exclude-search="true"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
