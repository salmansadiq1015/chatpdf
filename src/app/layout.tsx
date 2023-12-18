import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { cn, constructMetadata } from "@/lib/utils";
import { Inter } from "next/font/google";
import "./globals.css";

import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Upgrade from "@/components/Upgrade";
import { db } from "@/db";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatDoc.ai",
  description: "AI Saas Application chatbase.ai ",
  icons: "/infradev.cloud.png",
};

// export const metadata = constructMetadata()

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let uploadedFiles: any[] = [];
  const { getUser } = getKindeServerSession();

  const user = getUser();

  if (user) {
    uploadedFiles = await db.file.findMany({
      where: {
        userId: user?.id,
      },
    });
  }

  const subscriptionPlan = await getUserSubscriptionPlan();

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
          <div className="relative">
            {children}

            <div className="fixed bottom-1 left-1 z-50">
              <Upgrade
                file={user?.id ? uploadedFiles.length : 0}
                subscription={subscriptionPlan.isSubscribed}
              />
            </div>
          </div>

          {/* <!-- Animation --> */}
          <ToastContainer />
        </body>
      </Providers>
    </html>
  );
}
