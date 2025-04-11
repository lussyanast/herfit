"use client"

import CardIndicator from "@/components/molecules/card/card-indicator";
import { Button } from "@/components/atomics/button";
import { Input } from "@/components/atomics/input";
import { Separator } from "@/components/atomics/separator";
import Title from "@/components/atomics/title";
import categories from "@/json/categories.json";
import { CategoriesProps } from "@/interfaces/landing-page";
import Image from "next/image";
import CardBenefit from "@/components/molecules/card/card-benefit";
import CardPurpose from "@/components/molecules/card/card-purpose";
import CardReview from "@/components/molecules/card/card-review";
import ListingShowcase from "@/components/molecules/listing/listing-showcase";

function Home() {
  return (
    <main>
      <section
        id="hero-section"
        className={`bg-primary-foreground bg-cover lg:bg-contain bg-right bg-no-repeat bg-[url('/images/bg-image.svg')] min-h-[750px] max-h-[750px] xl:max-h-[850px]`}
      >
        <div className="pt-[226px] container mx-auto">
          <div className="max-w-[555px]">
            <Title
              title="Find Glorious Living And Loving Space"
              subtitle="Dolor house comfortable si amet with cheap price that also lorem when you need grow."
              section="hero"
            />
            <div className="pt-[50px] flex items-center">
              <div className="grow">
                <Input
                  placeholder="Search by city or country..."
                  variant="hero"
                />
              </div>
              <Button variant="default" size="hero">
                Explore
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="indicator-section"
        className="px-10 xl:container xl:mx-auto -mt-16 pb-9"
      >
        <div className="h-[128px] flex justify-center xl:justify-between items-center space-x-6 xl:space-x-12 bg-white shadow-indicator rounded-[20px] px-9 py-5 xl:px-[50px] xl:py-[29px]">
          <CardIndicator
            icon="/icons/house-2.svg"
            title="382M"
            subtitle="Kos Available"
            variant="indicator"
          />
          <Separator orientation="vertical" className="bg-separator" />
          <CardIndicator
            icon="/icons/people-2.svg"
            title="9/10"
            subtitle="People Happy"
            variant="indicator"
          />
          <Separator orientation="vertical" className="bg-separator" />
          <CardIndicator
            icon="/icons/security-user.svg"
            title="100%"
            subtitle="High Security"
            variant="indicator"
          />
          <Separator orientation="vertical" className="bg-separator" />
          <CardIndicator
            icon="/icons/global.svg"
            title="183"
            subtitle="Countries"
            variant="indicator"
          />
        </div>
      </section>

      <section
        id="benefits-section"
        className="px-10 xl:container xl:mx-auto mt-[100px]"
      >
        <div className="flex justify-between gap-4">
          <div className="max-w-[320px] xl:max-w-[383px]">
            <h1 className="font-bold text-[28px] leading-[42px] max-w-[350px]">
              Huge Benefits That Make You Feel Happier
            </h1>
            <ul className="mt-[30px] space-y-5">
              <CardBenefit benefit="Checking faster without depositing" />
              <CardBenefit benefit="24/7 security guarding your place" />
              <CardBenefit benefit="Fast-internet access without lagging" />
              <CardBenefit benefit="High standard of layout of houses" />
              <CardBenefit benefit="All other benefits, we promise" />
            </ul>
            <div className="mt-[30px] flex items-center space-x-3 xl:space-x-[14px]">
              <Button
                variant="default"
                size="header"
                className="flex items-center"
              >
                <Image
                  src="/icons/message-notif.svg"
                  alt="message-notif"
                  height={0}
                  width={0}
                  className="h-5 w-5 mr-2.5"
                />
                Call Sales
              </Button>
              <Button variant="third" size="header">
                All Benefits
              </Button>
            </div>
          </div>
          <div className="max-w-[650px] grid grid-cols-2 gap-6 xl:gap-[30px]">
            <CardPurpose
              image="/images/image-benefit-1.svg"
              title="House for Office and Living"
              purpose="18,309"
            />
            <CardPurpose
              image="/images/image-benefit-2.svg"
              title="House Nearby with Mall"
              purpose="84,209"
            />
            <CardPurpose
              image="/images/image-benefit-3.svg"
              title="House Historical Building"
              purpose="22,409"
            />
            <CardPurpose
              image="/images/image-benefit-4.svg"
              title="Landed House with Park"
              purpose="47,584"
            />
          </div>
        </div>
      </section>

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
