"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function ItemMenu({
  image,
  title,
  url,
}: {
  image: string;
  title: string;
  url: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === url;

  return (
    <li>
      <Link href={url}>
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition duration-200 ${
            isActive
              ? 'bg-orange-100 text-orange-600 font-semibold'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Image src={image} alt={title} width={22} height={22} />
          <span className="capitalize text-sm">{title}</span>
        </div>
      </Link>
    </li>
  );
}

export default ItemMenu;