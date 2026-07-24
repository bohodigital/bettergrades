import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";

const GOOGLE_ANALYTICS_ID = "G-9X96S9GZQ2";

export const metadata: Metadata = {
  metadataBase: new URL("https://bettergrades.net"),
  title: {
    default: "Better Grades — Free answers, full explanations",
    template: "%s | Better Grades",
  },
  description:
    "Free academic answers, complete calculus explanations, practical calculators, and practice that teaches the next problem too.",
  applicationName: "Better Grades",
  manifest: "/site.webmanifest",
  themeColor: "#125d50",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
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
        <style>{`
            .practice-progress button,
            .resource-downloads button,
            .limits-check form,
            .calculus-attempt-reveal button,
            .interactive-only {
              visibility: hidden;
            }
            html.js .practice-progress button,
            html.js .resource-downloads button,
            html.js .limits-check form,
            html.js .calculus-attempt-reveal button,
            html.js .interactive-only {
              visibility: visible;
            }
          `}</style>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", "@id": "https://bettergrades.net/#organization", name: "Better Grades", alternateName: "BetterGrades.net", url: "https://bettergrades.net/", logo: { "@type": "ImageObject", url: "https://bettergrades.net/icon-512.png", contentUrl: "https://bettergrades.net/icon-512.png", width: 512, height: 512 }, image: "https://bettergrades.net/icon-512.png" },
            { "@type": "WebSite", "@id": "https://bettergrades.net/#website", url: "https://bettergrades.net/", name: "Better Grades", publisher: { "@id": "https://bettergrades.net/#organization" }, inLanguage: "en-US" },
          ],
        }) }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('bg-theme')||'auto';var d=t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.dataset.themeChoice=t}catch(e){}})()`,
          }}
        />
        <script
          data-bettergrades-ga4={GOOGLE_ANALYTICS_ID}
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var publicHosts={"bettergrades.net":true,"www.bettergrades.net":true};
  if(!publicHosts[window.location.hostname.toLowerCase()])return;
  if(navigator.doNotTrack==='1'||window.doNotTrack==='1')return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());
  window.gtag('config','${GOOGLE_ANALYTICS_ID}',{
    anonymize_ip:true,
    allow_google_signals:false,
    allow_ad_personalization_signals:false
  });
  var loader=document.createElement('script');
  loader.async=true;
  loader.src='https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}';
  document.head.appendChild(loader);
})();`,
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
