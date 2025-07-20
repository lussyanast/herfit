import Image from "next/image";
import ItemMenu from "./item-menu";
import Link from "next/link";

function SideMenu() {
  return (
    <aside className="bg-white w-full max-w-[240px] px-6 py-8 rounded-2xl shadow-md h-fit min-h-screen flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="HerFit"
              height={40}
              width={120}
              className="mx-auto"
              priority
            />
          </Link>
        </div>

        {/* Menu */}
        <nav>
          <ul className="space-y-5">
            <ItemMenu image="/icons/building-4.svg" title="beranda" url="/" />
            <ItemMenu image="/icons/building.svg" title="dashboard" url="/dashboard" />
            <ItemMenu image="/icons/card.svg" title="riwayat transaksi" url="/dashboard/my-transactions" />
            <ItemMenu image="/icons/sun-fog.svg" title="herFeed" url="/dashboard/feed" />
            <ItemMenu image="/icons/sms.svg" title="template latihan" url="/dashboard/workout-templates" />
            <ItemMenu image="/icons/coffee.svg" title="riwayat konsumsi" url="/dashboard/food-consumed" />
            <ItemMenu image="/icons/setting.svg" title="ubah data pribadi" url="/dashboard/edit-profile" />
          </ul>
        </nav>
      </div>

      {/* Footer optional */}
      <div className="text-center text-xs text-gray-400 mt-10">
        © {new Date().getFullYear()} HerFit
      </div>
    </aside>
  );
}

export default SideMenu;