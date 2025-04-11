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
    <footer className="bg-secondary mt-[100px] text-white">
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

          {/* Form Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Subscribe & Free Rewards</h4>
            <form className="flex items-center bg-white rounded-full overflow-hidden max-w-md">
              <div className="flex items-center pl-4">
                <Image src="/icons/sms.svg" alt="icon" width={20} height={20} />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none bg-white"
              />
              <button
                type="submit"
                className="bg-primary text-white text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Garis Pembatas */}
        <Separator className="my-[50px] bg-separator-foreground" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/">
            <Image
              src="/images/logo-white.svg"
              alt="nidejia"
              height={36}
              width={133}
            />
          </Link>
          <span className="text-sm text-center sm:text-right">
            © {new Date().getFullYear()} All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;