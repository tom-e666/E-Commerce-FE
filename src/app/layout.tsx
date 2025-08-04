import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Menubar from "@/app/Menubar";
import Footer from "@/app/Footer";
import Provider from "./ApolloProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Script from "next/script";
import React, { Suspense } from "react";

// Dynamic import ZaloChatWidget để tránh SSR issues
const ClientZaloChatWidget = React.lazy(
  () => import("../components/ClientZaloChatWidget")
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EMS Electronics | Laptop Gaming & Máy Tính Chất Lượng Cao",
    template: "%s | EMS Electronics",
  },
  description:
    "Cửa hàng laptop gaming, máy tính và phụ kiện công nghệ hàng đầu Việt Nam. Sản phẩm chính hãng, giá tốt, bảo hành uy tín. Miễn phí giao hàng toàn quốc.",
  keywords: [
    "laptop gaming",
    "máy tính",
    "laptop",
    "gaming",
    "MSI",
    "Acer",
    "ASUS",
    "Dell",
    "HP",
    "phụ kiện gaming",
    "màn hình gaming",
    "bàn phím gaming",
    "chuột gaming",
  ],
  authors: [{ name: "EMS Electronics" }],
  creator: "EMS Electronics",
  publisher: "EMS Electronics",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://tempure.id.vn"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EMS Electronics | Laptop Gaming & Máy Tính Chất Lượng Cao",
    description:
      "Cửa hàng laptop gaming, máy tính và phụ kiện công nghệ hàng đầu Việt Nam. Sản phẩm chính hãng, giá tốt, bảo hành uy tín.",
    url: "/",
    siteName: "EMS Electronics",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "EMS Electronics - Laptop Gaming và Máy Tính",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMS Electronics | Laptop Gaming & Máy Tính Chất Lượng Cao",
    description:
      "Cửa hàng laptop gaming, máy tính và phụ kiện công nghệ hàng đầu Việt Nam. Sản phẩm chính hãng, giá tốt, bảo hành uy tín.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" dir="ltr">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* Theme color */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />

        {/* Additional SEO meta tags */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="language" content="Vietnamese" />
        <meta name="geo.region" content="VN" />
        <meta name="geo.country" content="Vietnam" />

        {/* Schema.org structured data */}
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "EMS Electronics",
            url: process.env.NEXT_PUBLIC_BASE_URL || "https://tempure.id.vn/",
            logo: `${
              process.env.NEXT_PUBLIC_BASE_URL || "https://tempure.id.vn/"
            }/logo.png`,
            sameAs: [
              "https://www.facebook.com/emselectronics",
              "https://zalo.me/emselectronics",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+84-xxx-xxx-xxx",
              contactType: "customer service",
              areaServed: "VN",
              availableLanguage: "Vietnamese",
            },
          })}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <AuthProvider>
            <div className="flex flex-col w-full min-h-screen">
              <Menubar />
              <main className="flex-grow w-full flex pb-8">
                {" "}
                {/* Added padding bottom */}
                <div className="w-full">
                  {children}
                  <Toaster />
                </div>
              </main>
              <Footer />
              {/* Zalo Chat Widget */}
              <Suspense fallback={null}>
                <ClientZaloChatWidget />
              </Suspense>
            </div>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
