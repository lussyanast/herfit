"use client";

import { Button } from "@/components/atomics/button";
import Title from "@/components/atomics/title";
import CardBenefit from "@/components/molecules/card/card-benefit";
import CardPurpose from "@/components/molecules/card/card-purpose";
import ListingShowcase from "@/components/molecules/listing/listing-showcase";

function Home() {
  return (
    <main>
      {/* HERO */}
      <section
        id="hero-section"
        className="relative bg-[url('/images/bg-image.png')] bg-repeat bg-right bg-[length:auto_100%] lg:bg-[length:60%_100%] min-h-[750px] xl:min-h-[850px] flex items-center justify-center overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-black/40 before:z-0"
      >
        <div className="container mx-auto relative z-10 flex justify-center items-center text-center px-4">
          <div className="max-w-xl">
            <Title
              title="Jadilah Versi Terbaik Dirimu bersama HerFit"
              subtitle="Temukan ruang kebugaran khusus perempuan yang mendukung kenyamanan, keamanan, dan semangatmu dalam berolahraga."
              section="hero"
            />
          </div>
        </div>
      </section>

      {/* CHATBOT */}
      <section className="container mx-auto mt-14 px-4">
        <div className="bg-gradient-to-r from-[#ffb199] to-[#ff0844] text-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Tanya Gemini, AI Asisten Gym Kamu!</h2>
            <p className="text-base leading-relaxed">
              Bingung mulai dari mana? Mau tanya soal jadwal latihan, tips diet, atau program keanggotaan?
              Gunakan fitur <strong>Chatbot AI</strong> kami yang ditenagai oleh <strong>Gemini dari Google</strong>. Dapatkan jawaban instan kapan saja kamu butuh bantuan!
            </p>
          </div>
          <div className="text-center">
            <a
              href="/chat"
              className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-full shadow hover:scale-105 transition-transform"
            >
              Mulai Chat
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about-section" className="container mx-auto my-24 px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Tentang Kami</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            <strong>HerFit Ladies Gym</strong> adalah pusat kebugaran eksklusif yang dirancang khusus untuk perempuan. Berdiri sejak <strong>18 Agustus 2024</strong>, HerFit hadir sebagai ruang aman, nyaman, dan penuh semangat bagi para wanita yang ingin menjalani gaya hidup sehat dan aktif. <br /><br />
            Lebih dari sekadar gym, HerFit adalah komunitas. Di sini, kamu tidak hanya membentuk tubuh yang sehat, tetapi juga membangun kepercayaan diri, memperluas relasi, dan menjadi bagian dari gerakan perempuan yang saling mendukung dalam mencapai versi terbaik diri.
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits-section" className="container mx-auto mt-24 px-4">
        <div className="flex flex-col xl:flex-row justify-between gap-12">
          <div className="w-full xl:max-w-xl">
            <h2 className="text-[28px] font-bold leading-[42px]">
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

          <div className="w-full xl:max-w-2xl grid grid-cols-2 gap-4 md:gap-6">
            <CardPurpose image="/images/alat.jpg" title="" purpose="" />
            <CardPurpose image="/images/alat2.jpg" title="" purpose="" />
            <CardPurpose image="/images/alat3.jpg" title="" purpose="" />
            <CardPurpose image="/images/alat4.jpg" title="" purpose="" />
          </div>
        </div>
      </section>

      {/* LISTING */}
      <ListingShowcase id="membership-listing" title="Membership" subtitle="Telusuri pilihan keanggotaan khususmu." category="membership" />
      <ListingShowcase id="other-listing" title="Produk Lainnya" subtitle="Berbagai produk lainnya yang tersedia." category="others" />

      {/* MAP LOCATION */}
      <section id="location-section" className="container mx-auto my-24 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Lokasi Kami</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Temukan kami langsung di lokasi pusat kebugaran khusus wanita Her.Fit Ladies Gym.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-md w-full" style={{ aspectRatio: "16/9" }}>
          <iframe
            title="Lokasi Her.Fit Ladies Gym"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7117498133534!2d106.9379705753429!3d-6.301554493687597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e699332bfb7260b%3A0xece285f91f9d44c4!2sHer.Fit_ladiesgym!5e0!3m2!1sen!2sid!4v1744368457510!5m2!1sen!2sid"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq-section" className="container mx-auto my-24 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Pertanyaan Umum (FAQ)</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Temukan jawaban atas pertanyaan yang sering diajukan seputar layanan HerFit.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-gray-50 border border-border rounded-lg p-5 shadow-sm">
            <h4 className="font-semibold text-lg mb-1">Apa saja syarat menjadi member HerFit?</h4>
            <p className="text-muted-foreground text-sm">
              Kamu hanya perlu membuat akun di website dan memilih jenis membership yang sesuai dengan kebutuhan.
            </p>
          </div>
          <div className="bg-gray-50 border border-border rounded-lg p-5 shadow-sm">
            <h4 className="font-semibold text-lg mb-1">Apakah HerFit menerima member pemula?</h4>
            <p className="text-muted-foreground text-sm">
              Tentu! HerFit terbuka untuk semua kalangan, termasuk pemula maupun yang sudah berpengalaman.
            </p>
          </div>
          <div className="bg-gray-50 border border-border rounded-lg p-5 shadow-sm">
            <h4 className="font-semibold text-lg mb-1">Apakah tersedia pelatih atau instruktur?</h4>
            <p className="text-muted-foreground text-sm">
              Saat ini kami belum menyediakan instruktur tetap. Namun, jika kamu ingin membawa pelatih pribadi, silakan hubungi kami terlebih dahulu.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact-section" className="container mx-auto my-24 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Hubungi Kami</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
            <input type="text" id="name" required className="mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Pesan</label>
            <textarea id="message" required rows={4} className="mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
          </div>
          <div className="text-center">
            <Button type="submit" variant="default" size="header">Kirim via WhatsApp</Button>
          </div>
        </form>
      </section>

      {/* INSTAGRAM */}
      <section id="instagram-section" className="container mx-auto my-24 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Instagram Kami</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Lihat update aktivitas terbaru kami melalui Instagram resmi Her.Fit Ladies Gym.
          </p>
          <a
            href="https://www.instagram.com/her.fit_ladies?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Kunjungi Instagram
          </a>
        </div>
      </section>

      {/* REVIEW */}
      <section id="review-section" className="container mx-auto my-24 px-4">
        {/* Optional future implementation */}
      </section>
    </main>
  );
}

export default Home;