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
import Title from "@/components/atomics/title";
import { signOut, useSession } from "next-auth/react";

function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="container mx-auto fixed inset-x-0 top-[20px] z-20">
      <div className="p-4 md:px-6 rounded-[20px] bg-white flex flex-wrap md:flex-nowrap justify-between items-center gap-y-4 shadow-md">
        <Link href="/">
          <Image src="/images/logo.png" alt="HerFit" height={18} width={55} />
        </Link>

        {/* Menu */}
        <nav className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-2 text-xs md:text-sm font-semibold">
          <Link href="/#about-section" className="hover:text-primary">Tentang Kami</Link>
          <Link href="/#benefits-section" className="hover:text-primary">Fasilitas</Link>
          <Link href="/#membership-listing" className="hover:text-primary">Membership</Link>
          <Link href="/#other-listing" className="hover:text-primary">Produk Lainnya</Link>
          <Link href="/#location-section" className="hover:text-primary">Lokasi</Link>
          <Link href="/#faq-section" className="hover:text-primary">FAQ</Link>
          <Link href="/#contact-section" className="hover:text-primary">Hubungi Kami</Link>
          <Link href="/chat" className="hover:text-primary">Chatbot AI</Link>
        </nav>

        {/* Auth */}
        <div
          data-login={!!session?.user}
          className="data-[login=true]:hidden data-[login=false]:flex items-center space-x-2 md:space-x-3"
        >
          <Button variant="secondary" size="header">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button variant="default" size="header" className="shadow-button">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            data-login={!!session?.user}
            className="data-[login=false]:hidden outline-none"
          >
            <div className="flex items-center space-x-2">
              <Title title={session?.user.name} section="header" />
              <Image
                src="/images/avatar.webp"
                alt="avatar"
                height={40}
                width={40}
                className="rounded-full"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[220px] mr-8 space-y-4">
            <DropdownMenuItem><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;