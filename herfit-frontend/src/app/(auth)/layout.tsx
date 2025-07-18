import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '@/app/globals.css';
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
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
            <body className={`${poppins.className} bg-white text-black`}>
                <ReduxProvider>
                    <main className="min-h-screen">{children}</main>
                    <Toaster />
                </ReduxProvider>
            </body>
        </html>
    );
}