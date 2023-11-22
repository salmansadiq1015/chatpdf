import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { cn, constructMetadata } from "@/lib/utils";
import { Inter } from "next/font/google";
import "./globals.css";

import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import Footer from "@/components/Footer";
<link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />;
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatDoc.ai",
  description: "AI Saas Application chatbase.ai ",
  icons: "/infradev.cloud.png",
};

// export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body
          className={cn(
            "min-h-screen font-sans antialiased grainy",
            inter.className
          )}
        >
          <Toaster />
          <Navbar />
          {children}
          <Footer />
          {/* <!-- Animation --> */}
          <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
          <script>AOS.init();</script>
          <ToastContainer />
        </body>
      </Providers>
    </html>
  );
}
