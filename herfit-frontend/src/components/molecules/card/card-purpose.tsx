"use client"

import Image from "next/image";

function CardPurpose({
  image,
  title,
  purpose,
}: {
  image: string;
  title: string;
  purpose: string;
}) {
  return (
    <figure className="relative w-full aspect-[310/200] rounded-3xl overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 310px"
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 flex flex-col p-5 text-white bg-gradient-to-t from-gradient-black to-transparent to-[30%]">
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-xl leading-[30px] max-w-[163px]">
            {title}
          </span>
          <div className="flex items-center text-sm leading-[21px]">
            <Image
              src="/icons/profile-2user.svg"
              alt="profile-icon"
              width={18}
              height={18}
              className="mr-[1.5px]"
            />
            {purpose}
          </div>
        </div>
      </div>
    </figure>
  );
}

export default CardPurpose;