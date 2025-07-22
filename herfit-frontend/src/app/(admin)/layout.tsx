import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/atomics/toaster";
import ReduxProvider from "@/providers/redux";
import DashboardShell from "@/components/molecules/admin/dashboard-shell";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${poppins.className} min-h-screen bg-gray-light overflow-x-hidden`}>
        <ReduxProvider>
          <DashboardShell>{children}</DashboardShell>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}