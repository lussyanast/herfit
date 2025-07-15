'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/atomics/button';
import Image from 'next/image';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atomics/dropdown-menu';
import Title from '@/components/atomics/title';
import { signOut, useSession } from 'next-auth/react';

function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="container mx-auto fixed top-5 inset-x-0 z-30">
      <div className="bg-white shadow-lg rounded-2xl px-5 md:px-8 py-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo.png" alt="HerFit Logo" width={55} height={18} priority />
        </Link>

        {/* Navigation Menu */}
        <nav className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 text-sm font-medium text-gray-700">
          <Link href="/#about-section" className="hover:text-gray-900 transition">Tentang Kami</Link>
          <Link href="/#benefits-section" className="hover:text-gray-900 transition">Fasilitas</Link>
          <Link href="/#membership-listing" className="hover:text-gray-900 transition">Membership</Link>
          <Link href="/#other-listing" className="hover:text-gray-900 transition">Produk</Link>
          <Link href="/#location-section" className="hover:text-gray-900 transition">Lokasi</Link>
          <Link href="/#faq-section" className="hover:text-gray-900 transition">FAQ</Link>
          <Link href="/#contact-section" className="hover:text-gray-900 transition">Hubungi Kami</Link>
          <Link href="/chat" className="hover:text-gray-900 transition">Chatbot AI</Link>
        </nav>

        {/* Auth Buttons (when not logged in) */}
        {!session?.user && (
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="header">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button variant="default" size="header" className="shadow-button">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}

        {/* User Dropdown (when logged in) */}
        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="text-sm font-bold text-gray-800 max-w-[120px] truncate">
                  {session.user.nama_lengkap}
                </div>
                <Image
                  src={
                    session.user.foto_profil
                      ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${session.user.foto_profil}`
                      : '/images/avatar.png'
                  }
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover border"
                  unoptimized
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px] mt-2 shadow-lg border bg-white rounded-md">
              <DropdownMenuItem>
                <Link href="/dashboard" className="w-full">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

export default Header;