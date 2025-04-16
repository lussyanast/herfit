"use client"

import CardIndicator from "@/components/molecules/card/card-indicator";
import { Button } from "@/components/atomics/button";
import { Input } from "@/components/atomics/input";
import { Separator } from "@/components/atomics/separator";
import Title from "@/components/atomics/title";
import Image from "next/image";
import CardBenefit from "@/components/molecules/card/card-benefit";
import CardPurpose from "@/components/molecules/card/card-purpose";
import ListingShowcase from "@/components/molecules/listing/listing-showcase";

function Home() {
  return (
    <main>
      <section
        id="hero-section"
        className={`
          relative 
          bg-primary-foreground bg-repeat bg-right 
          bg-[length:auto_100%] lg:bg-[length:60%_100%] 
          bg-[url('/images/bg-image.png')] 
          min-h-[750px] xl:min-h-[850px] 
          flex items-center justify-center 
          overflow-hidden
          before:content-[''] before:absolute before:inset-0 
          before:bg-black/40 before:z-0
        `}
      >
        <div className="container mx-auto flex justify-center items-center text-center relative z-10">
          <div className="max-w-[555px]">
            <Title
              title="Jadilah Versi Terbaik Dirimu bersama HerFit"
              subtitle="Temukan ruang kebugaran khusus perempuan yang mendukung kenyamanan, keamanan, dan semangatmu dalam berolahraga."
              section="hero"
            />
          </div>
        </div>
      </section>

      <section
        id="about-section"
        className="container mx-auto my-[100px] px-4 xl:px-0"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Tentang Kami</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            <strong>HerFit Ladies Gym</strong> adalah pusat kebugaran eksklusif yang dirancang khusus untuk perempuan. Berdiri sejak <strong>18 Agustus 2024</strong>, HerFit hadir sebagai ruang aman, nyaman, dan penuh semangat bagi para wanita yang ingin menjalani gaya hidup sehat dan aktif. Kami memahami bahwa setiap perempuan memiliki kebutuhan unik dalam berolahraga—oleh karena itu, HerFit menghadirkan lingkungan yang suportif dengan fasilitas modern, instruktur profesional, dan berbagai program kebugaran yang menyenangkan.
            <br /><br />
            Lebih dari sekadar gym, HerFit adalah komunitas. Di sini, kamu tidak hanya membentuk tubuh yang sehat, tetapi juga membangun kepercayaan diri, memperluas relasi, dan menjadi bagian dari gerakan perempuan yang saling mendukung dalam mencapai versi terbaik diri.
          </p>
        </div>
      </section>

      <section
        id="benefits-section"
        className="px-6 xl:px-10 xl:container xl:mx-auto mt-[100px]"
      >
        <div className="flex flex-col xl:flex-row justify-between gap-12 xl:gap-4">

          <div className="w-full max-w-xl">
            <h2 className="font-bold text-[28px] leading-[42px] ">
              Fasilitas Unggulan untuk Kenyamanan Olahragamu
            </h2>
            <ul className="mt-8 space-y-4 text-base text-muted-foreground">
              <CardBenefit benefit="Ruangan ber-AC yang sejuk dan nyaman" />
              <CardBenefit benefit="Tersedia area parkir untuk mobil & motor" />
              <CardBenefit benefit="Ruang ganti modern dilengkapi loker pribadi" />
              <CardBenefit benefit="Fasilitas toilet yang bersih dan terawat" />
              <CardBenefit benefit="Tersedia beragam alat olahraga modern" />
              <CardBenefit benefit="Dikhususkan untuk perempuan, lebih aman & nyaman" />
            </ul>
          </div>

          <div className="w-full max-w-2xl grid grid-cols-2 gap-6 xl:gap-[30px]">
            <CardPurpose
              image="/images/alat.jpg"
              title=""
              purpose=""
            />
            <CardPurpose
              image="/images/alat2.jpg"
              title=""
              purpose=""
            />
            <CardPurpose
              image="/images/alat3.jpg"
              title=""
              purpose=""
            />
            <CardPurpose
              image="/images/alat4.jpg"
              title=""
              purpose=""
            />
          </div>
        </div>
      </section>

      <ListingShowcase
        id="membership-listing"
        title="Membership"
        subtitle="Telusuri pilihan keanggotaan khususmu."
        category="membership"
      />

      <ListingShowcase
        id="other-listing"
        title="Produk Lainnya"
        subtitle="Berbagai produk lainnya yang tersedia."
        category="others"
      />

      <section
        id="location-section"
        className="container mx-auto my-[100px] px-4 xl:px-0"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Lokasi Kami</h2>
          <p className="text-muted-foreground max-w-[500px] mx-auto">
            Temukan kami langsung di lokasi pusat kebugaran khusus wanita Her.Fit Ladies Gym.
          </p>
        </div>
        <div className="rounded-[20px] overflow-hidden shadow-md">
          <iframe
            title="Lokasi Her.Fit Ladies Gym"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7117498133534!2d106.9379705753429!3d-6.301554493687597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e699332bfb7260b%3A0xece285f91f9d44c4!2sHer.Fit_ladiesgym!5e0!3m2!1sen!2sid!4v1744368457510!5m2!1sen!2sid"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <section id="faq-section" className="container mx-auto my-[100px] px-4 xl:px-0">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Pertanyaan Umum (FAQ)</h2>
          <p className="text-muted-foreground max-w-[500px] mx-auto">
            Temukan jawaban dari pertanyaan-pertanyaan yang sering diajukan.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-lg">Apakah HerFit hanya untuk perempuan?</h3>
            <p className="text-muted-foreground mt-2">
              Ya, HerFit adalah gym eksklusif khusus untuk perempuan demi menjaga kenyamanan dan privasi member kami.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-lg">Apakah tersedia instruktur atau personal trainer?</h3>
            <p className="text-muted-foreground mt-2">
              Tidak, kami tidak menyediakan personal trainer atau PT. Namun kamu bisa membawa personal trainer kamu kesini.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-lg">Bagaimana cara mendaftar menjadi member?</h3>
            <p className="text-muted-foreground mt-2">
              Anda dapat langsung mendaftar melalui halaman <strong>Membership</strong> di website ini dengan cara mendaftarkan akun terlebih dahulu.
            </p>
          </div>
        </div>
      </section>

      <section
        id="contact-section"
        className="container mx-auto my-[100px] px-4 xl:px-0"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Hubungi Kami</h2>
          <p className="text-muted-foreground max-w-[500px] mx-auto">
            Kirimkan pertanyaan atau kebutuhan Anda, dan kami akan menghubungi Anda melalui WhatsApp.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = (document.getElementById("name") as HTMLInputElement).value;
            const message = (document.getElementById("message") as HTMLTextAreaElement).value;
            const text = `Halo, saya ${name}. ${message}`;
            const encodedText = encodeURIComponent(text);
            window.open(`https://wa.me/6282261291606?text=${encodedText}`, "_blank");
          }}
          className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              type="text"
              id="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Pesan
            </label>
            <textarea
              id="message"
              required
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
            />
          </div>
          <div className="text-center">
            <Button type="submit" variant="default" size="header">
              Kirim via WhatsApp
            </Button>
          </div>
        </form>
      </section>

      <section id="review-section" className="container mx-auto my-[100px]">
      </section>
    </main>
  );
}

export default Home;
