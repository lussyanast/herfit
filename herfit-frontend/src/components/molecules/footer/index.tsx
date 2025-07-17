'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/atomics/separator';
import { FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="mt-24 bg-[#675371] text-white">
      <div className="container mx-auto px-6 py-20">
        {/* Grid Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Menu Navigasi */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#about-section" className="hover:underline">Tentang Kami</Link></li>
              <li><Link href="/#benefits-section" className="hover:underline">Fasilitas</Link></li>
              <li><Link href="/#membership-listing" className="hover:underline">Membership</Link></li>
              <li><Link href="/#other-listing" className="hover:underline">Produk Lainnya</Link></li>
              <li><Link href="/#location-section" className="hover:underline">Lokasi</Link></li>
              <li><Link href="/chat" className="hover:underline">Chatbot AI</Link></li>
            </ul>
          </div>

          {/* Menu Bantuan */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Bantuan</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#faq-section" className="hover:underline">FAQ</Link></li>
              <li><Link href="/#contact-section" className="hover:underline">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Instagram */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Ikuti Kami</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/her.fit_ladies?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <FaInstagram className="w-5 h-5" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Logo dan Copyright */}
          <div className="flex flex-col justify-between">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="HerFit"
                width={133}
                height={36}
                className="mb-4"
              />
            </Link>
            <span className="text-sm text-white/70">
              © {new Date().getFullYear()} HerFit. All rights reserved.
            </span>
          </div>
        </div>

        {/* Garis Bawah */}
        <Separator className="bg-white/30" />
      </div>
    </footer>
  );
}

export default Footer;