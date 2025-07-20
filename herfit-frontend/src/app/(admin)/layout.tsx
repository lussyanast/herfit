import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import TopMenu from "@/components/molecules/admin/top-menu";
import SideMenu from "@/components/molecules/admin/side-menu";
import { Toaster } from "@/components/atomics/toaster";
import ReduxProvider from "@/providers/redux";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HerFit Ladies Gym",
  description: "Ladies Gym",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.className} min-h-screen bg-gray-light overflow-x-hidden`}>
        <ReduxProvider>
          <div className="flex min-h-screen">
            <SideMenu />
            <div className="flex-1 flex flex-col">
              <TopMenu />
              <main className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-[30px] w-full max-w-[1440px] mx-auto">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}