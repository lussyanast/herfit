"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/atomics/separator';
import { FaInstagram } from "react-icons/fa";

function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="mt-[100px] text-white" style={{ backgroundColor: '#675371' }}>
      <div className="container mx-auto px-[30px] py-[100px] rounded-t-[30px]">
        {/* Section atas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-[50px]">
          {/* Menu Navigasi */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Menu</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection("about-section")}
                  className="hover:underline text-left"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("benefits-section")} className="hover:underline text-left">
                  Fasilitas
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("membership-listing")}
                  className="hover:underline text-left"
                >
                  Membership
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("other-listing")}
                  className="hover:underline text-left"
                >
                  Produk Lainnya
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("location-section")}
                  className="hover:underline text-left"
                >
                  Lokasi
                </button>
              </li>
              <li>
                <Link href="/chat" className="hover:underline text-left">
                  Chatbot AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Menu Bantuan */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Bantuan</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => scrollToSection("faq-section")} className="hover:underline text-left">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("contact-section")} className="hover:underline text-left">
                  Hubungi Kami
                </button>
              </li>
            </ul>
          </div>

          {/* Instagram */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Ikuti Kami</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/her.fit_ladies?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline inline-flex items-center gap-2"
                >
                  <FaInstagram className="w-5 h-5" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-col justify-between items-start gap-4">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="HerFit"
                height={36}
                width={133}
              />
            </Link>
            <span className="text-sm">
              © {new Date().getFullYear()} All Rights Reserved.
            </span>
          </div>
        </div>

        <Separator className="my-[50px] bg-separator-foreground" />
      </div>
    </footer>
  );
}

export default Footer;
