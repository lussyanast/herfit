"use client";
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
  console.log("~ Header ~ session:", session);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="container mx-auto fixed inset-x-0 top-[30px] z-20">
      <div className="p-[30px] rounded-[30px] bg-white flex justify-between items-center">
        <Link href="/">
          <Image src="/images/logo.png" alt="HerFit" height={20} width={60} />
        </Link>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          <button onClick={() => scrollToSection("about-section")} className="hover:text-primary">Tentang Kami</button>
          <button onClick={() => scrollToSection("benefits-section")} className="hover:text-primary">Fasilitas</button>
          <button onClick={() => scrollToSection("membership-listing")} className="hover:text-primary">Membership</button>
          <button onClick={() => scrollToSection("other-listing")} className="hover:text-primary">Produk Lainnya</button>
          <button onClick={() => scrollToSection("location-section")} className="hover:text-primary">Lokasi</button>
          <button onClick={() => scrollToSection("faq-section")} className="hover:text-primary">FAQ</button>
          <button onClick={() => scrollToSection("contact-section")} className="hover:text-primary">Hubungi Kami</button>
        </nav>

        <div
          data-login={!!session?.user}
          className="data-[login=true]:hidden data-[login=false]:flex items-center space-x-3"
        >
          <Button variant="secondary" size="header">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button variant="default" size="header" className="shadow-button">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>

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
                height={48}
                width={48}
                className="rounded-full"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[240px] mr-8 space-y-4">
            <DropdownMenuItem>
              <Link href={"/dashboard"}>Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/dashboard/my-listings"}>My Listings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>My Rentals</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
