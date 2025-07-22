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

  const avatarUrl = session?.user?.foto_profil?.startsWith("http")
    ? session.user.foto_profil
    : `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL?.replace(/\/$/, "")}/storage/${session?.user?.foto_profil?.replace(/^storage\//, "")}`;

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

        {/* Desktop Auth */}
        {!session?.user ? (
          <div className="hidden lg:flex items-center space-x-2">
            <Button variant="secondary" size="header">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button variant="default" size="header" className="shadow-button">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        ) : (
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="text-sm font-bold text-gray-800 max-w-[120px] truncate">
                    {session.user.nama_lengkap}
                  </div>
                  <Image
                    src={avatarUrl || "/images/avatar.png"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full border object-cover"
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

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)}></div>

          {/* Drawer Content */}
          <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <Image src="/images/logo.png" alt="HerFit Logo" width={50} height={18} />
              <button onClick={() => setOpen(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Profile Section */}
            {session?.user && (
              <div className="flex items-center gap-3 p-5 border-b">
                <Image
                  src={avatarUrl}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-full border object-cover"
                  unoptimized
                />
                <div>
                  <p className="text-sm font-semibold truncate">{session.user.nama_lengkap}</p>
                  <p className="text-xs text-gray-500">Member</p>
                </div>
              </div>
            )}

            {/* Menu */}
            <nav className="flex-1 px-5 py-4 space-y-3 overflow-y-auto text-sm font-medium">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-1 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <hr className="my-4" />

              {/* Account Menu */}
              {session?.user && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block py-1"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                    className="block py-1 text-left text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;