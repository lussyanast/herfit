"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/atomics/button";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atomics/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#about-section", label: "Tentang Kami" },
    { href: "/#benefits-section", label: "Fasilitas" },
    { href: "/#membership-listing", label: "Membership" },
    { href: "/#other-listing", label: "Produk" },
    { href: "/#location-section", label: "Lokasi" },
    { href: "/#faq-section", label: "FAQ" },
    { href: "/#contact-section", label: "Hubungi Kami" },
    { href: "/chat", label: "Chatbot AI" },
  ];

  return (
    <header className="fixed top-5 inset-x-0 z-30 px-4">
      <div className="container mx-auto bg-white shadow-lg rounded-2xl px-5 md:px-8 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo.png" alt="HerFit Logo" width={55} height={18} priority />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-x-6 text-sm font-medium text-gray-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gray-900 transition">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        {!session?.user && (
          <div className="hidden lg:flex items-center space-x-2">
            <Button variant="secondary" size="header">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button variant="default" size="header" className="shadow-button">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}

        {/* Desktop User Dropdown */}
        {session?.user && (
          <div className="hidden lg:block">
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
                        : "/images/avatar.png"
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
          </div>
        )}

        {/* Mobile Hamburger Button */}
        <button onClick={() => setOpen(true)} className="lg:hidden">
          <Bars3Icon className="w-7 h-7 text-gray-800" />
        </button>
      </div>

      {/* Drawer Overlay + Content */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)}></div>

          {/* drawer */}
          <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl p-6 flex flex-col gap-4 transform transition-transform duration-300">
            <div className="flex items-center justify-between mb-6">
              <Image src="/images/logo.png" alt="HerFit Logo" width={55} height={18} />
              <button onClick={() => setOpen(false)}>
                <XMarkIcon className="w-7 h-7 text-gray-700" />
              </button>
            </div>

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium hover:text-primary"
              >
                {link.label}
              </Link>
            ))}

            {!session?.user ? (
              <div className="flex flex-col gap-3 pt-6">
                <Button asChild variant="secondary" size="header">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild variant="default" size="header">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <>
                <Link href="/dashboard" className="pt-6">Dashboard</Link>
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="text-left text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;