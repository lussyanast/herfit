import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/components/molecules/header';
import Footer from '@/components/molecules/footer';
import { Toaster } from '@/components/atomics/toaster';
import ReduxProvider from '@/providers/redux';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HerFit Ladies Gym',
  description: 'Ladies Gym',
  icons: {
    icon: '/logo.png',
  },
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen flex flex-col bg-white text-gray-900`}>
        <ReduxProvider>
          <Header />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}