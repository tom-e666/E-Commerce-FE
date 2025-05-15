import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Menubar from "@/app/Menubar";
// import Footer from "@/app/Footer";
import Provider from "./ApolloProvider";
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🔥🔨💻🔥",
  description: "We sell laptops",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider>
          <AuthProvider>
            <div className="flex flex-col w-full min-h-screen justify-center items-center">
              <Menubar />
              <div className="flex flex-grow w-full justify-center items-center">
                {children}
                <Toaster />
              </div>
              {/* <Footer /> */}
            </div>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
