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
          <div className="flex min-h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden lg:block lg:w-[250px] bg-white p-6">
              <SideMenu />
            </aside>

            {/* Main area */}
            <div className="flex flex-1 flex-col overflow-hidden">
              <TopMenu />

              <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
                <div className="max-w-5xl mx-auto w-full">{children}</div>
              </main>
            </div>
          </div>

          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}