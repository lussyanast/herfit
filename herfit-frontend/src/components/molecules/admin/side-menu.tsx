import Image from "next/image";
import ItemMenu from "./item-menu";
import Link from "next/link";

function SideMenu() {
  return (
    <nav className="bg-white w-full max-w-[250px] px-6 py-[30px] rounded-[20px] h-fit">
      <Link href="/">
        <Image src="/images/logo.png" alt="HerFit" height={36} width={133} />
      </Link>

      <div className="mt-[37.5px]">
        <ul className="mt-3.5 flex flex-col space-y-6">
          <ItemMenu
            image="/icons/building.svg"
            title="dashboard"
            url="/dashboard"
          />
          <ItemMenu
            image="/icons/card.svg"
            title="riwayat transaksi"
            url="/dashboard/my-transactions"
          />
          <ItemMenu
            image="/icons/list-check.svg"
            title="template latihan"
            url="/dashboard/workout-templates"
          />
          <ItemMenu
            image="/icons/setting.svg"
            title="ubah data pribadi"
            url="/dashboard/edit-profile"
          />
        </ul>
      </div>
    </nav>
  );
}

export default SideMenu;
