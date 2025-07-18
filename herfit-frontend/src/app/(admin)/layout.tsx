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
  // Menambahkan viewport meta agar mobile support
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-gray-light min-h-screen`}>
        <ReduxProvider>
          <div className="flex flex-col md:flex-row md:space-x-6 p-4 md:p-6 container mx-auto">
            <div className="w-full md:w-[250px]">
              <SideMenu />
            </div>
            <div className="flex-1">
              <TopMenu />
              <div className="py-4 md:py-6">{children}</div>
            </div>
          </div>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}