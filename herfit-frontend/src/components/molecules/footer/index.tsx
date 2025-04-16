"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/atomics/separator';

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-[50px]">
          {/* Menu Navigasi */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Menu</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:underline">Membership</Link></li>
              <li><Link href="#" className="hover:underline">Produk Lainnya</Link></li>
              <li>
                <button
                  onClick={() => scrollToSection('location-section')}
                  className="hover:underline text-left"
                >
                  Lokasi
                </button>
              </li>
              <li><Link href="#" className="hover:underline">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Menu Bantuan */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Bantuan</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:underline">FAQ</Link></li>
              <li>
                <button
                  onClick={() => scrollToSection('contact-section')}
                  className="hover:underline text-left"
                >
                  Kontak
                </button>
              </li>
              <li><Link href="#" className="hover:underline">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:underline">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="HerFit"
                height={36}
                width={133}
              />
            </Link>
            <span className="text-sm text-center sm:text-right">
              © {new Date().getFullYear()} All Rights Reserved.
            </span>
          </div>
        </div>

        {/* Garis Pembatas */}
        <Separator className="my-[50px] bg-separator-foreground" />
      </div>
    </footer>
  );
}

export default Footer;